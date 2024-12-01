import React, { useState, useEffect } from "react";
import HashnodeConnectModal from "./HashnodeConnectModal";
import axiosInstance from "../services/axiosInstance"; // Import axios instance
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import useAxiosWithAuth from "../hooks/useAxiosWithAuth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const Settings = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [hashnodeToken, setHashnodeToken] = useState(""); 
  const { auth } = useAuth(); // Use context to get user and token
  const { addAuthInterceptor } = useAxiosWithAuth();

  useEffect(() => {
    addAuthInterceptor();
  }, [addAuthInterceptor]);

  // Mutation to save the token
  const mutation = useMutation({
    mutationFn: async (newContent) => {
      await axiosInstance.post("integration/", newContent);
    },
  });

  const connectAccount = async (platform) => {
    console.log(`Connecting to ${platform}`);
    if (platform === "Hashnode") {

      try {
        const response = await axiosInstance.get(
          `/integration/retrieve/${auth.user.user_id}/`
        );
        // Prefill the token if it exists
        setHashnodeToken(response.data.token || "");
      } catch (error) {
        console.error("Error fetching token:", error);
        setHashnodeToken(""); // No token available
      }
      setModalOpen(true);
    }
  };

  const onSuccess = () => {
    toast.success("Successful", { toastId: "success" });
    // navigate("/dashboard");
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      onSuccess();
    }
  }, [mutation.isSuccess]);

  useEffect(() => {
    if (mutation.isError) {
      console.log(mutation.error.message);
      toast.error("Error", { toastId: "error" });
    }
  }, [mutation.isError]);

  const handleTokenSubmit = (token) => {
    mutation.mutate({
      user: auth.user.user_id,
      app_name: "Hashnode",
      token: token,
    });
  };

  return (
    <div className="bg-gray-900 w-full h-full p-8 text-gray-100 flex justify-center">
      <div className="w-full max-w-3xl bg-gray-900 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div>
          <h2 className="text-xl font-semibold mb-4">Connect Your Accounts</h2>
          <div className="flex flex-col gap-4">
            <button
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition duration-300 flex items-center justify-between"
              onClick={() => connectAccount("Hashnode")}
            >
              <span>Connect Hashnode</span>
              <img
                src="/icons8-hashnode-96.png"
                alt="Hashnode"
                className="w-6 h-6"
              />
              
            </button>
          </div>
        </div>
      </div>

      {/* Hashnode Connect Modal */}
      <HashnodeConnectModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleTokenSubmit}
        initialToken={hashnodeToken} // Pass prefilled token
      />
    </div>
  );
};

export default Settings;
