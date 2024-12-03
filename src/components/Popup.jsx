import React from "react";

const Popup = ({ setOpened, handleSaveToDb, mutation, setTitle }) => {
  const handleDismissal = () => {
    setOpened(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white w-full max-w-lg rounded-lg shadow-lg">
        {/* Header Section */}
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h2 className="text-xl font-bold">Enter the Title of Your Article</h2>
          <button
            className="text-xl text-red-400 hover:text-red-500"
            onClick={handleDismissal}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4">
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Your article title..."
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setTitle(e.target.value)}          
          />
        </div>

        {/* Footer Section */}
        <div className="p-5 border-t border-gray-700">
          <button
            className={`w-full py-2 rounded shadow ${
              mutation.isPending
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
            onClick={handleSaveToDb}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
