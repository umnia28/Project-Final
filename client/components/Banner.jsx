'use client'
import React from 'react'
import axios from 'axios'
import { Sparkles, X } from 'lucide-react'

const API = 'http://localhost:5000'

const gradients = [
  'bg-[linear-gradient(90deg,#1e293b_0%,#1e40af_50%,#7dd3fc_100%)]',
  'bg-[linear-gradient(90deg,#3b0764_0%,#7c3aed_50%,#ddd6fe_100%)]',
  'bg-[linear-gradient(90deg,#9f1239_0%,#ec4899_45%,#fb923c_100%)]',
]

export default function Banner() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [announcements, setAnnouncements] = React.useState([])
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [visible, setVisible] = React.useState(true)

  React.useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${API}/api/noticeboard`)
        setAnnouncements(res.data?.notices || [])
      } catch (error) {
        console.error('NOTICE FETCH ERROR:', error)
      }
    }

    fetchAnnouncements()
  }, [])

  React.useEffect(() => {
    if (announcements.length <= 1) return

    const interval = setInterval(() => {
      setVisible(false)

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length)
        setVisible(true)
      }, 450)
    }, 4200)

    return () => clearInterval(interval)
  }, [announcements.length])

  if (!isOpen || announcements.length === 0) return null

  const currentNotice = announcements[currentIndex]
  const gradient = gradients[currentIndex % gradients.length]

  return (
    <div
      className={`group relative w-full overflow-hidden border-b border-white/10 ${gradient} transition-all duration-700`}
    >
      {/* elegant dark overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.32),rgba(0,0,0,0.14),rgba(0,0,0,0.32))]" />

      {/* soft top shine */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/30" />

      {/* glow blobs */}
      <div className="absolute -left-16 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute left-1/3 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute right-0 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />

      {/* decorative floating light */}
      <div className="absolute -top-10 right-24 h-24 w-24 rounded-full bg-white/10 blur-2xl transition-transform duration-700 group-hover:scale-110" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 shadow-[0_8px_24px_rgba(255,255,255,0.08)] backdrop-blur-md">
            <Sparkles size={15} className="text-white" />
          </div>

          <div className="min-w-0">
            <div className="mb-0.5 flex items-center gap-2">
              <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur-sm">
                FEATURED
              </span>
            </div>

            <div
              className={`transform transition-all duration-500 ease-out ${
                visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              }`}
            >
              <p className="truncate text-sm font-medium tracking-[0.02em] text-white sm:text-[15px]">
                {currentNotice.notice_description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {announcements.length > 1 && (
            <div className="hidden items-center gap-1.5 sm:flex">
              {announcements.map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full transition-all duration-500 ${
                    i === currentIndex
                      ? 'h-1.5 w-6 bg-white shadow-[0_0_12px_rgba(255,255,255,0.45)]'
                      : 'h-1.5 w-1.5 bg-white/35'
                  }`}
                />
              ))}
            </div>
          )}

          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full border border-white/15 bg-white/10 p-1.5 text-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:text-white"
            aria-label="Close banner"
          >
            <X size={15} />
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