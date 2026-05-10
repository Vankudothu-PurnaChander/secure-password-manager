function Button({type="button",text,onClick,className}){

    return (
       
       <button 
       type={type}
       onClick={onClick}
       className={`px-4 py-3 font-bold  w-2xl  rounded-2xl text-lg text-black ${className}`}
       >
        {text}
       </button>
       
    )
}
export default Button;