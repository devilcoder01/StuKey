import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faMessage, faEdit, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { formatAddress } from '../../utils';
import { useAppInstuctor } from '../../context/AppInstuctor';
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import NFTCard from '../ui/NFTCard';
import EditUsernameModal from '../ui/EditUsernameModal';

function UserPage() {
  const { username, email, walletAddress, githubusername, offChainEngagementScore, nftTokenID } = useAppInstuctor();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Refs for animation
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const socialRef = useRef(null);
  const walletRef = useRef(null);
  const detailsRef = useRef(null);
  const buttonRef = useRef(null);
  const nftCardRef = useRef(null);

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

    // Animate the NFT card
    if (nftCardRef.current) {
      tl.from(
        nftCardRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.5,
          ease: 'power3.out',
        },
        '-=0.3'
      );
    }
  }, [containerRef, imageRef, socialRef, walletRef, detailsRef, buttonRef, nftCardRef]);

  // Format wallet address for display
  const displayAddress = walletAddress ? formatAddress(walletAddress) : '0x0000...0000';

  // Handle opening the edit modal
  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  // Handle closing the edit modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#121212]">
      <div className="px-6 sm:px-12 lg:px-24 py-14 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-10 text-white">User Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column - User Info */}
          <div className="flex flex-col">
            <div className="flex gap-8 mb-8">
              <div className="imagecontainer" ref={imageRef}>
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                  <FontAwesomeIcon icon={faGraduationCap} className="text-4xl text-white" />
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="walletadddr text-sm font-normal mb-2 text-gray-400" ref={walletRef}>
                  {displayAddress}
                </div>
                <h2 className="text-2xl font-semibold text-white">{username || 'Anonymous Student'}</h2>
                {email && <p className="text-gray-400">{email}</p>}
              </div>
            </div>

            <div className="bg-[#1E1E1E] rounded-xl p-6 mb-6" ref={detailsRef}>
              <h3 className="text-xl font-semibold mb-4 text-white">Personal Information</h3>

              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Username</span>
                  <span className="text-white">{username || 'Not set'}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white">{email || 'Not set'}</span>
                </div>

                {githubusername && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">GitHub</span>
                    <span className="text-white">{githubusername}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Engagement Score</span>
                  <span className="text-white">{offChainEngagementScore || 0}/100</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">NFT Status</span>
                  <span className="text-white">{nftTokenID && nftTokenID !== '0' ? 'Minted' : 'Not Minted'}</span>
                </div>
              </div>

              <div className="mt-6" ref={buttonRef}>
                <button
                  onClick={handleEditClick}
                  className="px-5 py-2 bg-[#2B2928] text-white rounded-lg cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="bg-[#1E1E1E] rounded-xl p-6" ref={socialRef}>
              <h3 className="text-xl font-semibold mb-4 text-white">Social Connections</h3>
              <div className="flex gap-6 text-xl text-gray-400">
                <FontAwesomeIcon icon={faTwitter} className="cursor-pointer hover:text-white transition-colors" />
                <FontAwesomeIcon icon={faLinkedin} className="cursor-pointer hover:text-white transition-colors" />
                <FontAwesomeIcon icon={faInstagram} className="cursor-pointer hover:text-white transition-colors" />
                <FontAwesomeIcon icon={faMessage} className="cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>
          </div>

          {/* Right Column - NFT Card */}
          <div ref={nftCardRef} className='flex justify-center items-center flex-col'>
            {/* <h3 className="text-xl font-semibold mb-4 text-white">Your Student NFT</h3> */}
            <NFTCard
              tokenId={nftTokenID}
              score={offChainEngagementScore}
              walletAddress={walletAddress}
            />
          </div>
        </div>
      </div>

      {/* Edit Username Modal */}
      <EditUsernameModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        currentUsername={username}
      />
    </div>
  );
}

export default UserPage;