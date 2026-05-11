
import Button from "../components/button";
import axios from "axios";
import {Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Profile(){
    const { logout } = useAuth();
    const navigate = useNavigate();
    
    const handlelogout=async()=>{
    try{
        const res=await axios.delete("https://secure-password-manager-jcil.onrender.com/api/logout",{withCredentials:true});
        if(res.status===200){
            logout();
            alert("User loggedout Successfully.");
            navigate("/");
        }
    }
    catch(err){
        console.error("Unable to logout due to ",err);
        alert("Logout Failed.....");
    }
}
    return(
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-orange-600">Update Profile</h1>
            <Link to="/profile/update" className="underlined to-blue-900">Update Profile</Link>
            <Button className="bg-sky-800" type="button" text="Logout" onClick={handlelogout}></Button>
        </div>
    )
}

export default Profile;
