import React from "react";

function Herosection() {
  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-6 py-24 flex justify-center items-center mb-10 font-[Satoshi-Medium] ">
        <div className="font flex flex-col justify-center items-center">
          <h1 className="w-[70%] text-6xl/snug text-center">
            Proof you're Student identity in Blockchain with
          </h1>
          <div className=" w-36 py-5">
            <img
              src="./white-icon.svg"
              alt="Hero icon"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-[#dadada] text-lg ">Your NFT Key to Campus Deals</p>
        </div>
      </div>
    </div>
  );
}

export default Herosection;
