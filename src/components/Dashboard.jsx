import React, { useEffect } from "react";
import { FiHome } from "react-icons/fi";
import { CgImport } from "react-icons/cg";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { FaPen } from "react-icons/fa";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import AuthContext

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth(); // Use context to get user and token

  // Handle redirection if user is not authenticated
  useEffect(() => {
    if (!auth.user) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [auth, navigate]);

  // Ensure a default route is set when accessing /dashboard
  useEffect(() => {
    if (
      auth.user &&
      (location.pathname === "/dashboard" || location.pathname === "/dashboard/")
    ) {
      navigate("/dashboard/home", { replace: true });
    }
  }, [auth, location, navigate]);

  // Function to determine the active link based on the current path
  const getActiveLink = () => {
    const path = location.pathname.split("/").pop();
    return path || "home";
  };

  // Function to handle navigation
  const handleNavigation = (link) => {
    navigate(`/dashboard/${link}`);
  };

  return (
    <div className="flex bg-gray-900 h-screen font-montserrat overflow-hidden">
      {/* Sidebar */}
      <div className="flex flex-col h-full w-1/6 bg-gray-800 shadow-inner rounded-lg">
        <div className="flex flex-col h-full">
          <ul className="flex flex-col gap-5 p-5">
            {/* Navigation Links */}
            <li
              className={`flex gap-3 items-center rounded-lg p-2 cursor-pointer ${
                getActiveLink() === "home" ? "bg-gray-600" : ""
              }`}
              onClick={() => handleNavigation("home")}
            >
              <FiHome style={{ color: "#FBFB5C", fontSize: "25px" }} />
              <span className="text-white font-medium">Home</span>
            </li>
            <li
              className={`flex gap-3 items-center rounded-lg p-2 cursor-pointer ${
                getActiveLink() === "write" ? "bg-gray-600" : ""
              }`}
              onClick={() => handleNavigation("write")}
            >
              <FaPen style={{ color: "#FBFB5C", fontSize: "25px" }} />
              <span className="text-white font-medium">Write</span>
            </li>
            <li
              className={`flex gap-3 items-center rounded-lg p-2 cursor-pointer ${
                getActiveLink() === "imports" ? "bg-gray-600" : ""
              }`}
              onClick={() => handleNavigation("imports")}
            >
              <CgImport style={{ color: "#FBFB5C", fontSize: "25px" }} />
              <span className="text-white font-medium">Imports</span>
            </li>
            <li
              className={`flex gap-3 items-center rounded-lg p-2 cursor-pointer ${
                getActiveLink() === "my-creations" ? "bg-gray-600" : ""
              }`}
              onClick={() => handleNavigation("my-creations")}
            >
              <HiOutlineDocumentText style={{ color: "#FBFB5C", fontSize: "25px" }} />
              <span className="text-white font-medium">My Creations</span>
            </li>
            <li
              className={`flex gap-3 items-center rounded-lg p-2 cursor-pointer ${
                getActiveLink() === "settings" ? "bg-gray-600" : ""
              }`}
              onClick={() => handleNavigation("settings")}
            >
              <HiOutlineDocumentText style={{ color: "#FBFB5C", fontSize: "25px" }} />
              <span className="text-white font-medium">Settings</span>
            </li>
          </ul>
        </div>

        {/* Footer with User Email */}
        <div className="p-5">
          {auth?.user && (
            <p className="text-sm font-bold text-white">{auth.user.email}</p>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow">
        {/* Render nested route content */}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
