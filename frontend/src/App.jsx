import { Routes, Route } from 'react-router-dom';
import Loginpage from './Pages/loginpage.jsx';
import Registrationpage from './Pages/registrationpage.jsx';
import Dashboard from './Pages/dashboard.jsx';
import Home from './Pages/Home.jsx';
import About from './Pages/About.jsx';
import Contact from './Pages/Contact.jsx';
import Profile from './Pages/profile.jsx';
import "./index.css";
import Otppage from "./Pages/otppage.jsx";
import { AuthProvider, RequireAuth } from './context/AuthContext.jsx';

function App(){
  return (
     <AuthProvider>
     <Routes>
          <Route path="/" element={<Loginpage />} />
          <Route path="/register" element={<Registrationpage />} />
          <Route path="/dashboard" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
          <Route path="/otppage" element={<Otppage/>}/>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }/>

     </Routes>
     </AuthProvider>
  );
}
export default App;
