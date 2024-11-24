import React from "react";
import { FaSyncAlt } from "react-icons/fa";
import { CgImport } from "react-icons/cg";
import { AiOutlineTranslation } from "react-icons/ai";

const Home = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold text-gray-100 mb-4">
          Automatic <br /> speech to text translation
        </h1>
        <p className="text-gray-400">
          Automated AI dubbing when quality matters
        </p>
      </div>

      {/* Cards Section */}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md w-80 flex flex-col items-center">
          <div className="bg-gray-700 p-3 rounded-full mb-4">
          <AiOutlineTranslation style={{ color: "#FBFB5C", fontSize: "25px" }} />

          </div>
          <h3 className="text-xl font-semibold mb-2">Translation</h3>
          <p className="text-gray-400 text-center">
            Real time text translation from one language to another with language autodetction
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md w-80 flex flex-col items-center">
          <div className="bg-gray-700 p-3 rounded-full mb-4">
            
          <CgImport style={{ color: "#FBFB5C", fontSize: "25px" }} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Imports</h3>
          <p className="text-gray-400 text-center">
            Easy importing of data of various format into the builtin editor
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md w-80 flex flex-col items-center">
          <div className="bg-gray-700 p-3 rounded-full mb-4">
          <FaSyncAlt style={{ color: "#FBFB5C", fontSize: "25px" }} />

          </div>
          <h3 className="text-xl font-semibold mb-2">Syncing</h3>
          <p className="text-gray-400 text-center">
            Easy syncing with a blogging platform of choice
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
