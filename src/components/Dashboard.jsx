import React, { useState, useEffect } from "react";
import { FiHome } from "react-icons/fi";
import { CgImport } from "react-icons/cg";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { FaPen } from "react-icons/fa";
import { IsAuthenticated } from "../helpers/isAuthenticated";
import { useNavigate } from "react-router-dom";
import Home from "./Home";
import Write from "./Write";
import Imports from "./Imports";
import MyCreations from "./MyCreations";
import Settings from "./Settings";

const Dashboard = () => {
  const [activeLink, setActiveLink] = useState("home");  // State to track the active link
  const navigate = useNavigate();
  
  // Handle redirection if user is not authenticated
  useEffect(() => {
    if (!IsAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Function to handle navigation and set active link
  const handleNavigation = (link) => {
    setActiveLink(link);  // Set active link state
    // Navigate to corresponding route
  };

  return (
    <div className="flex bg-gray-900 h-screen font-montserrat overflow-hidden">
      {/* Sidebar */}
      <div className="flex flex-col h-full w-1/6 bg-gray-800 shadow-inner rounded-lg">
        <div className="flex flex-col h-full">
          <ul className="flex flex-col gap-5 p-5">
            {/* Navigation Links */}
            <li
              className={`flex gap-3 items-center rounded-lg p-2 cursor-pointer ${activeLink === "home" ? "bg-gray-600" : ""}`}
              onClick={() => handleNavigation("home")}
            >
              <FiHome style={{ color: "#FBFB5C", fontSize: "25px" }} />
              <span className="text-white font-medium">Home</span>
            </li>
            <li
              className={`flex gap-3 items-center rounded-lg p-2 cursor-pointer ${activeLink === "write" ? "bg-gray-600" : ""}`}
              onClick={() => handleNavigation("write")}
            >
              <FaPen style={{ color: "#FBFB5C", fontSize: "25px" }} />
              <span className="text-white font-medium">Write</span>
            </li>
            <li
              className={`flex gap-3 items-center rounded-lg p-2 cursor-pointer ${activeLink === "imports" ? "bg-gray-600" : ""}`}
              onClick={() => handleNavigation("imports")}
            >
              <CgImport style={{ color: "#FBFB5C", fontSize: "25px" }} />
              <span className="text-white font-medium">Imports</span>
            </li>
            <li
              className={`flex gap-3 items-center rounded-lg p-2 cursor-pointer ${activeLink === "my-creations" ? "bg-gray-600" : ""}`}
              onClick={() => handleNavigation("my-creations")}
            >
              <HiOutlineDocumentText style={{ color: "#FBFB5C", fontSize: "25px" }} />
              <span className="text-white font-medium">My Creations</span>
            </li>
            <li
              className={`flex gap-3 items-center rounded-lg p-2 cursor-pointer ${activeLink === "settings" ? "bg-gray-600" : ""}`}
              onClick={() => handleNavigation("settings")}
            >
              <HiOutlineDocumentText style={{ color: "#FBFB5C", fontSize: "25px" }} />
              <span className="text-white font-medium">Settings</span>
            </li>
          </ul>
        </div>

        {/* Footer with User Email */}
        <div className="p-5">
          {user && (
            <p className="text-sm font-bold text-white">{user.email}</p>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow ">
        {/* Conditionally render based on activeLink */}
        {activeLink === "home" && <Home />}
        {activeLink === "write" && <Write />}
        {activeLink === "imports" && <Imports />}
        {activeLink === "my-creations" && <MyCreations />}
        {activeLink === "settings" && <Settings />}
      </div>
    </div>
  );
};

export default Dashboard;
