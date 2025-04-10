import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import dotenv from "dotenv";
import { useWallet } from "./WalletContext";
import { useToastNotification } from "../hooks/useToastNotification";
// import { useActionData } from "react-router-dom";

dotenv.config();

const backendURL = process.env.BACKEND_URL || "http://localhost:5555";

export interface UserInformation {
  userName: string;
  email: string | null;
  walletAddress: string | null;
  githubUsername: string | null;
  engagementScore: number | null;
  nftTokenId: number | null;
}
const defaultUserInformation: UserInformation = {
  userName: "Stranger",
  email: null,
  walletAddress: null,
  githubUsername: null,
  engagementScore: 0,
  nftTokenId: null,
};
const userInfoContext = createContext<UserInformation | undefined>(undefined);

export const UserInormationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<UserInformation>(defaultUserInformation);
  
  // useEffect(() => {
  //   console.log(userAccount)
  //   try {
  //     axios
  //       .get(`${backendURL}/api/v1/user`, {
  //         params: {
  //           walletAddress: userAccount,
  //         },
  //       })
  //       .then((res) => {
  //         const userData = res.data;
  //         if(res.status == 201){

  //           setState({
  //             userName: userData.username || "Stranger",
  //             email: userData.email || null,
  //             walletAddress: userData.walletAddress || null,
  //             githubUsername: userData.githubUsername || null,
  //             engagementScore: userData.engagementScore || 0,
  //             nftTokenId: userData.nftTokenId || null,
  //           });
  //         }
  //         if(res.status == 500) {
  //           axios.post(`${backendURL}/api/v1/newuser`, {
  //             body : {
  //               walletAddress : userAccount,
  //               username: "Stranger",
  //             }
  //           }).then((res) => {
  //             if(res.status==201){
  //               setState({
  //                 ...state,
  //                 userName: userData.username || "Stranger",
  //                 walletAddress: userData.walletAddress || null
  //               });

  //             }

  //           }).catch((error) => {
  //             console.error(error);
  //           });
  //         }
  //       });
  //   } catch (error) {
  //     showError("An error occurred whild fetching user data");
  //     console.error(error);
  //   }
  // },[userAccount]);

  return (
    <userInfoContext.Provider value={state}>
      {children}
    </userInfoContext.Provider>
  );
};

export const useUserdetail = () => {
    const ctx = useContext(userInfoContext)
    if(!ctx) throw new Error("useUsedetail must be under walletprovder")
    return ctx;
}
