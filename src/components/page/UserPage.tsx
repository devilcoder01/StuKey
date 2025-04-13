import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { formatAddress } from '../../utils';
import { useAppInstuctor } from '../../context/AppInstuctor';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

function UserPage() {
  const { username, email, walletAddress, githubusername, offChainEngagementScore } = useAppInstuctor();

  // Refs for animation
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const socialRef = useRef(null);
  const walletRef = useRef(null);
  const detailsRef = useRef(null);
  const buttonRef = useRef(null);

  // GSAP Timeline Animation
  useGSAP(() => {
    const tl = gsap.timeline();

    // Animate the container
    tl.from(containerRef.current, {
      opacity: 0,
      y: 50,
      duration: 0.6,
      ease: 'power3.out',
    });

    // Animate the profile image
    tl.from(
      imageRef.current,
      {
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        ease: 'power3.out',
      },
      '-=0.4'
    );

    // Animate the social icons
    tl.from(
      socialRef.current,
      {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: 'power3.out',
      },
      '-=0.3'
    );

    // Animate the wallet address
    tl.from(
      walletRef.current,
      {
        opacity: 0,
        x: -30,
        duration: 0.4,
        ease: 'power3.out',
      },
      '-=0.3'
    );

    // Animate the user details
    tl.from(
      detailsRef.current,
      {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: 'power3.out',
      },
      '-=0.3'
    );

    // Animate the edit button
    tl.from(
      buttonRef.current,
      {
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        ease: 'power3.out',
      },
      '-=0.3'
    );
  }, [containerRef, imageRef, socialRef, walletRef, detailsRef, buttonRef]);

  // Format wallet address for display
  const displayAddress = walletAddress ? formatAddress(walletAddress) : '0x0000...0000';

  return (
    <div ref={containerRef}>
      <div className="px-24 py-40 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex w-1/2 gap-14">
          <div>
            <div className="imagecontainer mb-9" ref={imageRef}>
              <div className="w-32 h-32 rounded-full bg-amber-500"></div>
            </div>
            <div className="social" ref={socialRef}>
              <div className="text-xl mb-5">Social</div>
              <div className="flex gap-6 text-xl">
                <FontAwesomeIcon icon={faTwitter} />
                <FontAwesomeIcon icon={faLinkedin} />
                <FontAwesomeIcon icon={faInstagram} />
                <FontAwesomeIcon icon={faMessage} />
              </div>
            </div>
          </div>
          <div>
            <div className="walletadddr text-sm font-normal mb-8" ref={walletRef}>
              {displayAddress}
            </div>
            <div className="flex flex-col gap-4" ref={detailsRef}>
              <div className="name flex text-xl">
                <span className="font-bold mr-2">Name:</span>
                <span>{username || 'Not set'}</span>
              </div>
              <div className="name flex text-xl">
                <span className="font-bold mr-2">Email:</span>
                <span>{email || 'Not set'}</span>
              </div>
              {githubusername && (
                <div className="name flex text-xl">
                  <span className="font-bold mr-2">GitHub:</span>
                  <span>{githubusername}</span>
                </div>
              )}
              <div className="name flex text-xl">
                <span className="font-bold mr-2">Score:</span>
                <span>{offChainEngagementScore || 0}</span>
              </div>
            </div>
            <div className="mt-7 text-xl" ref={buttonRef}>
              <button className="px-7 py-1 bg-[#2B2928] text-white rounded-lg cursor-pointer">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;