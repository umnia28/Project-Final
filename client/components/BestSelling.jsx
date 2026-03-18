'use client'

import { useEffect, useMemo } from 'react'
import { Sparkles, Crown, ArrowUpRight } from 'lucide-react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDbProducts } from '@/lib/features/product/productSlice'
import { Playfair_Display, Cormorant_Garamond } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700']
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

const BestSelling = () => {
  const dispatch = useDispatch()
  const displayQuantity = 8

  const { list: products, loading } = useSelector((state) => state.product)

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchDbProducts())
    }
  }, [dispatch, products])

  const getBestSellingScore = (product) => {
    if (typeof product?.sold === 'number') return product.sold
    if (typeof product?.sold_count === 'number') return product.sold_count
    if (typeof product?.total_sold === 'number') return product.total_sold
    if (typeof product?.totalSold === 'number') return product.totalSold
    if (typeof product?.qty_sold === 'number') return product.qty_sold
    if (typeof product?.orders_count === 'number') return product.orders_count

    if (!isNaN(Number(product?.sold))) return Number(product.sold)
    if (!isNaN(Number(product?.sold_count))) return Number(product.sold_count)
    if (!isNaN(Number(product?.total_sold))) return Number(product.total_sold)
    if (!isNaN(Number(product?.totalSold))) return Number(product.totalSold)
    if (!isNaN(Number(product?.qty_sold))) return Number(product.qty_sold)
    if (!isNaN(Number(product?.orders_count))) return Number(product.orders_count)

    if (Array.isArray(product?.rating)) return product.rating.length
    if (typeof product?.rating_count === 'number') return product.rating_count
    if (!isNaN(Number(product?.rating_count))) return Number(product.rating_count)

    return 0
  }

  const bestSellingProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return []

    return [...products]
      .sort((a, b) => getBestSellingScore(b) - getBestSellingScore(a))
      .slice(0, displayQuantity)
  }, [products])

  return (
    <section className="relative mx-auto my-28 max-w-7xl overflow-hidden px-6 md:px-10">

      {/* Artistic background glows */}
      <div className="absolute -top-16 left-0 h-56 w-56 rounded-full bg-[#e6d8c3]/20 blur-3xl -z-10" />
      <div className="absolute top-24 right-0 h-72 w-72 rounded-full bg-[#d7c4ef]/20 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#bfdaf6]/20 blur-3xl -z-10" />

      <div className="rounded-[2rem] border border-white/60 bg-white/65 p-6 shadow-[0_20px_70px_rgba(167,139,219,0.08)] backdrop-blur-xl md:p-10">

        {/* CENTERED HEADER */}
        <div className="flex flex-col items-center text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-1.5 shadow-sm backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#8b7bd6]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-600">
              Curated Collection
            </span>
          </div>

          <div className="mt-6">
            <p className={`${cormorant.className} text-sm md:text-base tracking-[0.45em] uppercase text-slate-500`}>
              Best Selling
            </p>

            <h2 className={`${playfair.className} mt-2 text-4xl sm:text-5xl md:text-6xl leading-none font-semibold bg-gradient-to-r from-[#7fb6ea] via-[#a78bdb] to-[#d8c3a5] bg-clip-text text-transparent`}>
              Hall Of Fame
            </h2>

            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#bfdaf6]" />
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-[#7fb6ea] via-[#a78bdb] to-[#d8c3a5]" />
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#e6d8c3]" />
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Discover the most admired pieces from our collection — thoughtfully loved,
            beautifully crafted, and chosen for their elegance, artistry, and timeless charm.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="rounded-2xl border border-white/60 bg-white/70 px-5 py-4 shadow-sm backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">
                Top Picks
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-800">
                {bestSellingProducts.length}
              </p>
            </div>

            <div className="rounded-2xl border border-white/60 bg-gradient-to-r from-[#f7f1e8]/90 via-white/80 to-[#eef6ff]/90 px-5 py-4 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-center gap-2">
                <Crown className="h-5 w-5 text-[#a78bdb]" />
                <p className="text-sm font-semibold text-slate-700">
                  Most Loved
                </p>
              </div>
              <p className="mt-1 text-xs tracking-wide text-slate-500">
                Ranked by popularity
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-[#d7c4ef] to-transparent" />

        {/* PRODUCTS */}
        {loading ? (
          <p className="text-center text-lg text-slate-500">
            Loading products...
          </p>
        ) : bestSellingProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {bestSellingProducts.map((product, index) => (
                <div key={product?.id || product?.product_id || index} className="group relative">
                  {index < 3 && (
                    <div className="absolute -top-3 left-3 z-20 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#d8c3a5] via-[#a78bdb] to-[#7fb6ea] px-3 py-1 text-xs font-semibold text-white shadow-lg">
                      <Crown className="h-3.5 w-3.5" />
                      #{index + 1}
                    </div>
                  )}

                  <div className="transition-all duration-300 group-hover:-translate-y-1">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>

            {/* Explore button */}
            <div className="mt-12 flex justify-center">
              <a
                href="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d8c3a5] via-[#a78bdb] to-[#7fb6ea] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(167,139,219,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(127,182,234,0.28)]"
              >
                Explore Full Collection
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </>
        ) : (
          <p className="text-center text-slate-500">
            No products found.
          </p>
        )}
      </div>
    </section>
  )
}

export default BestSelling



// 'use client'

// import { useEffect, useMemo } from 'react'
// import { Sparkles, Crown, ArrowUpRight } from 'lucide-react'
// import Title from './Title'
// import ProductCard from './ProductCard'
// import { useDispatch, useSelector } from 'react-redux'
// import { fetchDbProducts } from '@/lib/features/product/productSlice'
// import { Playfair_Display, Cormorant_Garamond } from 'next/font/google'

// const playfair = Playfair_Display({
//   subsets: ['latin'],
//   weight: ['500', '600', '700']
// })

// const cormorant = Cormorant_Garamond({
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700']
// })

// const BestSelling = () => {
//   const dispatch = useDispatch()
//   const displayQuantity = 8

//   const { list: products, loading } = useSelector((state) => state.product)

//   useEffect(() => {
//     if (!products || products.length === 0) {
//       dispatch(fetchDbProducts())
//     }
//   }, [dispatch, products])

//   const getBestSellingScore = (product) => {
//     if (typeof product?.sold === 'number') return product.sold
//     if (typeof product?.sold_count === 'number') return product.sold_count
//     if (typeof product?.total_sold === 'number') return product.total_sold
//     if (typeof product?.totalSold === 'number') return product.totalSold
//     if (typeof product?.qty_sold === 'number') return product.qty_sold
//     if (typeof product?.orders_count === 'number') return product.orders_count

//     if (!isNaN(Number(product?.sold))) return Number(product.sold)
//     if (!isNaN(Number(product?.sold_count))) return Number(product.sold_count)
//     if (!isNaN(Number(product?.total_sold))) return Number(product.total_sold)
//     if (!isNaN(Number(product?.totalSold))) return Number(product.totalSold)
//     if (!isNaN(Number(product?.qty_sold))) return Number(product.qty_sold)
//     if (!isNaN(Number(product?.orders_count))) return Number(product.orders_count)

//     if (Array.isArray(product?.rating)) return product.rating.length
//     if (typeof product?.rating_count === 'number') return product.rating_count
//     if (!isNaN(Number(product?.rating_count))) return Number(product.rating_count)

//     return 0
//   }

//   const bestSellingProducts = useMemo(() => {
//     if (!Array.isArray(products) || products.length === 0) return []

//     return [...products]
//       .sort((a, b) => getBestSellingScore(b) - getBestSellingScore(a))
//       .slice(0, displayQuantity)
//   }, [products])

//   return (
//     <section className="relative overflow-hidden px-6 md:px-10 my-28 max-w-7xl mx-auto">

//       {/* Artistic background glows */}
//       <div className="absolute -top-16 left-0 h-56 w-56 rounded-full bg-pink-300/20 blur-3xl -z-10" />
//       <div className="absolute top-24 right-0 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl -z-10" />
//       <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-orange-300/20 blur-3xl -z-10" />

//       <div className="rounded-[2rem] border border-white/60 bg-white/65 backdrop-blur-xl shadow-[0_20px_70px_rgba(236,72,153,0.08)] p-6 md:p-10">

//         {/* CENTERED HEADER */}
//         <div className="flex flex-col items-center text-center">

//           <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-1.5 shadow-sm backdrop-blur-md">
//             <Sparkles className="h-3.5 w-3.5 text-pink-500" />
//             <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-600">
//               Curated Collection
//             </span>
//           </div>

//           <div className="mt-6">

//             <p className={`${cormorant.className} text-sm md:text-base tracking-[0.45em] uppercase text-slate-500`}>
//               Best Selling
//             </p>

//             <h2 className={`${playfair.className} mt-2 text-4xl sm:text-5xl md:text-6xl leading-none font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent`}>
//               Hall Of Fame
//             </h2>

//             <div className="mt-4 flex items-center justify-center gap-3">
//               <div className="h-px w-10 bg-gradient-to-r from-transparent to-pink-300" />
//               <div className="h-2 w-2 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400" />
//               <div className="h-px w-10 bg-gradient-to-l from-transparent to-orange-300" />
//             </div>

//           </div>

//           <p className="mt-6 max-w-2xl text-sm md:text-base leading-7 text-slate-600">
//             Discover the most admired pieces from our collection — thoughtfully loved,
//             beautifully crafted, and chosen for their elegance, artistry, and timeless charm.
//           </p>

//           <div className="mt-6 flex flex-wrap items-center justify-center gap-4">

//             <div className="rounded-2xl border border-white/60 bg-white/70 px-5 py-4 shadow-sm backdrop-blur-md">
//               <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">
//                 Top Picks
//               </p>
//               <p className="mt-1 text-2xl font-semibold text-slate-800">
//                 {bestSellingProducts.length}
//               </p>
//             </div>

//             <div className="rounded-2xl border border-white/60 bg-gradient-to-r from-pink-50/90 via-white/80 to-orange-50/90 px-5 py-4 shadow-sm backdrop-blur-md">
//               <div className="flex items-center justify-center gap-2">
//                 <Crown className="h-5 w-5 text-amber-500" />
//                 <p className="text-sm font-semibold text-slate-700">
//                   Most Loved
//                 </p>
//               </div>
//               <p className="mt-1 text-xs tracking-wide text-slate-500">
//                 Ranked by popularity
//               </p>
//             </div>

//           </div>

//         </div>

//         {/* Divider */}
//         <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-pink-200 to-transparent" />

//         {/* PRODUCTS */}
//         {loading ? (
//           <p className="text-center text-slate-500 text-lg">
//             Loading products...
//           </p>
//         ) : bestSellingProducts.length > 0 ? (

//           <>
//             <div className="grid grid-cols-2 gap-6 md:grid-cols-4">

//               {bestSellingProducts.map((product, index) => (

//                 <div key={product?.id || product?.product_id || index} className="relative group">

//                   {index < 3 && (
//                     <div className="absolute -top-3 left-3 z-20 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 px-3 py-1 text-xs font-semibold text-white shadow-lg">
//                       <Crown className="h-3.5 w-3.5" />
//                       #{index + 1}
//                     </div>
//                   )}

//                   <div className="transition-all duration-300 group-hover:-translate-y-1">
//                     <ProductCard product={product} />
//                   </div>

//                 </div>

//               ))}

//             </div>

//             {/* Explore button */}
//             <div className="mt-12 flex justify-center">

//               <a
//                 href="/shop"
//                 className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-300 via-purple-300 to-orange-300 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(236,72,153,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(168,85,247,0.28)]"
//               >
//                 Explore Full Collection
//                 <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
//               </a>

//             </div>

//           </>

//         ) : (

//           <p className="text-center text-slate-500">
//             No products found.
//           </p>

//         )}
//       </div>

//     </section>
//   )
// }

// export default BestSelling