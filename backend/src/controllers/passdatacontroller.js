const Datamodel = require('../model/Datamodel');
const handlepass = require('./handlepass');

async function Masterkey(req, res) {
  try {
    const userId = req.userId;
    const { masterkey } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!masterkey) return res.status(400).json({ message: "Master key required" });

    await handlepass.Masterkey(userId, masterkey);
    return res.json({ message: "Master key saved" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function addData(req, res) {
  try {
    const userId = req.userId;
    const { accountemail, website, username, password, masterkey } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!masterkey) return res.status(400).json({ message: "Master key required" });

    if (!accountemail || !website || !username || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // If master key doc doesn't exist for this user, create it.
    const existingMaster = await Datamodel.findOne({
      userId,
      masterHash: { $exists: true, $ne: null }
    });

    if (!existingMaster) {
      await handlepass.Masterkey(userId, masterkey);
    } else {
      await handlepass.Comparekey(userId, masterkey);
    }

    const encrypted = handlepass.Encrypt(password, masterkey);

    await Datamodel.create({
      userId,
      accountemail,
      website,
      username,
      password: encrypted.encryptedData,
      iv: encrypted.iv,
      salt: encrypted.salt
    });

    return res.json({ message: "Data saved successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


async function getData(req, res) {
  try {
    const userId = req.userId;
    const { masterkey } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!masterkey) return res.status(400).json({ message: "Master key required" });

    await handlepass.Comparekey(userId, masterkey);

    // Only return real saved passwords (master key doc has no accountemail/website).
    const dataList = await Datamodel.find({
      userId,
      accountemail: { $exists: true, $ne: null },
      website: { $exists: true, $ne: null }
    }).select('-masterHash');

    const decryptedList = dataList.map(data => ({
      accountemail: data.accountemail,
      website: data.website,
      username: data.username,
      password: handlepass.Decrypt(data.password, masterkey, data.iv, data.salt)
    }));

    return res.json(decryptedList);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


async function updateData(req, res) {
  try {
    const userId = req.userId;
    const { accountemail, website, username, newPassword, masterkey } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!masterkey) return res.status(400).json({ message: "Master key required" });

    await handlepass.Comparekey(userId, masterkey);

    const encrypted = handlepass.Encrypt(newPassword, masterkey);

    await Datamodel.findOneAndUpdate(
      { userId, accountemail, website, username },
      {
        password: encrypted.encryptedData,
        iv: encrypted.iv,
        salt: encrypted.salt
      },
      { new: true }
    );

    return res.json({ message: "Updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function deleteData(req, res) {
  try {
    const userId = req.userId;
    const { accountemail, website, username, masterkey } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!masterkey) return res.status(400).json({ message: "Master key required" });

    await handlepass.Comparekey(userId, masterkey);

    await Datamodel.findOneAndDelete({
      userId,
      accountemail,
      website,
      username
    });

    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


module.exports = {
  Masterkey,
  addData,
  getData,
  updateData,
  deleteData
};