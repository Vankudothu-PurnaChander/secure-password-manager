import { useState } from "react";
function Form({label,id,type,placeholder,required,value,onChange}){
        
    return(
   <div className="flex  flex-col  gap-3 shadow-black shadow-sm rounded-2xl p-6 mb-auto  w-full ">  
      <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor={id} >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value || ""}
        onChange={onChange}
        className="shadow border rounded-lg w-full py-2 px-3 text-gray-700 border-purple-800" 
      /> 
    </div>
 
    )
}
export default Form;