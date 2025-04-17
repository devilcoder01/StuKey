import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { EditUserInfo } from '../../utils/edituserdetails';
import { useAppInstuctor } from '../../context/AppInstuctor';
import { useToastNotification } from '../../hooks/useToastNotification';

interface EditUsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string | null;
}

const EditUsernameModal: React.FC<EditUsernameModalProps> = ({ isOpen, onClose, currentUsername }) => {
  const [username, setUsername] = useState(currentUsername || '');
  const [isLoading, setIsLoading] = useState(false);
  const { walletAddress, setAppInstructorData } = useAppInstuctor();
  const { showSuccess, showError } = useToastNotification();

  if (!isOpen) return null;

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
    try {
      const status = await EditUserInfo(username.trim(), walletAddress);
      
      if (status === 200 || status === 201) {
        setAppInstructorData({ username: username.trim() });
        showSuccess("Username updated successfully!");
        onClose();
      } else {
        showError("Failed to update username. Please try again.");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      showError("An error occurred while updating username.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-black p-8 rounded-2xl shadow-2xl w-full max-w-sm text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold tracking-tight">Edit Username</h2>
          <button 
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-200 mb-2"
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
              className="w-full px-4 py-2 border border-gray-700 bg-black text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition"
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-black border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black hover:text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50 transition font-semibold"
            >
              {isLoading ? "Saving..." : "Save Username"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUsernameModal;
