import React, { createContext, useCallback, useState } from "react";

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
}

interface AppInitializerFunction {
    setShowWalletPopUP(value: boolean): void;
    setInitilizing(value: boolean): void;
}

interface appInstructorType extends walletPopUp, userInformation, AppInitializerInfo,AppInitializerFunction {}

interface defaultInstructorType extends walletPopUp, userInformation, AppInitializerInfo {}

const defaultInstructor:defaultInstructorType  = {
    showWalletpopUp: false,
    isInitializing: false,
    username: "Stranger",
    email: null,
    walletAddress: null,
    githubusername: null,
    engagementScore: 0,
    nftTokenID: null,
};
const appInstructorContext = createContext<appInstructorType | null>(null);

export const AppInstructorProvider : React.FC<{children: React.ReactNode}> = ({children}) => {
    const [state, setState] = useState<defaultInstructorType>(defaultInstructor);

    const setShowWalletPopUP = (value: boolean) => {
        setState(prev => ({
            ...prev,
            showWalletpopUp: value,
        }));
    };

    const setInitilizing = (value : boolean) => {
        setState(prev => ({
            ...prev,
            isInitializing : value,
        }))
    }

    

    return (
        <appInstructorContext.Provider value={{...state, setShowWalletPopUP,setInitilizing}}>
            {children}
        </appInstructorContext.Provider>
    );
}