
import Form from "../components/Form.jsx";
import Button from "../components/button.jsx";
import useForm from "../statehandle/state.jsx";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import Title from "../Pages/Title.jsx";
import Info from "../Pages/Info.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";



function Loginpage() {
    const {formData,setFormData,handleChange} =useForm({
      email:"",
      password:""
    });
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const handleSubmit = async (e) => {
    e.preventDefault();
    try{
       const res= await axios.post(
        "http://localhost:5000/api/login",
        formData,
        {withCredentials:true}
        
       )
       console.log(res.data)
       if(res.status===200){
        login();
        alert("User Logged In Successfully !")
        setTimeout(()=>{
         navigate("/dashboard");},1000)

       }
       }
    catch(err){
       if(err.response && err.response.status===401){
        alert("User Not Registered, Please Register")
       }
      console.error("Login failed due to ",err);
    }
  }
  const reset=()=>{
    setFormData({
      email:"",
      password:""
    })
  }
  
    return(
    <>
        
        <div className="min-h-screen page-login flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-32 ">
          <Title />
        </div>
          <div className="flex  flex-row gap-2 mt-30">
            <Info/>
             <form onSubmit={handleSubmit} className="bg-white border-2 border-black shadow-md shadow-orange-600 rounded-2xl p-6 py-6 mr-25 w-96 h-110">
             <Form label="email" id="email" type="text" placeholder="Enter email" value={formData.email}onChange={handleChange} required/>
              <Form label="Password" id="password" type="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required/>

              <div className="mt-3 flex gap-10 justify-center">
              <Button type="submit" text="Login" className="bg-yellow-400 hover:bg-green-600" />
              <Button type="reset" onClick={reset} text="Reset" className="bg-yellow-400 hover:bg-red-600" />
              </div>
              <div className="underline  mt-2">
                <Link to="/register" >New user? Register Here</Link>
                </div>
            </form>
          </div>
        </div>
        </>
    )
}

export default Loginpage;