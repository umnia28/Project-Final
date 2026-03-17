'use client'

import React, { useState } from 'react'
import { Sparkles, Mail, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { Playfair_Display, Cormorant_Garamond } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      toast.error('Please enter your email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)

      const res = await fetch(`${API}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || 'Subscription failed')
      }

      toast.success(data.message || 'Subscription email sent ✨')
      setEmail('')
    } catch (error) {
      toast.error(error.message || 'Could not subscribe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden px-6 md:px-10 my-28 max-w-7xl mx-auto">
      <div className="absolute -top-16 left-0 h-56 w-56 rounded-full bg-pink-300/20 blur-3xl -z-10" />
      <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-orange-300/20 blur-3xl -z-10" />

      <div className="rounded-[2rem] border border-white/60 bg-white/65 p-6 shadow-[0_20px_70px_rgba(236,72,153,0.08)] backdrop-blur-xl md:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-1.5 shadow-sm backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-pink-500" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-600">
              Atelier Letters
            </span>
          </div>

          <div className="mt-6">
            <p className={`${cormorant.className} text-sm md:text-base tracking-[0.45em] uppercase text-slate-500`}>
              Stay Inspired
            </p>

            <h2 className={`${playfair.className} mt-2 text-4xl sm:text-5xl md:text-6xl leading-none font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent`}>
              The Charis Journal
            </h2>

            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-pink-300" />
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400" />
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-orange-300" />
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-sm md:text-base leading-7 text-slate-600">
            Subscribe to the Charis Journal for privileged access to new arrivals,
            limited pieces, and refined inspirations from our atelier.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 w-full max-w-2xl">
            <div className="flex flex-col gap-3 rounded-[1.75rem] border border-white/70 bg-white/75 p-3 shadow-[0_12px_35px_rgba(168,85,247,0.08)] backdrop-blur-md sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3 rounded-full bg-white/80 px-4 py-3">
                <Mail className="h-5 w-5 text-pink-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(236,72,153,0.22)] transition-all duration-300 ${
                  loading
                    ? 'cursor-not-allowed bg-slate-300'
                    : 'bg-gradient-to-r from-orange-800 via-pink-500 to-orange-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(168,85,247,0.28)]'
                }`}
              >
                {loading ? 'Sending...' : 'Get Updates'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Newsletter