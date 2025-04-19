

function Footer() {
  return (
    <footer className="w-full flex flex-col items-center justify-center py-8  text-white">
      <div className="mb-4">
      <img src="./white-icon.svg" alt="Logo" className="h-12 w-12" />
      </div>
      <div className="text-center">
      <p className="text-lg font-semibold">StuNFT</p>
      <p className="text-sm mt-1">Empowering students with NFT technology.</p>
      <p className="text-xs mt-2">&copy; {new Date().getFullYear()} StuNFT. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer

/* Rectangle 22 */


