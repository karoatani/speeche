import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import axiosInstance from "../services/axiosInstance";
import useAxiosWithAuth from "../hooks/useAxiosWithAuth";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import TurndownService from "turndown"; // Import turndown

const Imports = () => {
  const queryClient = useQueryClient();
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [syncItem, setSyncItem] = useState(null);
  const [isSyncModalVisible, setIsSyncModalVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState("content");
  const [coverImage, setCoverImage] = useState("");
  const [token, setToken] = useState("");
  const [pubId, setpubId] = useState("");
  
  const { addAuthInterceptor } = useAxiosWithAuth();
  const { auth } = useAuth();

  useEffect(() => {
    addAuthInterceptor();
  }, [addAuthInterceptor]);

  const { data: imports = [], isLoading } = useQuery({
    queryKey: ["imports"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/import/list/");
      return data;
    },
    onError: (error) => console.error("Error fetching data:", error),
  });

  const fileMutation = useMutation({
    mutationFn: async (formData) => {
      await axiosInstance.post("/import/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("File uploaded successfully!");
      queryClient.invalidateQueries(["imports"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const allowedFormats = ["rtf", "docx", "doc", "md", "txt"];

    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (!allowedFormats.includes(fileExtension)) {
        alert("Unsupported file format!");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("user", auth.user.user_id);
      formData.append("is_file", true);

      fileMutation.mutate(formData);
    }
  };

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

  const sanitizeHtml = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    doc.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (src && !src.startsWith("http")) {
        img.setAttribute("src", `https://speechee-backend-production.up.railway.app/${src}`);
      }
    });

    return DOMPurify.sanitize(doc.body.innerHTML);
  };

  const turndownService = new TurndownService();

  const syncToHashnode = async () => {
    if (!syncItem) return;

    // Convert the content to markdown format
    const contentMarkdown = turndownService.turndown(
      sanitizeHtml(syncItem[selectedContent])
    );
    getHashnodeAuthInfo()

    if (token && pubId){

      publishPost(
        syncItem.title || 'Placeholder title',
        contentMarkdown || 'Placeholder content',
        coverImage,
        pubId,
        token
      );
    }
  };

  const getHashnodeAuthInfo = async () =>{
    const response = await axiosInstance.get(
      `/integration/retrieve/${auth.user.user_id}/`
    );
    const data = response.data;

    if (data){
      setToken(data['token']);
      setpubId(data['pub_id']);
      
    }
  }

  const publishPost = async (
    title,
    contentMarkdown,
    coverImage,
    publicationId,
    token
  ) => {


    
    const input = {
      title: title,
      publicationId: publicationId,
      contentMarkdown: contentMarkdown,
      tags: [],
      coverImageOptions: {
        coverImageURL: coverImage,
      },
    };

    const variables = {
      input: input,
    };

    
  try {
    const response = await axios.post(
      'https://gql.hashnode.com',
      {
        query: `
        mutation PublishPost($input: PublishPostInput!) {
          publishPost(input: $input) {
            post {
              id
              title
              content {
                markdown
              }
              publication {
                id
                title
              }
            }
          }
        }
      `,
      variables: variables
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    toast.success("Synced successfully to Hashnode!");
    closeSyncModal();
  } catch (error) {
    console.error("Error syncing to Hashnode:", error);
    toast.error("Failed to sync to Hashnode. Please try again.");
  }
};



  return (
    <div className="h-screen bg-gray-100 p-6">
      <div className="bg-white p-4 shadow-md rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">File List</h1>
          <label className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer">
            Import File
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul className="divide-y divide-gray-300">
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
                    Sync to Hashnode
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isDetailVisible && selectedDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/2 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {selectedDetail.title || "Untitled Document"}
            </h2>
            <div
              className="text-gray-700 mb-2"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(
                  selectedDetail.content || "No content available"
                ),
              }}
            />
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

      {isSyncModalVisible && syncItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <h2 className="text-lg font-semibold mb-4">
              Sync "{syncItem.title}" to Hashnode?
            </h2>
            <div className="mb-4">
              <label htmlFor="coverImage" className="block text-sm font-medium">
                Enter Cover Image(Link to uploaded image)
              </label>
              <input
                type="text"
                id="coverImage"
                className="w-full mt-2 px-3 py-2 border border-gray-700 rounded focus:outline-none"
                onChange={(e) => setCoverImage(e.target.value)}
              />
            </div>

            
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium">
                Select Content
              </label>
              <select
                id="content"
                value={selectedContent}
                onChange={(e) => setSelectedContent(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-gray-700 rounded focus:outline-none"
              >
                <option value="content">Content</option>
                <option value="content2">Content 2</option>
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={closeSyncModal}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={() => syncToHashnode()}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Sync
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Imports;
