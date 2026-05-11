
import Form from "../components/Form.jsx";
import Button from "../components/button.jsx";
import useForm from "../statehandle/state.jsx";
import { useState } from "react";
import Navigation from "../components/Navigation.jsx";
import Title from "../Pages/Title.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";



function  Dashboard(){
   
const {formData,handleChange, setFormData } =useForm({
      accountemail:"",
      website:"",
      username:"",
      password:""
    });
    const [masterkey,setMasterkey]=useState("");
    const [showpopup,setShowpopup]=useState(false);
    const [mode,setMode]=useState(null);
    const [passwords,setPasswords]=useState([]);
    const handleTriggerPopup = (newMode) => {
      setMode(newMode);
      setShowpopup(true);
    };

const navigate=useNavigate();
    const handleMasterConfirm = async (e) => {
      e.preventDefault();
      try {
        // Do not force-create master key here.
        // Backend will create it on first save if it doesn't exist.
       if (mode === 'retrieve') {
          const res = await axios.post(
          "https://secure-password-manager-jcil.onrender.com/api/getdata",
          { masterkey },
          { withCredentials: true }
          );

        setPasswords(res.data);

        setShowpopup(false);
        setMasterkey("");
        setMode(null);

      console.log(res.data);
      alert("Passwords retrieved successfully! Check below.");
        }else {
          // save mode (backend will set master key if it doesn't exist)
          await axios.post(
            "https://secure-password-manager-jcil.onrender.com/api/adddata",
            { ...formData, masterkey },
            { withCredentials: true }
          );
          alert("Data saved successfully !");
          setFormData({
            accountemail: "",
            website: "",
            username: "",
            password: ""
          });
          setMasterkey("");
          setShowpopup(false);
          setMode(null);
          // stay on dashboard
        }
      } catch (err) {
        console.error(err);
        alert("Error: " + (err.response?.data?.message || err.message));
      }
    };
    const reset=()=>{
      setFormData({
        accountemail:"",
        website:"",
        username:"",
        password:"",
      });
      setMasterkey("");
    }

    return(
    <>
        
        <div className="min-h-screen scroll-smooth page-dashboard overflow-y-auto justify-center items-center ">
        <div className="flex flex-row  items-center gap-130">
          <Title />
          <Navigation />
        </div>
          <div className="flex flex-col gap-1">
<form onSubmit={(e) => {e.preventDefault(); handleTriggerPopup('save');}} className="bg-white border-2 border-black shadow-md shadow-red-600 rounded-2xl p-8 w-120 h-auto mx-auto">
              <Form label="Email" id="accountemail" type="email" placeholder="Account email" value={formData.accountemail} onChange={handleChange} required/>
              <Form label="Website" id="website" type="text" placeholder="Enter website name" value={formData.website} onChange={handleChange} required/>
              <Form label="Username" id="username" type="text" placeholder="Username for site" value={formData.username} onChange={handleChange} required/>
              <Form label="Password" id="password" type="password" placeholder="Password to encrypt" value={formData.password} onChange={handleChange} required />

              <div className="mt-6 flex gap-4 justify-center">
                <Button type="submit" text='Save Data'  className="bg-yellow-400 hover:bg-green-600 px-6 py-2 disabled:opacity-50"  />
                <Button type="reset" text="Reset" onClick={reset} className="bg-yellow-400 hover:bg-red-600 px-6 py-2" />
              </div>
            </form>
        </div>
        <div className="flex justify-center items-center flex-col gap-3 px-4">
        <h1 className="text-5xl underlined">Want To Recover The Passwords </h1>
       
        <Button text="Retrieve Passwords " onClick={() => handleTriggerPopup('retrieve')} className="bg-yellow-400 hover:bg-green-600 px-6 py-2 mt-4" />
        {passwords.length > 0 && (
          <div className="bg-white p-6 rounded-xl w-full max-w-4xl mx-auto mt-4 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Your Saved Passwords:</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Email</th>
                  <th className="border border-gray-300 p-2">Website</th>
                  <th className="border border-gray-300 p-2">Username</th>
                  <th className="border border-gray-300 p-2">Password</th>
                </tr>
              </thead>
              <tbody>
                {passwords.map((pass, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{pass.accountemail || 'N/A'}</td>
                    <td className="border border-gray-300 p-2">{pass.website || 'N/A'}</td>
                    <td className="border border-gray-300 p-2">{pass.username || 'N/A'}</td>
                    <td className="border border-gray-300 p-2font-mono bg-gray-100 p-1 rounded">{pass.password || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button 
              text="Clear List" 
              onClick={() => setPasswords([])} 
              className="bg-red-500 hover:bg-red-600 mt-4 px-4 py-2 text-white" 
            />
          </div>
        )}
          </div>
          {showpopup && (
        <div className="fixed inset-0 bg-amber-950 bg-opacity-50 flex  flex-col gap-25  justify-center items-center">
          <h1 className="text-center  text-5xl mt-4 text-yellow-600">Enter your master key to proceed.</h1>
          <div className="bg-white p-6 rounded-xl w-80">
             
 
            <h2 className="mb-3 font-bold">Enter Master Key</h2>

            <input
              type="password"
              value={masterkey}
              onChange={(e) => setMasterkey(e.target.value)}
              className="border p-2 w-full"
            />

            <div className="flex justify-between mt-4">

              <Button
                onClick={handleMasterConfirm}
                text="Confirm"
                className="bg-green-500 px-4 py-2 text-white"
              >
                Confirm
              </Button>

              <Button
                onClick={() => {setShowpopup(false); setMode(null);}}
                text="Cancel"
                className="bg-gray-400 px-4 py-2"
              >
                Cancel
              </Button>

            </div>

          </div>
        </div>
      )}
      </div>
        </>
    )
}

export default Dashboard ;