import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const BACKEND_URL= process.env.BACKEND_URL;

export const editUserDetails = (username : string, walletAddress: string ) => {    
    const updateData = axios.post(`${BACKEND_URL}/v1/update`)
}