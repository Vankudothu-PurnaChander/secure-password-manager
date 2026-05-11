const app=require('./src/app');
const connectDB=require('./src/db/db');

require('dotenv').config();
connectDB()


app.get('/',(req,res)=>{
    res.send("Welcome to Password Manager API");
});
app.listen(5000,()=>{
    console.log('Server is running on port 5000');
});
