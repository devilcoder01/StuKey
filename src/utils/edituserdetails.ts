import axios from "axios";

// Get backend URL from environment variables
const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5555";

/**
 * Updates the username for a user
 * @param username - The new username
 * @param walletAddress - The wallet address of the user
 * @returns The status code of the request
 */
export const EditUserInfo = async(username: string, walletAddress: string) => {
    try {
        const response = await axios.put(`${backendURL}/api/v1/update`, {
            username: username,
            walletAddress: walletAddress,
        });

        return response.status;
    } catch (error) {
        console.error("Error updating username:", error);
        throw error;
    }
}