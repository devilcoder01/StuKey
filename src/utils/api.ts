// import axios from "axios"; // Removed as it's not used

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const authenticateWithWallet = async (address: string, signature: string) => {
    // Mock response for now since backend isn't set up
    return { success: true, user: { address } };
};