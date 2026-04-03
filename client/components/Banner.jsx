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
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.32),rgba(0,0,0,0.14),rgba(0,0,0,0.32))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/30" />
      <div className="absolute -left-16 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute left-1/3 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute right-0 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
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