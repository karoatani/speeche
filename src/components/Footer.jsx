import React from "react";
const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4 absolute bottom-0 w-full rounded-lg font-montserrat">
        <p>&copy; 2024 Speeche. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:text-white">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white">
            Contact Us
          </a>
        </div>
      </footer>
    </>
  );
};

export default Footer;
