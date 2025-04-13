import { useNavigate } from "react-router-dom";
import ToastDemo from "../common/ToastDemo";
import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckDouble, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import gsap from "gsap";
import { useAppInstuctor } from "../../context/AppInstuctor";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin();

function Home() {
  const navigate = useNavigate();
  const { isVerified, setAppInstructorData, username, offChainEngagementScore, nftTokenID } = useAppInstuctor();

  // Create refs for elements we want to animate
  const welcomeRef = useRef(null);
  const greetingRef = useRef(null);
  const statusRef = useRef(null);
  const container = useRef(null);
  const sunRef = useRef(null); // Ref for the sun icon

  // Setup GSAP animations
  useGSAP(() => {
    const tl = gsap.timeline();

    // Animate elements in sequence
    tl.from(welcomeRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    })
      .from(
        greetingRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.4,
          ease: "power3.out",
        },
        "-=0.4"
      )
      .from(
        statusRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.4,
          ease: "power3.out",
        },
        "-=0.3"
      );

    // Animate the sun icon to rotate clockwise forever
    gsap.to(sunRef.current, {
      rotation: 360,
      duration: 20, // Duration for one full rotation
      ease: "linear", // Linear easing for smooth rotation
      repeat: -1, // Infinite loop
    });
  }, { scope: container }); // Scope the animation to our container

  useEffect(() => {
    if (nftTokenID) {
      setAppInstructorData({
        isVerified: true,
      });
    }
  }, [nftTokenID]);

  // Determine verification status based on NFT token ID
  const verificationStatus = nftTokenID ? "Verified " : "Pending";
  return (
    <div ref={container}>
      <div className="px-6 py-24 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex flex-col gap-5">
          <h1 className="font-normal text-5xl" ref={welcomeRef}>
            Welcome, <span className="font-semibold">{username}</span>
          </h1>
          <div ref={greetingRef} className="flex gap-3">
            <span>
              <img
                src="./sun.svg"
                alt="sun"
                className="w-10 h-10"
                ref={sunRef} // Attach the ref to the sun icon
              />
            </span>
            <span className="font-normal text-4xl">Good Morning</span>
          </div>
          <div ref={statusRef}>
            <div className="mt-10 mb-5 text-lg">Status</div>
            <div>
              <div className="flex my-4 gap-2">
                <span className="text-xl font-semibold ">Verification: </span>
                <span className="text-xl flex justify-center items-center gap-3">
                  {isVerified ? (
                    <>
                      {verificationStatus}{" "}
                      <FontAwesomeIcon className="text-lime-400" icon={faCircleCheck} />
                    </>
                  ) : (
                    verificationStatus
                  )}
                </span>
              </div>
              <div className="flex my-4 gap-2">
                <span className="text-xl font-semibold">Stukey Score:</span>
                <span className="text-xl">{offChainEngagementScore || 0}</span>
              </div>
            </div>
            <div className="button my-8">
              <button
                className=" px-9 py-2 bg-[#2B2928] text-white rounded-full cursor-pointer"
                onClick={() => navigate("/mint")}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-24 flex flex-col justify-between items-center max-w-7xl mx-auto">
        <div className="w-full mb-12">
          <h1 className="font-semibold text-5xl my-12">You're StuKey</h1>
          <div className="font-normal text-2xl my-12 w-96">
            A Smarter Way to Prove You're a Student.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
