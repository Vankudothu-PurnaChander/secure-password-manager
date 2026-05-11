import Form from "../components/Form";
import Button from "../components/button";
import axios from "axios";
import useForm from "../statehandle/state";
import {useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import {useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Otppage(){

    const {formData,handleChange}=useForm({
                otp:""
            })
    const navigate=useNavigate();
    const location=useLocation();
    const { login } = useAuth();
    
    /**const resendotp=async()=>{
        await api.
    }**/
    const EnterOtp=async(e)=>{
        e.preventDefault();
        try{
            const email = location.state?.email || localStorage.getItem("email");
            const res=await axios.post("https://secure-password-manager-jcil.onrender.com/api/verifyotp",{email:email,otp:formData.otp},{withCredentials:true});
            console.log(res.data);
            if(res.status === 200){
                login();
                alert("User Registered Successfully!");
                setTimeout(() => navigate("/dashboard"), 1000);
            } else if(res.status === 400){
                alert("Invalid OTP");
            }

        }
    
        catch(err){
            console.error("error due to ",err);
            console.log(err.response?.data);
        }
    }
    const [timer,settimer]=useState(90);
    
useEffect(()=>{
        const timeleft= setInterval(()=>{
            settimer((prev)=>{
            if(prev<=1){
                clearInterval(timeleft);
                console.log("otp Expired");
                return 0
            }
            return prev-1;
            });
        },1000);
    
        return ()=>clearInterval(timeleft);
    },[]);


    
    return(
        <>
        <div className="min-h-screen page-otp flex justify-center items-center gap-5 flex-col">
            <h1 className="text-4xl text-violet-950 font-extrabold ">Enter Your Otp Here</h1>
            <div className="mt-3">
            <form onSubmit={EnterOtp} className="rounded-xl shadow-blue-600 border-black border-4 p-6 w-150  flex  flex-col gap-4">
                <Form id="otp" type="text" label="otp:" value={formData.otp} onChange={(handleChange)}></Form>
                <Button type="submit" text="Verify Otp" className="bg-amber-800 hover:bg-green-500 border-2  w-auto "></Button>
                <span>Your otp expires in {timer} seconds</span>
            </form>
            </div>
            
        </div>
        </>
    )
    
}


export default Otppage;
