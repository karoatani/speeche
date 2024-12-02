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
  const [publicationId, setPublicationId] = useState(""); // State for publicationId
  const { auth } = useAuth();
  const { addAuthInterceptor } = useAxiosWithAuth();

  useEffect(() => {
    addAuthInterceptor();
  }, [addAuthInterceptor]);

  const mutation = useMutation({
    mutationFn: async (newContent) => {
      await axiosInstance.post("integration/", newContent);
    },
  });

  const connectAccount = async (platform) => {
    if (platform === "Hashnode") {
      try {
        const response = await axiosInstance.get(
          `/integration/retrieve/${auth.user.user_id}/`
        );
        setHashnodeToken(response.data.token || "");
        setPublicationId(response.data.pub_id || ""); // Fetch publicationId
      } catch (error) {
        console.error("Error fetching token:", error);
        setHashnodeToken("");
        setPublicationId("");
      }
      setModalOpen(true);
    }
  };

  const onSuccess = () => {
    toast.success("Connected successfully!", { toastId: "success" });
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      onSuccess();
    }
  }, [mutation.isSuccess]);

  useEffect(() => {
    if (mutation.isError) {
      toast.error("Error connecting account", { toastId: "error" });
    }
  }, [mutation.isError]);

  const handleTokenSubmit = (token, publicationId) => {
    mutation.mutate({
      user: auth.user.user_id,
      app_name: "Hashnode",
      token: token,
      pub_id: publicationId, // Include publicationId
    });
  };

  return (
    <div className="bg-gray-900 w-full h-full p-8 text-gray-100 flex justify-center">
      <div className="w-full max-w-3xl bg-gray-900 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div>
          <h2 className="text-xl font-semibold mb-4">Connect Your Accounts</h2>
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition duration-300"
            onClick={() => connectAccount("Hashnode")}
          >
            Connect Hashnode
          </button>
        </div>
      </div>
      <HashnodeConnectModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleTokenSubmit}
        initialToken={hashnodeToken}
        initialPublicationId={publicationId} // Pass initial publicationId
      />
    </div>
  );
};

export default Settings;
