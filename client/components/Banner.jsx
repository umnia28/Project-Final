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
    <div className="relative w-full overflow-hidden border-b border-[#2d2a6b] bg-[linear-gradient(90deg,#1e1b4b_0%,#4c1d95_50%,#1e3a8a_100%)]">

      {/* dark overlay for stronger contrast */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.24)_0%,rgba(0,0,0,0.14)_50%,rgba(0,0,0,0.24)_100%)]" />

      {/* subtle cool glows */}
      <div className="absolute -left-16 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-[#7c3aed]/20 blur-3xl" />
      <div className="absolute left-1/3 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-[#8b5cf6]/18 blur-3xl" />
      <div className="absolute right-0 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-[#3b82f6]/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 text-sm text-white/95">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 backdrop-blur-md">
            <Sparkles size={14} className="text-white" />
          </div>

          <p className="truncate font-medium tracking-[0.01em] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
            <span className="font-semibold text-white">Up to 50% off</span>{' '}
            on our Ethnic Collection, crafted to bring heritage, warmth, and timeless elegance into everyday living.
          </p>

          <span className="hidden items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-white backdrop-blur sm:flex">
            <Gift size={12} />
            ETHNIC50
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={handleClaim}
            className="
              hidden sm:inline-flex items-center gap-2
              rounded-full border border-white/30
              bg-white/10 px-4 py-2
              text-xs font-semibold text-white
              backdrop-blur-md
              transition-all duration-200
              hover:bg-white/18 hover:-translate-y-[1px]
            "
          >
            Claim Offer
            <ArrowRight size={14} />
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="
              rounded-full p-1.5
              text-white/85
              transition-all duration-200
              hover:bg-white/12 hover:text-white
            "
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}


// 'use client'
// import React from 'react'
// import toast from 'react-hot-toast'
// import { Sparkles, Gift, X, ArrowRight } from 'lucide-react'

// export default function Banner() {
//   const [isOpen, setIsOpen] = React.useState(true)

//   const handleClaim = async () => {
//     try {
//       await navigator.clipboard.writeText('ETHNIC50')
//       toast.success('Coupon copied to clipboard!')
//     } catch {
//       toast.success('Use code: ETHNIC50')
//     }
//     setIsOpen(false)
//   }

//   if (!isOpen) return null

//   return (
//     <div className="relative w-full overflow-hidden border-b border-[#b9c9ea] bg-[linear-gradient(90deg,#d9b58f_0%,#8f82db_48%,#76aeea_100%)]">

//       {/* stronger overlay for richer look */}
//       <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(120,78,40,0.16)_0%,rgba(90,70,180,0.12)_50%,rgba(45,110,190,0.14)_100%)]" />

//       {/* vibrant glows */}
//       <div className="absolute -left-16 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-[#f2c89b]/30 blur-3xl" />
//       <div className="absolute left-1/3 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-[#b299ff]/22 blur-3xl" />
//       <div className="absolute right-0 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-[#8cc7ff]/28 blur-3xl" />

//       <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
//         <div className="flex min-w-0 items-center gap-3 text-sm text-white/95">
//           <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/20 backdrop-blur-md">
//             <Sparkles size={14} className="text-white" />
//           </div>

//           <p className="truncate font-medium tracking-[0.01em]">
//             <span className="font-semibold text-white">Up to 50% off</span>{' '}
//             on our Ethnic Collection, crafted to bring heritage, warmth, and timeless elegance into everyday living.
//           </p>

//           <span className="hidden items-center gap-1.5 rounded-full border border-white/35 bg-white/18 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-white backdrop-blur sm:flex">
//             <Gift size={12} />
//             ETHNIC50
//           </span>
//         </div>

//         <div className="flex shrink-0 items-center gap-2">
//           <button
//             onClick={handleClaim}
//             className="
//               hidden sm:inline-flex items-center gap-2
//               rounded-full border border-white/35
//               bg-white/20 px-4 py-2
//               text-xs font-semibold text-white
//               backdrop-blur-md
//               transition-all duration-200
//               hover:bg-white/28 hover:-translate-y-[1px]
//             "
//           >
//             Claim Offer
//             <ArrowRight size={14} />
//           </button>

//           <button
//             onClick={() => setIsOpen(false)}
//             className="
//               rounded-full p-1.5
//               text-white/85
//               transition-all duration-200
//               hover:bg-white/20 hover:text-white
//             "
//           >
//             <X size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }


// 'use client'
// import React from 'react'
// import toast from 'react-hot-toast'
// import { Sparkles, Gift, X, ArrowRight } from 'lucide-react'

// export default function Banner() {
//   const [isOpen, setIsOpen] = React.useState(true)

//   const handleClaim = async () => {
//     try {
//       await navigator.clipboard.writeText('ETHNIC50')
//       toast.success('Coupon copied to clipboard!')
//     } catch {
//       toast.success('Use code: ETHNIC50')
//     }
//     setIsOpen(false)
//   }

//   if (!isOpen) return null

//   return (
//     <div className="relative w-full overflow-hidden border-b border-[#dcd3ea] bg-[linear-gradient(90deg,#5b3f73_0%,#4a5d8c_45%,#7a4a68_100%)]">

//       {/* Soft premium glow */}
//       <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_left,rgba(168,85,247,0.20),transparent_30%),radial-gradient(circle_at_right,rgba(59,130,246,0.20),transparent_30%)]" />

//       {/* Light blur accents */}
//       <div className="absolute -left-12 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-purple-300/30 blur-3xl" />
//       <div className="absolute right-0 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-blue-300/30 blur-3xl" />

//       {/* Content */}
//       <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">

//         {/* Left */}
//         <div className="flex min-w-0 items-center gap-3 text-sm text-white/95">

//           {/* Icon */}
//           <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md">
//             <Sparkles size={14} className="text-purple-200" />
//           </div>

//           {/* Text */}
//           <p className="truncate font-medium tracking-[0.01em]">
//             <span className="font-semibold text-white">Up to 50% off</span>{' '}
//             on our Ethnic Collection, crafted to bring heritage, warmth, and timeless elegance into everyday living.
//           </p>

//           {/* Coupon */}
//           <span className="hidden items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-purple-100 backdrop-blur sm:flex">
//             <Gift size={12} />
//             ETHNIC50
//           </span>
//         </div>

//         {/* Right */}
//         <div className="flex shrink-0 items-center gap-2">

//           {/* Claim Button */}
//           <button
//             onClick={handleClaim}
//             className="
//               hidden sm:inline-flex items-center gap-2
//               rounded-full border border-white/30
//               bg-white/20 px-4 py-2
//               text-xs font-semibold text-white
//               backdrop-blur-md
//               transition-all duration-200
//               hover:bg-white/30 hover:-translate-y-[1px]
//             "
//           >
//             Claim Offer
//             <ArrowRight size={14} />
//           </button>

//           {/* Close */}
//           <button
//             onClick={() => setIsOpen(false)}
//             className="
//               rounded-full p-1.5
//               text-white/80
//               transition-all duration-200
//               hover:bg-white/20 hover:text-white
//             "
//           >
//             <X size={16} />
//           </button>

//         </div>
//       </div>
//     </div>
//   )
// }