import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const fetchUserData = async(walletAddress : string) => {
    const response = await axios.get(`${process.env.BACKEND_URL}/api/v1/getuser`,{
        params: {
            walletAddress: walletAddress,
          },
    })
    return response;
}