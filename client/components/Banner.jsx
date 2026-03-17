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
import { Sparkles, Gift, X, ArrowRight } from 'lucide-react'

export default function Banner() {
  const [isOpen, setIsOpen] = React.useState(true)

  const handleClaim = async () => {
    try {
      await navigator.clipboard.writeText('ETHNIC50')
      toast.success('Coupon copied to clipboard!')
    } catch {
      toast.success('Use code: ETHNIC50')
    }
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="relative w-full overflow-hidden border-b border-[#dcd3ea] bg-[linear-gradient(90deg,#5b3f73_0%,#4a5d8c_45%,#7a4a68_100%)]">

      {/* Soft premium glow */}
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_left,rgba(168,85,247,0.20),transparent_30%),radial-gradient(circle_at_right,rgba(59,130,246,0.20),transparent_30%)]" />

      {/* Light blur accents */}
      <div className="absolute -left-12 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-purple-300/30 blur-3xl" />
      <div className="absolute right-0 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-blue-300/30 blur-3xl" />

      {/* Content */}
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">

        {/* Left */}
        <div className="flex min-w-0 items-center gap-3 text-sm text-white/95">

          {/* Icon */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md">
            <Sparkles size={14} className="text-purple-200" />
          </div>

          {/* Text */}
          <p className="truncate font-medium tracking-[0.01em]">
            <span className="font-semibold text-white">Up to 50% off</span>{' '}
            on our Ethnic Collection, crafted to bring heritage, warmth, and timeless elegance into everyday living.
          </p>

          {/* Coupon */}
          <span className="hidden items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-purple-100 backdrop-blur sm:flex">
            <Gift size={12} />
            ETHNIC50
          </span>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Claim Button */}
          <button
            onClick={handleClaim}
            className="
              hidden sm:inline-flex items-center gap-2
              rounded-full border border-white/30
              bg-white/20 px-4 py-2
              text-xs font-semibold text-white
              backdrop-blur-md
              transition-all duration-200
              hover:bg-white/30 hover:-translate-y-[1px]
            "
          >
            Claim Offer
            <ArrowRight size={14} />
          </button>

          {/* Close */}
          <button
            onClick={() => setIsOpen(false)}
            className="
              rounded-full p-1.5
              text-white/80
              transition-all duration-200
              hover:bg-white/20 hover:text-white
            "
          >
            <X size={16} />
          </button>

        </div>
      </div>
    </div>
  )
}