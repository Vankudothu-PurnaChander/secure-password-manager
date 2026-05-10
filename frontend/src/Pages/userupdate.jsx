import Form from "../components/Form";
import Button from "../components/button";
import useForm from "../statehandle/state";
import axios from "axios"

function Update(){
    const {formData,setFormData,handleChange}=useForm({
        password:"",
        newpassword:""
    })
    const handleSubmit=async(e)=>{
        e.preventDefault();
    try{
        const res=await axios.patch("http://localhost:5000/api/updatepassword",formData,{withCredentials:true})
        console.log(res.data)
        alert("User data updated Successfully .");

    }
    catch(err){
        console.error("unablr to update user data due to ",err)
    }
}
const reset=()=>{
    setFormData({
        password:"",
        newpassword:""
    })
}
return (
    <>
    <div className="flex justify-center items-center">
     <div className="text-3xl text-purple-600 font-bold">Update User Data</div>
     <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Form label="Current Password" id="password" type="password"  placeholder="Enter your current password" value={formData.password} onChange={handleChange} required/>
        <Form label="New Password" id="newpassword" type="password" placeholder="Enter your new password" value={formData.newpassword} onChange={handleChange}  required/>
        <div className="flex flex-row gap-2">
           <Button className="bg-pink-500 hover:bg-green-400" type="submit" text="Submit" ></Button>
           <Button className="bg-yellow-500 hover:bg-red-600" type="reset" text="Reset" onClick={reset}></Button>
        </div>
     </form>
    </div>
    </>
)
}

export default Update;