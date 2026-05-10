const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Datamodel = require('../model/Datamodel');

async function Masterkey(userId, masterkey) {
  // Ensure ONLY ONE master key document per user.
  const existing = await Datamodel.findOne({ userId, masterHash: { $exists: true, $ne: null } });
  if (existing) {
    throw new Error("Master key already set");
  }

  const hash = await bcrypt.hash(masterkey, 10);
  // Create a dedicated master-key doc (no accountemail/website fields).
  return await Datamodel.create({ userId, masterHash: hash });
}

async function Comparekey(userId, masterkey) {
  const doc = await Datamodel.findOne({ userId, masterHash: { $exists: true, $ne: null } });
  if (!doc) throw new Error("Master key not set");

  const ok = await bcrypt.compare(masterkey, doc.masterHash);
  if (!ok) throw new Error("Invalid master key");
  return true;
}


function deriveKey(masterkey, salt) {
  return crypto.pbkdf2Sync(masterkey, salt, 100000, 32, 'sha256');
}

function Encrypt(text, masterkey) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(16);

  const key = deriveKey(masterkey, salt);

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');

  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    salt: salt.toString('hex')
  };
}

function Decrypt(encrypted, masterkey, iv, salt) {
  const key = deriveKey(masterkey, Buffer.from(salt, 'hex'));

  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    key,
    Buffer.from(iv, 'hex')
  );

  let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  return decrypted;
}

module.exports = {
  Masterkey,
  Comparekey,
  Encrypt,
  Decrypt
};