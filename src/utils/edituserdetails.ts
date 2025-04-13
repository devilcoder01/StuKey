import axios from "axios"
import dotenv from "dotenv"

dotenv.config();


export const EditUserInfo = async(username : string, walletAddress: string) => {
    const update = await axios.post(`${process.env.BACKEND_URL}/api/v1/updateusername`,{
        body : {
            username : username,
            walletAddress : walletAddress,
        }
    })
    return update.status;
}