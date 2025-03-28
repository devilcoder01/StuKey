import React, { useState } from "react";
import Navbar from "../ui/Navbar";
import Score from "../ui/Score";
import Credential from "../ui/Credential";

function Mint() {
  const [Minted, setMinted] = useState(false);
  
  return (
    <div>
      <Navbar />
      <div className="px-52 py-24 flex justify-between items-center max-w-7xl mx-auto">
        <div className=" w-full">
          <div className="flex justify-between w-full mb-16">
            <div>
              <div className="flex flex-col gap-4">
                <div className="text-5xl font-medium">Proof of Student</div>
                <div className="text-[0.7rem] mfont-normal w-96">
                  Rewards for Students in the Age of Blockchain — Prove Your
                  Student Identity Without Sharing Personal Data
                </div>
              </div>
              <div className="my-11">
                <span className="px-6 py-3 bg-[#2B2928] text-white rounded-full cursor-pointer">
                {Minted ? "Minted" : "Mint Score"}
                </span>
                
              </div>
            </div>
            <div>
              <Score />
            </div>
          </div>
          <div className="">
            <div className="text-lg font-medium mb-5">Credential</div>
            <Credential/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mint;
