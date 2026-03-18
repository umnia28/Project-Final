'use client'
import React from 'react'
import Title from './Title'
import { ourSpecsData } from '@/assets/assets'
import { Sparkles } from 'lucide-react'

const OurSpecs = () => {
  return (
    <section className="relative py-36 px-6 overflow-hidden font-serif">

      {/* ── Atmospheric background ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#fdf7ef]" />

        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#689ff7]/25 blur-[120px]" />
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full bg-[#d9b1fc]/25 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] rounded-full bg-[#e6b57e]/25 blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto">

        {/* ── Eyebrow label ── */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#689ff7]" />
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#689ff7] font-sans font-medium">
            The Atelier Promise
          </span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#689ff7]" />
        </div>

        {/* ── Title block ── */}
        <Title
          visibleButton={false}
          title="Why Shop On CharisAtelier?"
          description="At Charis Atelier, every piece tells a story. We celebrate timeless craftsmanship, honoring tradition while embracing modern elegance. From meticulously handcrafted creations to curated collections, shopping with us means bringing home art, culture, and sophistication."
        />

        {/* ── Ornamental divider ── */}
        <div className="flex items-center justify-center mt-10 mb-20 gap-2">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#689ff7] to-[#689ff7]/60" />
          <Sparkles className="text-[#689ff7] mx-1" size={14} />
          <div className="h-[3px] w-3 rounded-full bg-[#d9b1fc]" />
          <Sparkles className="text-[#e6b57e] mx-1" size={14} />
          <div className="h-px w-16 bg-gradient-to-l from-transparent via-[#e6b57e] to-[#e6b57e]/60" />
        </div>

        {/* ── Specs grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ourSpecsData.map((spec, index) => (
            <div
              key={index}
              className="group relative rounded-3xl p-px overflow-hidden"
              style={{
                animationDelay: `${index * 80}ms`,
              }}
            >
              <div
                className="absolute inset-0 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${spec.accent}55 0%, transparent 50%, ${spec.accent}33 100%)`,
                }}
              />

              <div className="relative rounded-3xl bg-white/80 backdrop-blur-2xl p-9 text-center h-full flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-1">

                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 opacity-20 blur-2xl rounded-full transition-opacity duration-500 group-hover:opacity-40"
                  style={{ backgroundColor: spec.accent }}
                />

                <div className="relative mb-7">
                  <div
                    className="absolute inset-0 rounded-2xl scale-[1.35] opacity-15 group-hover:opacity-30 transition-opacity duration-500 blur-sm"
                    style={{ backgroundColor: spec.accent }}
                  />
                  <div
                    className="relative flex items-center justify-center w-14 h-14 rounded-2xl text-white shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2"
                    style={{
                      background: `linear-gradient(145deg, ${spec.accent}ee, ${spec.accent}99)`,
                      boxShadow: `0 8px 24px ${spec.accent}44`,
                    }}
                  >
                    <spec.icon size={22} strokeWidth={1.8} />
                  </div>
                </div>

                <h3 className="text-base font-semibold tracking-wide text-slate-800 mb-1">
                  {spec.title}
                </h3>

                <div
                  className="w-8 h-px mb-4 rounded-full transition-all duration-300 group-hover:w-14"
                  style={{ backgroundColor: spec.accent }}
                />

                <p className="text-sm text-slate-500 leading-relaxed font-sans">
                  {spec.description}
                </p>

                <div
                  className="absolute bottom-4 right-4 w-6 h-6 rounded-full opacity-10 group-hover:opacity-25 transition-opacity duration-500 blur-sm"
                  style={{ backgroundColor: spec.accent }}
                />

              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-slate-400 font-sans">
            Crafted with intention · Delivered with grace
          </p>
        </div>

      </div>
    </section>
  )
}

export default OurSpecs

// 'use client'
// import React from 'react'
// import Title from './Title'
// import { ourSpecsData } from '@/assets/assets'
// import { Sparkles } from 'lucide-react'

// const OurSpecs = () => {
//   return (
//     <section className="relative py-36 px-6 overflow-hidden font-serif">

//       {/* ── Atmospheric background ── */}
//       <div className="pointer-events-none absolute inset-0 -z-10">
//         {/* warm ivory base */}
//         <div className="absolute inset-0 bg-[#fdf8f4]" />
//         {/* radial mesh blobs */}
//         <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-rose-200/30 blur-[120px]" />
//         <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full bg-fuchsia-200/25 blur-[100px]" />
//         <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] rounded-full bg-amber-200/25 blur-[100px]" />
//         {/* fine grain overlay */}
//         <div
//           className="absolute inset-0 opacity-[0.03]"
//           style={{
//             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
//             backgroundSize: '200px 200px',
//           }}
//         />
//       </div>

//       <div className="relative max-w-6xl mx-auto">

//         {/* ── Eyebrow label ── */}
//         <div className="flex items-center justify-center gap-3 mb-6">
//           <div className="h-px w-8 bg-gradient-to-r from-transparent to-rose-300" />
//           <span className="text-[10px] tracking-[0.35em] uppercase text-rose-400 font-sans font-medium">
//             The Atelier Promise
//           </span>
//           <div className="h-px w-8 bg-gradient-to-l from-transparent to-rose-300" />
//         </div>

//         {/* ── Title block ── */}
//         <Title
//           visibleButton={false}
//           title="Why Shop On CharisAtelier?"
//           description="At Charis Atelier, every piece tells a story. We celebrate timeless craftsmanship, honoring tradition while embracing modern elegance. From meticulously handcrafted creations to curated collections, shopping with us means bringing home art, culture, and sophistication."
//         />

//         {/* ── Ornamental divider ── */}
//         <div className="flex items-center justify-center mt-10 mb-20 gap-2">
//           <div className="h-px w-16 bg-gradient-to-r from-transparent via-rose-300 to-rose-300/60" />
//           <Sparkles className="text-rose-400 mx-1" size={14} />
//           <div className="h-[3px] w-3 rounded-full bg-rose-300" />
//           <Sparkles className="text-amber-400 mx-1" size={14} />
//           <div className="h-px w-16 bg-gradient-to-l from-transparent via-amber-300 to-amber-300/60" />
//         </div>

//         {/* ── Specs grid ── */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {ourSpecsData.map((spec, index) => (
//             <div
//               key={index}
//               className="group relative rounded-3xl p-px overflow-hidden"
//               style={{
//                 animationDelay: `${index * 80}ms`,
//               }}
//             >
//               {/* gradient border shell */}
//               <div
//                 className="absolute inset-0 rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
//                 style={{
//                   background: `linear-gradient(135deg, ${spec.accent}55 0%, transparent 50%, ${spec.accent}33 100%)`,
//                 }}
//               />

//               {/* card body */}
//               <div className="relative rounded-3xl bg-white/80 backdrop-blur-2xl p-9 text-center h-full flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-1">

//                 {/* top ambient glow behind icon */}
//                 <div
//                   className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 opacity-20 blur-2xl rounded-full transition-opacity duration-500 group-hover:opacity-40"
//                   style={{ backgroundColor: spec.accent }}
//                 />

//                 {/* icon ring */}
//                 <div className="relative mb-7">
//                   {/* outer soft ring */}
//                   <div
//                     className="absolute inset-0 rounded-2xl scale-[1.35] opacity-15 group-hover:opacity-30 transition-opacity duration-500 blur-sm"
//                     style={{ backgroundColor: spec.accent }}
//                   />
//                   {/* inner icon container */}
//                   <div
//                     className="relative flex items-center justify-center w-14 h-14 rounded-2xl text-white shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2"
//                     style={{
//                       background: `linear-gradient(145deg, ${spec.accent}ee, ${spec.accent}99)`,
//                       boxShadow: `0 8px 24px ${spec.accent}44`,
//                     }}
//                   >
//                     <spec.icon size={22} strokeWidth={1.8} />
//                   </div>
//                 </div>

//                 {/* title */}
//                 <h3 className="text-base font-semibold tracking-wide text-slate-800 mb-1">
//                   {spec.title}
//                 </h3>

//                 {/* thin accent rule */}
//                 <div
//                   className="w-8 h-px mb-4 rounded-full transition-all duration-300 group-hover:w-14"
//                   style={{ backgroundColor: spec.accent }}
//                 />

//                 {/* description */}
//                 <p className="text-sm text-slate-500 leading-relaxed font-sans">
//                   {spec.description}
//                 </p>

//                 {/* bottom corner flourish */}
//                 <div
//                   className="absolute bottom-4 right-4 w-6 h-6 rounded-full opacity-10 group-hover:opacity-25 transition-opacity duration-500 blur-sm"
//                   style={{ backgroundColor: spec.accent }}
//                 />

//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ── Bottom tagline ── */}
//         <div className="mt-20 text-center">
//           <p className="text-xs tracking-[0.3em] uppercase text-slate-400 font-sans">
//             Crafted with intention · Delivered with grace
//           </p>
//         </div>

//       </div>
//     </section>
//   )
// }

// export default OurSpecs