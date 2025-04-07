import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'

// Define the props type
interface ScoreProps {
  engagePoint: number | null; // Allow null since initial state in Mint.tsx is null
}

// Destructure the props object
function Score({ engagePoint }: ScoreProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div>
        <div className="w-80 h-44 rounded-2xl bg-gradient-to-b relative from-[#493F3F] to-[#7B3041] text-white px-8 flex flex-col justify-center gap-5 ">
            <div className='text-sm font-semibold'>You're Stukey Score</div>
            {/* Conditionally render or provide default */}
            <div className='text-3xl flex gap-2 font-semibold'><span>{engagePoint ?? '--'}</span>/<span>100</span></div>
            <div 
              className="exclamatory text-gray-300 absolute right-5 top-5 cursor-pointer"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
                <FontAwesomeIcon icon={faCircleExclamation} />
                {showTooltip && (
                  <div
                    className="absolute top-8 right-0 bg-white text-black text-xs rounded-lg shadow-lg p-2 w-28"
                    style={{ transform: "translateX(50%)" }}
                  >
                    This is your Stukey score tooltip.
                  </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default Score