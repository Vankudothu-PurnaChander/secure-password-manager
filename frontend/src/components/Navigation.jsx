import { Link } from "react-router-dom";

function Navigation(){
   
    return(
        <nav className="flex gap-10 justify-end py-8 px-20 font-bold text-2xl text-white">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <Link to="/about" className="hover:text-orange-600">About</Link>
            <Link to="/contact" className="hover:text-orange-600">Contact</Link>
            <Link to="/profile" className="hover:text-orange-600 rounded-2xl px-4 py-4 border-black bg-white"></Link>
             
          
        </nav>
    )
}
export default Navigation;
