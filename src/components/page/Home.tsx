import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faCloudSun, faCloudMoon } from "@fortawesome/free-solid-svg-icons";
import gsap from "gsap";
import { useAppInstuctor } from "../../context/AppInstuctor";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin();

function Home() {
  const navigate = useNavigate();
  const { isVerified, setAppInstructorData, username, onChainEngagementScore, nftTokenID } = useAppInstuctor();
  const [greeting, setGreeting] = useState<{ text: string; icon: any }>({ text: "", icon: faSun });

  // Create refs for elements we want to animate
  const welcomeRef = useRef(null);
  const greetingRef = useRef(null);
  const statusRef = useRef(null);
  const container = useRef(null);
  const timeIconRef = useRef(null); // Ref for the time icon

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

    // Animate the time icon to rotate clockwise forever
    if (timeIconRef.current) {
      gsap.to(timeIconRef.current, {
        rotation: 360,
        duration: 20, // Duration for one full rotation
        ease: "linear", // Linear easing for smooth rotation
        repeat: -1, // Infinite loop
      });
    }
  }, { scope: container }); // Scope the animation to our container

  // Set greeting based on time of day
  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();

      if (hour >= 5 && hour < 12) {
        return { text: "Good Morning", icon: faSun };
      } else if (hour >= 12 && hour < 17) {
        return { text: "Good Afternoon", icon: faCloudSun };
      } else if (hour >= 17 && hour < 21) {
        return { text: "Good Evening", icon: faCloudMoon };
      } else {
        return { text: "Good Night", icon: faMoon };
      }
    };

    setGreeting(getGreeting());

    // Update greeting every minute
    const intervalId = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Check if NFT is minted - token ID exists and is not "0"
    const hasValidNFT = nftTokenID && nftTokenID !== "0";

    setAppInstructorData({
      isVerified: hasValidNFT ? true : false,
    });
  }, [nftTokenID, setAppInstructorData]);

  // Determine verification status based on NFT token ID
  const verificationStatus = isVerified ? "Verified" : "Not Verified";
  return (
    <div ref={container} className="font-satoshi">
      <div className="px-4 sm:px-6 py-8 sm:py-14 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex flex-col gap-3 sm:gap-5 w-full">
          <h1 className="font-satoshi text-3xl sm:text-4xl md:text-5xl" ref={welcomeRef}>
            Welcome, <span className="font-semibold">{username}</span>
          </h1>
          <div ref={greetingRef} className="flex gap-2 sm:gap-3 items-center">
            <span className="text-amber-500">
              <FontAwesomeIcon
                icon={greeting.icon || faSun}
                className="w-6 h-6 sm:w-8 sm:h-8"
                ref={timeIconRef}
              />
            </span>
            <span className="font-satoshi text-2xl sm:text-3xl md:text-4xl">{greeting.text}</span>
          </div>
          <div ref={statusRef} className="w-full">
            <div className="mt-6 sm:mt-10 mb-3 sm:mb-5 text-base sm:text-lg">Status</div>
            <div className="w-full">
              <div className="flex flex-wrap my-3 sm:my-4 gap-2 items-center">
                <span className="text-lg sm:text-xl font-satoshi-medium">Verification: </span>
                <span className="text-lg sm:text-xl flex justify-center items-center gap-2 sm:gap-3">
                  {isVerified ? (
                    <>
                      <span className="text-green-200 bg-green-800 rounded-md text-sm px-3 py-0.5 font-semibold">{verificationStatus}</span>{" "}
                    </>
                  ) : (
                    <span className="text-red-200 bg-red-800 rounded-md text-sm px-3 py-0.5 font-semibold">{verificationStatus}</span>
                  )}
                </span>
              </div>
              <div className="flex flex-wrap my-3 sm:my-4 gap-2 items-center">
                <span className="text-lg sm:text-xl font-satoshi-medium">Stukey Score:</span>
                <span className="text-lg sm:text-xl">{onChainEngagementScore || 0}</span>
              </div>
            </div>
            <div className="button my-6 sm:my-8">
              <button
                className="px-6 sm:px-5 py-2 bg-[#2B2928] text-white rounded-full cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 text-sm sm:text-base"
                onClick={() => navigate("/mint")}
              >
                {isVerified ? "Go to Mint" : "Verify Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="px-6 py-24 flex flex-col justify-between items-center max-w-7xl mx-auto">
        <div className="w-full mb-12">
          <h1 className="font-semibold text-5xl my-12">You're StuKey</h1>
          <div className="font-normal text-2xl my-12 w-96">
            A Smarter Way to Prove You're a Student.
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Home;
