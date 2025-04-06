
import Herosection from "../ui/Herosection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faCartShopping,
  faCircleCheck,
  faLinkSlash,
} from "@fortawesome/free-solid-svg-icons";
import { faConfluence } from "@fortawesome/free-brands-svg-icons";
import { faPercent } from "@fortawesome/free-solid-svg-icons/faPercent";


function Landing() {
  return (
    <div className="">
      <Herosection />
      <div className="px-6 py-24 flex justify-center flex-col items-center max-w-7xl mx-auto ">
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
      </div>

      <h3 className="featured text-6xl font-semibold px-24 py-24 flex  item-center max-w-7xl mx-auto ">
        Featured
      </h3>
      <div className="px-24 py-10 flex  item-center max-w-7xl mx-auto ">
        <div className="relative h-[30rem] w-full">
          <div className="flex flex-col h-full justify-between absolute left-[50%]">
            <div className="w-80 flex flex-col gap-5">
              <div className="font-medium text-2xl flex gap-5">
                <FontAwesomeIcon icon={faPercent} />
                Exclusive Discounts
              </div>
              <div className="font-medium text-[1rem]">
                Get special offers and save more with exclusive deals just for
                you
              </div>
            </div>

            <div className="w-80 flex flex-col gap-5">
              <div className="font-medium text-2xl flex gap-5">
                <FontAwesomeIcon icon={faCircleCheck} />
                Easy Verification
              </div>
              <div className="font-medium text-[1rem]">
                Quick and hassle-free identity verification in just a few steps.
              </div>
            </div>

            <div className="w-80 flex flex-col gap-5">
              <div className="font-medium text-2xl flex gap-5">
                <FontAwesomeIcon icon={faLinkSlash} />
                Blockchain Powered
              </div>
              <div className="font-medium text-[1rem]">
                Secure and transparent technology backed by blockchain.
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer/> */}
    </div>
  );
}

export default Landing;
