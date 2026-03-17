'use client'
import { assets } from '@/assets/assets'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '৳'

  return (
    <div className='mx-4 sm:mx-6'>
      <div className='flex flex-col gap-8 max-w-7xl mx-auto my-8 sm:my-10'>

        {/* ================= BIG HERO CARD ================= */}
        <div
          className="
            relative
            w-full
            max-w-[95vw]
            min-h-[82vh]
            mx-auto
            flex flex-col
            rounded-[2rem] sm:rounded-[2.5rem]
            overflow-hidden
            group
            border border-white/40
            shadow-[0_25px_80px_rgba(73,44,20,0.12)]
          "
        >
          {/* Background Image */}
          <Image
            src={assets.CoverBC}
            alt="Hero background"
            fill
            priority
            className="object-cover object-center transition-transform duration-[2200ms] group-hover:scale-[1.03]"
          />

          {/* Premium overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fff8f0]/75 via-[#fff7ef]/28 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/8 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.34),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,220,190,0.14),transparent_25%)]" />

          {/* subtle texture */}
          <div
            className="absolute inset-0 opacity-[0.06] mix-blend-multiply pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(rgba(95,72,49,0.10) 0.7px, transparent 0.7px)",
              backgroundSize: "14px 14px",
            }}
          />

          {/* Content */}
          <div className='relative z-10 p-5 sm:p-10 lg:p-14 flex flex-col justify-between min-h-[82vh]'>

            {/* Top block */}
            <div className="max-w-3xl">
              {/* Better badge */}
              <div
                className="
                  relative inline-flex items-center gap-3
                  rounded-full border border-white/60
                  bg-[linear-gradient(135deg,rgba(255,250,245,0.92),rgba(255,244,235,0.78))]
                  px-2 py-2 pr-5
                  text-black shadow-[0_10px_30px_rgba(120,84,48,0.10)]
                  backdrop-blur-md
                  transition-all duration-300
                  hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(120,84,48,0.14)]
                "
              >
                <span className="bg-gradient-to-r from-purple-500 via-rose-400 to-orange-400 px-4 py-1.5 rounded-full text-white text-sm sm:text-base font-[Garamond] font-semibold shadow-md">
                  The Perfect Gift
                </span>

                <span className="hidden sm:inline text-[13px] lg:text-[15px] font-medium text-stone-800 font-[Garamond] tracking-[0.01em]">
                  A refined piece that carries warmth, artistry, and a sense of lasting presence.
                </span>
              </div>

              {/* Heading */}
              <h2
                className="
                  mt-8 sm:mt-10
                  text-5xl sm:text-6xl lg:text-7xl
                  leading-[0.95]
                  max-w-3xl
                  font-serif font-semibold
                  text-transparent
                  bg-gradient-to-r from-stone-900 via-slate-900 to-orange-700
                  bg-clip-text
                "
              >
                A graceful collection of vivid arts & fine craftsmanship.
              </h2>

              <p className="mt-5 max-w-2xl text-sm sm:text-base lg:text-lg leading-8 text-stone-900/75 font-[Georgia]">
                Discover artful décor, handmade pieces, and objects with texture,
                meaning, and quiet elegance—curated to make every corner feel more personal.
              </p>
            </div>

            {/* Bottom right aligned CTA block */}
            <div className='flex flex-col items-end text-right mt-10'>
              <div className='text-white text-sm font-semibold font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]'>
                <p className='text-2xl sm:text-3xl font-[Garamond] font-semibold'>
                  Exclusive Artisan Creations
                </p>
                <p className='text-xl sm:text-2xl font-[Garamond] text-white/80'>
                  Starting only at {currency} 499
                </p>
              </div>

              <Link href="/shop">
                    <button
                        className='
                        group relative overflow-hidden
                        inline-flex items-center gap-2
                        bg-[linear-gradient(90deg,#2f2419,#473426)]
                        text-white text-sm sm:text-[15px]
                        py-3 px-7 sm:py-4 sm:px-10
                        mt-4 sm:mt-8
                        rounded-full
                        shadow-[0_14px_30px_rgba(47,36,25,0.18)]
                        transition-all duration-300
                        hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(47,36,25,0.24)]
                        active:scale-95
                        '
                    >
                        {/* ✨ Shine effect */}
                        <span className='absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out' />

                        {/* Content */}
                        <span className='relative z-10 flex items-center gap-2'>
                        EXPLORE THE GALLERY
                        </span>
                    </button>
                    </Link>
            </div>
          </div>
        </div>

        {/* ================= SMALL CARDS ================= */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-sm text-slate-600'>
          {/* Card 1 */}
          <div className='flex items-center justify-between bg-orange-200 rounded-3xl p-6 px-8 group'>
            <div>
              <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent max-w-40'>
                Curators&apos; Picks
              </p>
              <p className='flex items-center gap-1 mt-4'>
                Thoughtfully chosen,<br />
                just for you
              </p>
            </div>
            <Image
              className='w-40 rounded-2xl transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 group-hover:shadow-xl'
              src={assets.hero_product_img1}
              alt=''
            />
          </div>

          {/* Card 2 */}
          <div className='flex items-center justify-between bg-purple-200 rounded-3xl p-6 px-8 group'>
            <div>
              <p className='text-3xl font-medium bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 bg-clip-text text-transparent max-w-40'>
                Get 10% Off
              </p>
              <p className='flex items-center gap-1 mt-4'>
                Good taste,better price
              </p>
            </div>
            <Image
              className='w-40 rounded-2xl transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 group-hover:shadow-xl'
              src={assets.hero_product_img2}
              alt=''
            />
          </div>

          {/* Card 3 */}
          <div className='flex items-center justify-between bg-blue-200 rounded-3xl p-6 px-8 group'>
            <div>
              <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-blue-200 bg-clip-text text-transparent max-w-40'>
                New arrivals
              </p>
              <p className='flex items-center gap-1 mt-4'>
                The latest,just landed
              </p>
            </div>
            <Image
              className='w-40 rounded-2xl transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 group-hover:shadow-xl'
              src={assets.hero_product_img3}
              alt=''
            />
          </div>
        </div>
      </div>

      <CategoriesMarquee />
    </div>
  )
}

export default Hero


