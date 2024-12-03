import React, { useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";
import axios from "axios";
import Nav from "./Nav";
import Footer from "./Footer";

const SignUp = () => {
  const mutation = useMutation({
    mutationFn: (newuser) => {
      return axios.post(
        "https://speechee-backend-production.up.railway.app/api/v1/account/register/",
        newuser
      );
    },
  });
  
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  
  
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    mutation.mutate({ email, password });
    
  };

  const onSuccess =() =>{
    toast.success('Account Created Sucessfully', {toastId: "success"});
    navigate("/login");
  }

  useEffect(() => {
    if (mutation.isSuccess) {
      onSuccess();
    }
  }, [mutation.isSuccess]);
  

  useEffect(() => {
    if (mutation.isError) {
      toast.error('Error creating account', {toastId: "error"})
    }
  }, [mutation.isError]);
  
  return (
    <>
      <div className="flex flex-col h-screen bg-gray-900 text-white font-montserrat">
        {/* Navbar */}
        <Nav />

        {/* Main Content */}
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-3xl font-semibold text-center text-[#FBFB5C] mb-6">
              Sign Up
            </h2>

            {/* Email and Password Fields */}
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBFB5C]"
                  placeholder="Enter your email"
                  ref={emailRef}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBFB5C]"
                  placeholder="Enter your password"
                  minLength={7}
                  required
                  ref={passwordRef}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FBFB5C] text-gray-700 p-3 rounded-md font-semibold hover:bg-yellow-400 transition duration-200"
              >
                {mutation.isPending ? "Signing..." : "Sign Up"}
              </button>
            </form>

            {/* Google Sign-In Button */}
            <div className="mt-6 text-center">
              <button className="w-full bg-gray-700 text-white p-3 rounded-md font-semibold hover:bg-gray-600 transition duration-200 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M23.49 12.28c0-.69-.06-1.34-.18-1.96H12v3.9h6.44c-0.28 1.41-1.1 2.61-2.33 3.33v2.76h3.77c2.22-2.06 3.49-5.14 3.49-8.03z" />
                  <path d="M12 7.48c1.14 0 2.13.39 2.93 1.03l2.19-2.19C15.62 5.12 14.02 4 12 4 9.21 4 6.83 5.5 5.52 7.87l-3.79-2.98C3.07 3.01 7.21 2 12 2c4.28 0 8.02 2.06 10.36 5.2l2.41-2.41C21.76 1.95 16.34 0 12 0 5.37 0 0 5.37 0 12s5.37 12 12 12c5.52 0 10.48-3.44 12-8.28l-3.77-2.76c-1.32 2.11-3.42 3.43-5.89 3.43z" />
                </svg>
                Sign in with Google
              </button>
            </div>

            <div className="mt-4 text-center text-sm">
              <p>
                Already have an account?{" "}
                <a href="/login" className="text-[#FBFB5C] hover:underline">
                  Log In
                </a>
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default SignUp;
