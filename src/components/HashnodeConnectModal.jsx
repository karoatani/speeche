import { useState, useEffect } from "react";

const HashnodeConnectModal = ({ isOpen, onClose, onSubmit, initialToken }) => {
  const [accessToken, setAccessToken] = useState("");
  const [isPrefilled, setIsPrefilled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Prefill the access token if it's available
      if (initialToken) {
        setAccessToken(initialToken);
        setIsPrefilled(true);
      } else {
        setAccessToken("");
        setIsPrefilled(false);
      }
    }
  }, [isOpen, initialToken]);

  const handleSubmit = () => {
    onSubmit(accessToken);
    setAccessToken("");
    setIsPrefilled(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-gray-100 rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Connect with Hashnode</h2>
        <p className="text-sm text-gray-300 mb-4">
          You can find your access token on your{" "}
          <a
            href="https://medium.com/me/settings"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Hashnode settings page
          </a>
          .
        </p>
        <div className="mb-4">
          <label htmlFor="accessToken" className="block text-sm font-medium">
            Access Token
          </label>
          <input
            type="text"
            id="accessToken"
            className="w-full mt-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            disabled={isPrefilled} // Disable input if the token is prefilled
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-sm rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPrefilled || !accessToken.trim()} // Disable if prefilled or input is empty
            className="px-4 py-2 bg-blue-600 text-sm rounded hover:bg-blue-500 disabled:bg-gray-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default HashnodeConnectModal;
