import React from "react";

function Herosection() {
  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-6 py-24 flex items-center mb-10">
        <div className="w-1/2">
          <h1 className="text-6xl/snug font-medium">
            Unlock Student Savings with
            <div className=" w-64 py-5">
              <img src="./icon.svg" alt="Hero icon" className="w-full h-full object-cover" />
            </div>
          </h1>
          <p className="text-gray-600 text-lg font-medium">Your NFT Key to Campus Deals</p>
        </div>
      </div>
    </div>
  );
}

export default Herosection;
