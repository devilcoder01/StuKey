import Herosection from "../ui/Herosection";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faAddressCard,
//   faCartShopping,
//   faCircleCheck,
//   faLinkSlash,
// } from "@fortawesome/free-solid-svg-icons";
// import { faPercent } from "@fortawesome/free-solid-svg-icons/faPercent";
// import { gsap } from "gsap";
import Footer from "../ui/Footer";

function Landing() {
  return (
    <div className="">
      <Herosection />
      <div className="px-6 py-12 flex flex-col justify-center content-center items-center max-w-7xl mx-auto  h-lvh my-32 font-[Satoshi-Regular]">
        {/* <h1 className="font-normal text-2xl mb-6 w-full flex flex-col justify-center items-center ">Know more about <span className="font-[Satoshi-Bold] text-3xl ">Stukey</span></h1> */}
        <div
          className="py-12 text-center text-4xl/normal font-thin rounded-lg w-full"
          id="stueky-info"
        >
          <span className="font-bold bg-[#FE0444] rounded-xl px-3">StuKey</span> is a blockchain-based platform that allows students to verify
          their student status <span className="font-bold bg-[#439001] rounded-xl px-3">without sharing personal data</span> . The platform uses <span className="font-bold bg-[#d58803] rounded-xl px-3">NFTs </span> (Non-Fungible Tokens)
          to represent a student's <span className="font-bold bg-[#9603d5] rounded-xl px-3">verified</span> status
          and engagement score, which can be used to access student <span  className="font-bold bg-[#0376d5] rounded-xl px-3">discounts</span> 
          and benefits from participating merchants.
        </div>
      </div>

      {/* <div className="px-6 py-24 flex justify-center flex-col items-center max-w-7xl mx-auto ">
        <h1 className="font-semibold text-5xl">How it worked</h1>

        <div className="flex space-x-32 my-36 ">
          <div className="idcard text-xl font-medium flex gap-6 justify-center items-center">
            {" "}
            <FontAwesomeIcon icon={faAddressCard} className="text-5xl" />
            Verify as a Student
          </div>
          <div className="idcard text-xl font-medium flex gap-6 justify-center items-center">
            <FontAwesomeIcon icon={faConfluence} className="text-5xl" /> Recive
            you're NFT (with score)
          </div>
          <div className="idcard text-xl font-medium flex gap-6 justify-center items-center">
            <FontAwesomeIcon icon={faCartShopping} className="text-5xl" />
            Enjoy Discount
          </div>
        </div>
      </div> */}

      
      <Footer/>
    </div>
  );
}

export default Landing;
