import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
import axios from "axios";
import useAxiosWithAuth from "../hooks/useAxiosWithAuth";

const MyCreations = () => {
  const queryClient = useQueryClient();
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [syncItem, setSyncItem] = useState(null); // For handling Sync to Medium modal
  const [isSyncModalVisible, setIsSyncModalVisible] = useState(false);
  const [mediumToken, setMediumToken] = useState(""); // State for the Medium token
  const [mediumAuthorId, setmediumAuthorId] = useState(""); // State for the Medium token

  const { addAuthInterceptor } = useAxiosWithAuth();

  useEffect(() => {
    addAuthInterceptor();
  }, [addAuthInterceptor]);

  // Fetch imports list
  const { data: imports = [], isLoading } = useQuery({
    queryKey: ["creations"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/creation/list/");
      return data;
    },
    onError: (error) => console.error("Error fetching data:", error),
  });

  // const getToken = async (platform) => {
  //   console.log(`Connecting to ${platform}`);
  //   if (platform === "Medium") {
  //     try {
  //       const response = await axiosInstance.get(
  //         `/integration/retrieve/${auth.user.user_id}/`
  //       );
  //       // Prefill the token if it exists
  //       setMediumToken(response.data.token || "");
  //     } catch (error) {
  //       console.error("Error fetching token:", error);
  //       setMediumToken(""); // No token available
  //     }
  //   }
  // };

  const getAuthorId = async () => {
    try {
      const response = await axios.get(
        `https://cors-anywhere.herokuapp.com/api.medium.com/v1/me`,
        {
          headers: {
            Authorization: `Bearer 2a578682a6dcadd2c1c66186c309486c45d4c19685719196c8c5f1dc30e8b04f7`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      setmediumAuthorId(response.data.data.id);
      console.log(response.data.data.id);
      // Prefill the token if it exists
      // setMediumToken(response.data.token || "");
    } catch (error) {
      console.error("Error fetching token:", error);
      // setMediumToken(""); // No token available
    }
  };

  // useEffect(() => {
  //   getToken("Medium");

  // }, []);
  // console.log(mediumToken);

  useEffect(() => {
    getAuthorId();
  }, []);

  // Sync to Medium mutation
  const syncToMediumMutation = useMutation({
    mutationFn: async (item) => {
      await axios.post(
        `https://cors-anywhere.herokuapp.com/api.medium.com/v1/users/${mediumAuthorId}/posts/`,
        {
          title: item.title,
          content: item.content,
        },
        {
          headers: {
            Authorization: `Bearer 2a578682a6dcadd2c1c66186c309486c45d4c19685719196c8c5f1dc30e8b04f7`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      // await axiosInstance.post(`https://api.medium.com/v1/users/${mediumToken}/posts`, {
      //   title: item.title,
      //   content: item.content,
      // });
    },
    onSuccess: () => {
      alert("Content synced to Medium successfully!");
      setIsSyncModalVisible(false);
    },
    onError: (error) => {
      console.error("Error syncing content:", error);
      alert("Error syncing content.");
    },
  });

  // Handle detail view popup
  const openDetailView = (item) => {
    setSelectedDetail(item);
    setIsDetailVisible(true);
  };

  const closeDetailView = () => {
    setIsDetailVisible(false);
    setSelectedDetail(null);
  };

  const openSyncModal = (item) => {
    setSyncItem(item);
    setIsSyncModalVisible(true);
  };

  const closeSyncModal = () => {
    setIsSyncModalVisible(false);
    setSyncItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-4 shadow-md rounded-md">
        {/* List View */}
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul className="divide-y divide-gray-300 overflow-scroll">
            {imports.map((item) => (
              <li
                key={item.id}
                className="p-4 hover:bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-medium truncate max-w-xs">
                    {item.title || "Untitled Document"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(item.date_created).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Last Updated: {new Date(item.last_updated).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => openDetailView(item)}
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => openSyncModal(item)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Sync to Medium
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Detail View Popup */}
      {isDetailVisible && selectedDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/2 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {selectedDetail.title || "Untitled Document"}
            </h2>
            <p className="text-gray-700 mb-2">
              Content: {selectedDetail.content || "No content available"}
            </p>
            <p className="text-gray-700 mb-2">
              Created: {new Date(selectedDetail.date_created).toLocaleString()}
            </p>
            <p className="text-gray-700 mb-2">
              Last Updated:{" "}
              {new Date(selectedDetail.last_updated).toLocaleString()}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeDetailView}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sync to Medium Modal */}
      {isSyncModalVisible && syncItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <h2 className="text-lg font-semibold mb-4">
              Sync "{syncItem.title}" to Medium?
            </h2>
            <p className="text-gray-700 mb-4">
              This will upload the content to your Medium account.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeSyncModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => syncToMediumMutation.mutate(syncItem)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Confirm Sync
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCreations;
