const nodemailer=require("nodemailer");
const {userCreation} =require("./user");
require('dotenv').config();
const jwt = require("jsonwebtoken");



function setTokenCookie(res, userId, email) {
  const token = jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 1
  });
}

const sendotp=async(email,otp)=>{
    const transporter= nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.ADMIN_EMAIL,
            pass:process.env.ADMIN_PASSWORD
        }
    });
    const mailOptions = {
        from:process.env.ADMIN_EMAIL,
        to: email,
        subject: "OTP Verification for Password Manager.",
        text: `Your OTP is: ${otp}`
  };

  await transporter.sendMail(mailOptions);
};

const otpStore={}
const forotp = async (req, res) => {
  const { email,password } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = {
    password,
    otp: otp,
    expiresAt: Date.now() + 90 * 1000
  };

  await sendotp(email, otp);

  res.send("OTP sent successfully");
};

const verifyotp = async (req, res) => {
  const { email,otp } = req.body;

  const record = otpStore[email];

  if (!record) {
    return res.json({ message: "No OTP found" });
  }

  // check expiry
  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  // check OTP
  if (record.otp == otp) {
    const password=record.password;
    try {
      const user = await userCreation(email,password);
      setTokenCookie(res, user._id, user.email);
      delete otpStore[email]; // remove after success
      return res.status(200).json({ message: "OTP verified successfully" });
    } catch (err) {
      console.error("Error creating user via OTP:", err);
      return res.status(400).json({ message: err.message || "User creation failed" });
    }
  }



  return res.status(400).json({ message: "Invalid OTP" });
};

module.exports={forotp,verifyotp}
