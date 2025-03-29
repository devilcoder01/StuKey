import React from 'react'
import Navbar from '../ui/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter'
import { faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faMessage } from '@fortawesome/free-solid-svg-icons'

function UserPage() {
  return (
    <div>
        <div className='px-24 py-40 flex justify-between items-center max-w-7xl mx-auto'>
            <div className='flex w-1/2 gap-14'>
                <div>
                    <div className="imagecontainer mb-9">
                        <div className='w-32 h-32 rounded-full bg-amber-500'></div>
                    </div>
                    <div className="social">
                        <div className='text-xl mb-5'>Social</div>
                        <div className='flex gap-6 text-xl'>
                            <FontAwesomeIcon icon={faTwitter} />
                            <FontAwesomeIcon icon={faLinkedin} />
                            <FontAwesomeIcon icon={faInstagram} />
                            <FontAwesomeIcon icon={faMessage} />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="walletadddr text-sm font-normal mb-8">0x5d28....a294c4f</div>
                    <div className='flex flex-col gap-4'>
                        <div className="name flex text-xl"><span className='font-bold'>Name:</span><span>Subhadip</span></div>
                        <div className="name flex text-xl"><span className='font-bold'>Email:</span><span>subhadipjana69@gmail.com</span></div>
                    </div> 
                    <div className="mt-7 text-xl"><button className='px-7 py-1 bg-[#2B2928] text-white rounded-lg cursor-pointer'>Edit</button></div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserPage