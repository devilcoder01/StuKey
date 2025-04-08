import axios from 'axios';

const API_URL = 'http://localhost:5555/api/v1';

export const verifySignature = async (message: string, signature: string, address: string) => {
  try {
    const response = await axios.post(`${API_URL}/verify`, {
      message,
      signature,
      address,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error verifying signature:', error);
    throw error;
  }
};

export const saveAuthState = (address: string, signature: string) => {
  localStorage.setItem('auth_address', address);
  localStorage.setItem('auth_signature', signature);
  localStorage.setItem('auth_timestamp', Date.now().toString());
};

export const getAuthState = () => {
  const address = localStorage.getItem('auth_address');
  const signature = localStorage.getItem('auth_signature');
  const timestamp = localStorage.getItem('auth_timestamp');
  
  if (!address || !signature || !timestamp) {
    return null;
  }
  
  // Optional: Check if the session is expired (e.g., after 24 hours)
  const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const currentTime = Date.now();
  const storedTime = parseInt(timestamp, 10);
  
  if (currentTime - storedTime > expirationTime) {
    clearAuthState();
    return null;
  }
  
  return { address, signature };
};

export const clearAuthState = () => {
  localStorage.removeItem('auth_address');
  localStorage.removeItem('auth_signature');
  localStorage.removeItem('auth_timestamp');
};
