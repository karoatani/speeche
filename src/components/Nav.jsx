import React, {useContext} from "react";
import {  Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import AuthContext

const Nav = () => {
  const { auth, logout } = useAuth(); // Use context to get user and token
  const IsAuthenticated = auth.user 
  
  return (
    <>
      {/* nav section */}
      <div className="md:p-5 flex bg-gray-900 w-full justify-between font-montserrat">
        <div>
          <h2 className="md:text-3xl md:text-bold text-white">Speechee</h2>
        </div>

        <div className="p-4 md:text-2xl">
          <ul className="flex md:justify-center md:items-center md:space-x-4">
            <li>
              {IsAuthenticated ? <Link to={`/dashboard`} className="text-white font-medium md:hover:text-pumpkin-orange md:transition-colors md:duration-300">Dashboard</Link>: <Link to={`/sign-up`} className="text-white font-medium md:hover:text-pumpkin-orange md:transition-colors md:duration-300">Sign Up</Link>
               }
              
            </li>
            <li>
              {IsAuthenticated? <Link to={`/`} className="text-white font-medium md:hover:text-pumpkin-orange md:transition-colors md:duration-300" onClick={logout}>LogOut</Link>
             : <Link to={`/login`} className="text-white font-medium md:hover:text-pumpkin-orange md:transition-colors md:duration-300">Login</Link>
            }
              
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Nav;
