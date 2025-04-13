import React from "react";
import { useAppInitialization } from "../../hooks/useAppInitialization";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface AppInitializerProps {
  children: React.ReactNode;
}

/**
 * Component that handles app initialization and shows a loading spinner
 * while the app is initializing
 */
const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { isInitializing } = useAppInitialization();

  if (isInitializing) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
        <div className="w-96 h-96">
          <DotLottieReact src="./white.lottie" loop autoplay />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppInitializer;
