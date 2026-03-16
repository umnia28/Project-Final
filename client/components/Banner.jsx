/*'use client'
import React from 'react'
import toast from 'react-hot-toast';

export default function Banner() {

    const [isOpen, setIsOpen] = React.useState(true);

    const handleClaim = () => {
        setIsOpen(false);
        toast.success('Coupon copied to clipboard!');
        navigator.clipboard.writeText('ETHNIC50');
    };

    return isOpen && (
        <div className="w-full px-6 py-1 font-medium text-sm text-white text-center bg-gradient-to-r from-orange-800 via-purple-800 to-blue-800">
            <div className='flex items-center justify-between max-w-7xl  mx-auto'>
                <p>Upto 50% Off on Ethnic Collection</p>
                <div className="flex items-center space-x-6">
                    <button onClick={handleClaim} type="button" className="font-normal text-gray-800 bg-white px-7 py-2 rounded-full max-sm:hidden">Get The Offer</button>
                    <button onClick={() => setIsOpen(false)} type="button" className="font-normal text-gray-800 py-2 rounded-full">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect y="12.532" width="17.498" height="2.1" rx="1.05" transform="rotate(-45.74 0 12.532)" fill="#fff" />
                            <rect x="12.533" y="13.915" width="17.498" height="2.1" rx="1.05" transform="rotate(-135.74 12.533 13.915)" fill="#fff" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
*/


'use client'
import React from 'react'
import toast from 'react-hot-toast'
import { Sparkles, Gift, X } from 'lucide-react'

export default function Banner() {

  const [isOpen, setIsOpen] = React.useState(true)

  const handleClaim = () => {
    setIsOpen(false)
    toast.success('Coupon copied to clipboard!')
    navigator.clipboard.writeText('ETHNIC50')
  }

  if (!isOpen) return null

  return (
    <div className="relative w-full overflow-hidden">

      {/* Softer Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-300 via-purple-300 to-amber-200" />

      {/* Soft glow accents */}
      <div className="absolute -left-16 top-1/2 w-40 h-40 -translate-y-1/2 bg-rose-200/40 rounded-full blur-3xl" />
      <div className="absolute right-0 top-1/2 w-40 h-40 -translate-y-1/2 bg-amber-200/40 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between text-slate-800">

        {/* Left */}
        <div className="flex items-center gap-3 text-sm">

          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/40 backdrop-blur">
            <Sparkles size={14} />
          </div>

          <p className="font-medium tracking-wide">
            <span className="font-semibold">Up to 50% Off</span> on our Ethnic Collection
          </p>

          <span className="hidden md:flex items-center gap-1 bg-white/40 backdrop-blur px-3 py-0.5 rounded-full text-xs font-semibold tracking-wide">
            <Gift size={12} />
            ETHNIC50
          </span>

        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          <button
            onClick={handleClaim}
            className="
              hidden sm:flex
              items-center gap-2
              bg-white text-slate-800
              px-5 py-1.5
              rounded-full
              text-xs font-semibold
              shadow-md
              hover:shadow-lg
              hover:scale-105
              transition-all
            "
          >
            Claim Offer
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-white/30 transition"
          >
            <X size={16} />
          </button>

        </div>
      </div>
    </div>
  )
}