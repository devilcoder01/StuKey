import React, { useState } from 'react';
import axios from 'axios';
import { useAppInstuctor } from '../../context/AppInstuctor'; // Assuming this context holds walletAddress and setter
import { useToastNotification } from '../../hooks/useToastNotification';
import { useAppInitialization } from '../../hooks/useAppInitialization';

const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5555";

function FirstUser() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { walletAddress, isFirstUser } = useAppInstuctor();
  const { showSuccess, showError } = useToastNotification();
  const { CreateUserData } = useAppInitialization()

  if (!isFirstUser) {
    return null;
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim() || !walletAddress) {
      showError("Username cannot be empty and wallet must be connected.");
      return;
    }
    setIsLoading(true);
    await CreateUserData(username.trim())
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-xl w-full max-w-sm text-white">
        <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
        <p className="mb-4 text-gray-300">
          Please set your username to get started.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter your desired username"
              required
              className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end space-x-2">
            {/* Optional: Add a cancel button */}
            <button
              type="button"
            //   onClick={}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Username"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FirstUser;
