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
  setUserData: (userData: Partial<UserInformation>) => void;
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
  const setUserData = (userData: Partial<UserInformation>) => {
    setState((prev) => ({
      ...prev,
      ...userData
    }));
  };

  
  return (
    <userInfoContext.Provider
      value={{
        ...state,
        setUserData
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
