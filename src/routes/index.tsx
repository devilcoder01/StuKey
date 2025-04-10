import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../components/page/Home";
import Mint from "../components/page/Mint";
import Landing from "../components/page/Landing";
import UserPage from "../components/page/UserPage";
import ProtectedRoute from "./ProtectedRoute";
import { useSignAuth } from "../context/authSingnatureContext";
import { useWalletAuth } from "../hooks/useWalletAuth";
import { useWallet } from "../context/WalletContext";
import axios from "axios";
import dotenv from "dotenv";
import { useUserdetail } from "../context/userInformation";

dotenv.config();

const backendURL = process.env.BACKEND_URL || "http://localhost:5555";

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useSignAuth();
  const { isConnected } = useWallet();
  const [isPermission, setIsPermission] = useState(false);
  const { userAccount } = useWallet();
  const {setUserName,setEmailAddress,setWalletAddress,setGithubUsername,setEngagementScore,setNftTokenId,} = useUserdetail();
  
  useEffect(() => {
    if (isAuthenticated && isConnected) {
      setIsPermission(true);
    } else {
      setIsPermission(false);
    }
  }, [isAuthenticated, isConnected]);
  useEffect(() => {
    // console.log(backendURL)
    const fetchUserinfo = async () => {
      await axios
        .get(`${backendURL}/api/v1/user`, {
          params: {
            walletAddress: userAccount,
          },
        })
        .then((res) => {
          const userData = res.data;
          if (res.status == 201) {
            // setUserName(userData.username);
            // setEmailAddress(userData.email);
            // setWalletAddress(userData.walletAddress)
            // setGithubUsername(userData.githubUsername)
            // setEngagementScore(userData.engagementScore)
            console.log(userData);
          }
          if (res.status == 500) {
            axios
              .post(`${backendURL}/api/v1/newuser`, {
                body: {
                  walletAddress: userAccount,
                  username: "Stranger",
                },
              })
              .then((res) => {
                if (res.status == 201) {
                 console.log("userCreated")
                }
              })
              .catch((error) => {
                console.error(error);
              });
          }
        });
    };
    fetchUserinfo();
  },[userAccount]);

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={isPermission ? <Navigate to="/home" /> : <Landing />}
      />

      {/* Protected routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mint"
        element={
          <ProtectedRoute>
            <Mint />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
