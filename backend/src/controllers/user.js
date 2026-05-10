const User=require('../model/Usermodel');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const handle=require('./handlepass');
const emailotp=require('./emailotp');

const userCreation=async(email,password)=>{
  if (!email || !password) {
    throw new Error( 'Email and password are required');
  }
  if (email.length < 5 || email.length > 50) {
    throw new Error( 'Email must be between 5 and 50 characters long');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email format');
  }
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)) {
    throw new Error( 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
    );
  }

  const existingUser = await User.findOne({email});
  if (existingUser) {
    throw new Error( 'User with this email already exists');
  }
  
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hash });
  console.log('User creating....');
  console.log(`User ${email} created successfully!`);
  return user;
}

module.exports = { userCreation };