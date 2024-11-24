import React, {useState} from "react";
import SpeechRecognitionEffect from "./components/SpeechRecognitionEffect";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { useNavigate } from "react-router-dom";


// Global Authentication state
const App = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen min-w-screen bg-gray-900 text-white flex flex-col font-montserrat ">
      <Nav />

      {/* Main Body */}
      <div className="flex gap-20">
        {/* Hero section */}
        <div className="flex flex-col gap-5 items-center justify-center w-full">
          <div className=" border-2 rounded-full border-[#FBFB5C] p-2">
            <p>AI Empowered</p>
          </div>

          <div className="flex flex-col gap-3 text-center">
            <h2 className="md:text-3xl font-bold">
              Let The Machine do the{" "}
              <span className="text-[#FBFB5C]">Boring</span> Work
            </h2>
            <p className="font-medium">
            Seamlessly translate between 
              <span className="text-[#FBFB5C] text-lg font-bold">
              Languages
              </span>{" "}
              using<br/> your voice—no typing required.
            </p>
          </div>

          <div className="my-[200px]">
            <SpeechRecognitionEffect />
          </div>
          <div className="border border-[#FBFB5C] p-4 rounded-full text-center md:w-[200px]">
            <button onClick={()=> navigate("/sign-up")}>Get Started</button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default App;
