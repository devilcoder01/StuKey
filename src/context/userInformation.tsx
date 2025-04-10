import React, {
  createContext,
  useContext,
  useState,
} from "react";


export interface UserInformation {
  userName: string | null;
  email: string | null;
  walletAddress: string | null;
  githubUsername: string | null;
  engagementScore: number | null;
  nftTokenId: number | null;
}
interface seterUserinformation extends UserInformation {
  setUserName: (userName: string | null) => void;
  setEmailAddress: (emailAddress: string | null) => void;
  setWalletAddress: (walletAddress: string | null) => void;
  setGithubUsername: (githubUsername: string | null) => void;
  setEngagementScore: (engagementScore: number | null) => void;
  setNftTokenId: (nftTokenId: number | null) => void;
  setAllUserData: (userData: Partial<UserInformation>) => void;
}
const defaultUserInformation: UserInformation = {
  userName: "Stranger",
  email: null,
  walletAddress: null,
  githubUsername: null,
  engagementScore: 0,
  nftTokenId: null,
};
const userInfoContext = createContext<seterUserinformation | undefined>(undefined);

export const UserInormationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, setState] = useState<UserInformation>(defaultUserInformation);

  // Function to set all user data at once
  const setAllUserData = (userData: Partial<UserInformation>) => {
    setState((prev) => ({
      ...prev,
      ...userData
    }));
  };

  const setUserName = (username: string | null) => {
    setState((prev) => ({
      ...prev,
      userName: username,
    }));
  };

  function setEmailAddress(email: string | null) {
    setState((prev) => ({
      ...prev,
      email: email,
    }));
  }

  const setWalletAddress = (walletAddress: string | null) => {
    setState((prev) => ({
      ...prev,
      walletAddress: walletAddress,
    }));
  };

  const setGithubUsername = (githubUsername: string | null) => {
    setState((prev) => ({
      ...prev,
      githubUsername: githubUsername,
    }));
  };

  const setEngagementScore = (engagementScore: number | null) => {
    setState((prev) => ({
      ...prev,
      engagementScore: engagementScore,
    }));
  };

  const setNftTokenId = (nftTokenId: number | null) => {
    setState((prev) => ({
      ...prev,
      nftTokenId: nftTokenId,
    }));
  };

  return (
    <userInfoContext.Provider
      value={{
        ...state,
        setUserName,
        setEmailAddress,
        setWalletAddress,
        setGithubUsername,
        setEngagementScore,
        setNftTokenId,
        setAllUserData
      }}
    >
      {children}
    </userInfoContext.Provider>
  );
};

export const useUserdetail = () => {
  const ctx = useContext(userInfoContext);
  if (!ctx) throw new Error("useUsedetail must be under walletprovder");
  return ctx;
};
