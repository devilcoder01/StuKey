import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

interface walletPopUp {
    showWalletpopUp  : boolean,
}

interface userInformation{
    username : string | null,
    email: string | null,
    walletAddress : string | null,
    githubusername : string | null,
    offChainEngagementScore: number | null;
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
    isFirstUser: boolean;
}

interface AppInitializerFunction {
    setAppInstructorData : (appdata : Partial<appInstructorType>) => void;
}

interface appInstructorType extends walletPopUp, userInformation, AppInitializerInfo{};

const defaultInstructor:appInstructorType  = {
    showWalletpopUp: false,
    isInitializing: true,
    isDataLoaded: false,
    isAuthenticated: false,
    isAuthPending: false,
    error: null,
    username: "Stranger",
    email: null,
    walletAddress: null,
    githubusername: null,
    offChainEngagementScore: 0,
    nftTokenID: null,
    isVerified: false,
    isMinted : false,
    isFirstUser : false,
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

    const value = useMemo(() => ({
        ...state,
        setAppInstructorData
    }), [state, setAppInstructorData]);
    

    return (
        <appInstructorContext.Provider value={value}>
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