import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Set up axios instance with base URL
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add interceptor to include auth token in requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Authentication
export const authenticateWithWallet = async (address: string, signature: string) => {
    try {
        const response = await api.post('/api/auth/wallet', { address, signature });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error('Authentication error:', error);
        throw error;
    }
};

export const verifyToken = async () => {
    try {
        const response = await api.get('/api/auth/verify-token');
        return response.data;
    } catch (error) {
        console.error('Token verification error:', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};

// Student
export const getStudentProfile = async () => {
    try {
        const response = await api.get('/api/student/profile');
        return response.data;
    } catch (error) {
        console.error('Error fetching student profile:', error);
        throw error;
    }
};

export const updateStudentProfile = async (data: { githubUsername: string }) => {
    try {
        const response = await api.put('/api/student/profile', data);
        return response.data;
    } catch (error) {
        console.error('Error updating student profile:', error);
        throw error;
    }
};

export const calculateEngagementScore = async () => {
    try {
        const response = await api.post('/api/student/calculate-score');
        return response.data;
    } catch (error) {
        console.error('Error calculating engagement score:', error);
        throw error;
    }
};

export const mintNFT = async () => {
    try {
        const response = await api.post('/api/student/mint-nft');
        return response.data;
    } catch (error) {
        console.error('Error minting NFT:', error);
        throw error;
    }
};

// Merchant
export const registerMerchant = async (data: { businessName: string, businessType: string, website?: string }) => {
    try {
        const response = await api.post('/api/merchant/register', data);
        return response.data;
    } catch (error) {
        console.error('Error registering merchant:', error);
        throw error;
    }
};

export const getMerchantProfile = async () => {
    try {
        const response = await api.get('/api/merchant/profile');
        return response.data;
    } catch (error) {
        console.error('Error fetching merchant profile:', error);
        throw error;
    }
};

export const addDiscount = async (data: { discountName: string, discountPercentage: number, minScore: number }) => {
    try {
        const response = await api.post('/api/merchant/discount', data);
        return response.data;
    } catch (error) {
        console.error('Error adding discount:', error);
        throw error;
    }
};

export const verifyStudent = async (studentAddress: string) => {
    try {
        const response = await api.post('/api/merchant/verify-student', { studentAddress });
        return response.data;
    } catch (error) {
        console.error('Error verifying student:', error);
        throw error;
    }
};