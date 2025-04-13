import React, { createContext, useCallback, useContext, useState } from "react";

interface walletPopUp {
    showWalletpopUp  : boolean,
}

interface userInformation{
    username : string | null,
    email: string | null,
    walletAddress : string | null,
    githubusername : string | null,
    engagementScore: number | null;
    nftTokenID : string | null,
}

interface AppInitializerInfo {
    isInitializing: boolean;
    isDataLoaded: boolean;
    isAuthenticated: boolean;
    isAuthPending: boolean;
    error : string | null;
    isVerified: boolean;
    isMinted : boolean;
}

interface AppInitializerFunction {
    setAppInstructorData : (appdata : Partial<appInstructorType>) => void;
}

interface appInstructorType extends walletPopUp, userInformation, AppInitializerInfo{};

const defaultInstructor:appInstructorType  = {
    showWalletpopUp: false,
    isInitializing: false,
    isDataLoaded: false,
    isAuthenticated: false,
    isAuthPending: false,
    error: null,
    username: "Stranger",
    email: null,
    walletAddress: null,
    githubusername: null,
    engagementScore: 0,
    nftTokenID: null,
    isVerified: false,
    isMinted : false,
};

const appInstructorContext = createContext<appInstructorType & AppInitializerFunction| null>(null);

export const AppInstructorProvider : React.FC<{children: React.ReactNode}> = ({children}) => {
    const [state, setState] = useState<appInstructorType>(defaultInstructor);

    const  setAppInstructorData = (appdata: Partial<appInstructorType>) => {
        setState(prev => ({
            ...prev,
            ...appdata
        }));
    };

    

    return (
        <appInstructorContext.Provider value={{...state, setAppInstructorData}}>
            {children}
        </appInstructorContext.Provider>
    );
}

export const useAppInstuctor = () => {
    const ctx = useContext(appInstructorContext);
    if(!ctx){
        throw new Error("Some error in Appinstructor auth");
    }
    return ctx;
}