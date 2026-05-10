const mongoose=require('mongoose');

const modelSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
      sparse:true},
    password:{
        type:String,
        required:true
    }
});

const User=mongoose.model('User',modelSchema);

module.exports=User;