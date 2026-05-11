
import Form from "../components/Form.jsx";
import Button from "../components/button.jsx";
import useForm from "../statehandle/state.jsx";
import axios from "axios";
import {useNavigate } from "react-router-dom";
import Otppage from "./otppage.jsx";


function Registrationpage() {
    const {formData,setFormData,handleChange} =useForm({
      email:"",
      password:""
    });
    const navigate=useNavigate();
const isStrongPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password);

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStrongPass) {
      alert('Please use strong password: 8+ chars, upper/lower/number/special');
      return;
    }
    
    try{
    
       const forotps=await axios.post("https://secure-password-manager-jcil.onrender.com/api/forotp",{email:formData.email,password:formData.password},{withCredentials:true});
       localStorage.setItem("email",formData.email);
      navigate("/otppage", {replace:true, state: { email: formData.email } });
      console.log(forotps.data);
      alert("Otp has sent to your registered email Sucessfully.");
       
    }
    catch(err){

  console.error("FULL ERROR:", err);

  console.log("BACKEND RESPONSE:", err.response?.data);

  console.log("STATUS:", err.response?.status);

  alert(err.response?.data?.message || "Registration failed");
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
        <div className="min-h-screen page-register flex flex-col gap-3 justify-center items-center pt-20">
        <div className="text-3xl text-black font-bold mb-8">
            Please fill to register
        </div>
          <div className="flex flex-col gap-2">
            
             <form onSubmit={handleSubmit} className="bg-white border-2 border-black shadow-md shadow-orange-600 rounded-2xl p-6 w-96">
              <Form label="Email" id="email" type="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required/>
              <Form label="Password" id="password" type="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required/>
              <p className={`text-sm ${isStrongPass ? 'text-green-600' : 'text-red-500'}`}>
                {formData.password ? (isStrongPass ? 'Strong password' : 'Password must be 8+ chars, upper/lower/number/special') : ''}
              </p>

              <div className="mt-3 flex gap-4 justify-center">
                <Button type="submit" text="Generte Otp" className="bg-yellow-400 hover:bg-green-600"/>
                <Button type="reset" onClick={reset} text="Reset" className="bg-yellow-400 hover:bg-red-600" />
              </div>
            </form>
          </div>
          </div>
        </>
    )
}

export default Registrationpage;