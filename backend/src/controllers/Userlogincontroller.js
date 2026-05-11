const User = require("../model/Usermodel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const handle=require('./handlepass');
const emailotp=require('./emailotp');
const { userCreation } = require("./user");

function normalize(email){
  return email.trim().toLowerCase()
}

function setTokenCookie(res, userId, email) {
  const token = jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 1,
    path: "/"
  });
}

async function registration(req,res){
   console.log("LOGIN API HIT");
  console.log(req.body);

  try{
    let {email,password}=req.body;
    email=normalize(email);
    if(!email || !password){
      return res.status(400).json({message:'email and password are required'});
    }
    const user=await userCreation(email,password);
    setTokenCookie(res, user._id, user.email);
    return res.status(201).json({
      message: 'User registered successfully',
      userId: user._id
    });
  }
  catch (err) {
    console.error('Error registering user:', err);
    return res.status(400).json({message: 'Internal server error'});
  }
}

async function login(req, res) {
   console.log("LOGIN API HIT");
  console.log(req.body);

  try {
    let {email, password} = req.body;
    email= normalize(email);
    if(!email || !password){
      return res.status(400).json({message:'email and password are required'});
    }
    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({message: 'Invalid user not found'});
    }
    const verify = await bcrypt.compare(password, user.password);
    if (!verify) {
      return res.status(401).json({message: 'Invalid credentials'});
    }
    setTokenCookie(res, user._id, user.email);
    return res.status(200).json({
      message: 'User logged in successfully',
      userId: user._id
    });
  } catch (err) {
    console.error('Error logging in user:', err);
    return res.status(500).json({message: 'Internal server error'});    
  }
}

async function updatepassword(req, res) {
  try {
    const userId=req.userId;
    if (!userId) {
      return res.status(401).json({message: 'Unauthorized - must be logged in'});
    }
    const {password, newpassword} = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    const verify = await bcrypt.compare(password, user.password);
    if (!verify) {
      return res.status(401).json({message: 'Invalid credentials'});
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(newpassword)) {
      return res.status(400).json({
        message: 'New password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
      });
    }
    const hash = await bcrypt.hash(newpassword, 10);
    await User.findOneAndUpdate({_id:userId}, {$set: {password: hash}}, {new: true});
    return res.status(200).json({message: 'Password updated successfully'});
  } catch (err) {
    console.error('Error updating password:', err);
    return res.status(500).json({message: 'Internal server error'});
  }
}

async function logout(req, res) {
  const token = req.cookies && req.cookies.token;
  if (!token) {
    return res.status(401).json({message: 'No active session to logout'});
  }
  res.clearCookie("token", {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    path: "/"
  });
  return res.status(200).json({message: 'User logged out successfully'});
}
 
async function forgotpassword(req,res){
  try{
    const {email}=req.body;
  if(!email){
    return res.status(400).json({message:'email is required'});
  }
  const user= await User.findOne({email:normalize(email)});
  if(!user){
    return res.status(404).json({message:'User not found'});
  }
  await emailotp.forotp(req,res);
  
  return res.status(200).json({message:'OTP sent to email if user exists'});
  }
  catch(err){
    console.error('Error in forgot password:', err);
    return res.status(500).json({message:'Internal server error'}); 

}}


module.exports = {registration,login, updatepassword, logout};
