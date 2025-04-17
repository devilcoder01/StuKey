import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface DotLoadingProps {
  fullScreen?: boolean;
  text?: string;
}
export const DotLoading: React.FC<DotLoadingProps> = ({
  fullScreen = false,
  text,
}) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 font-[Satoshi-Regular]">
        <DotLottieReact src="./dotting.lottie" loop autoplay />
        {text && <p className="mt-4 text-[#fff]">{text}</p>}
      </div>
    );
  }

  // Otherwise, render the spinner inline
  return (
    <div className="flex flex-col items-center justify-center font-[Satoshi-Regular]">
      <DotLottieReact src="./dotting.lottie" loop autoplay />
      {text && <p className="mt-9  text-[#dadada] text-sm">{text}</p>}
    </div>
  );
};
