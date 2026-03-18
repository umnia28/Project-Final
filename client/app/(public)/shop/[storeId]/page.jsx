'use client'

import ProductCard from "@/components/ProductCard"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { MailIcon, MapPinIcon, StoreIcon } from "lucide-react"
import Loading from "@/components/Loading"
import Image from "next/image"

const API = "http://localhost:5000"

export default function StoreShop() {
  const params = useParams()
  const rawStoreId = params?.storeId
  const storeId = Array.isArray(rawStoreId) ? rawStoreId[0] : rawStoreId

  const [products, setProducts] = useState([])
  const [storeInfo, setStoreInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const normalizeImageUrl = (url) => {
    if (!url || typeof url !== "string") return "/placeholder.png"

    const clean = url.trim().replace(/^"+|"+$/g, "")
    if (!clean) return "/placeholder.png"

    if (clean.startsWith("http://") || clean.startsWith("https://")) return clean
    if (clean.startsWith("/")) return `${API}${clean}`
    return `${API}/${clean}`
  }

  const getProductImage = (product) => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      const first = product.images[0]

      if (typeof first === "string") return normalizeImageUrl(first)

      if (first && typeof first === "object") {
        return normalizeImageUrl(
          first.image_url || first.url || first.image || first.src || first.path
        )
      }
    }

    if (typeof product?.images === "string" && product.images.trim() !== "") {
      return normalizeImageUrl(product.images)
    }

    return normalizeImageUrl(
      product?.image_url ||
      product?.image ||
      product?.product_image ||
      product?.thumbnail ||
      product?.poster ||
      product?.cover_url
    )
  }

  const fetchStoreData = async () => {
    try {
      if (!storeId) throw new Error("Invalid store id")

      setLoading(true)
      setError("")

      const res = await fetch(`${API}/api/public/stores/id/${storeId}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Failed to load store")

      const store = data.store
      if (!store) throw new Error("Store not found")

      const storeProducts = (data.products || []).map((p) => ({
        ...p,
        id: p.id || p.product_id,
        name: p.name || p.product_name,
        category: p.category || p.category_name || "",
        images: [getProductImage(p)],
      }))

      setStoreInfo({
        store_id: store.store_id,
        name: store.store_name || "Unnamed Store",
        logo: normalizeImageUrl(store.logo || store.profile_img || store.store_logo),
        description:
          store.description ||
          store.store_description ||
          "No description available.",
        address: store.address || "Address not available",
        email: store.email || "Email not available",
      })

      setProducts(storeProducts)
    } catch (err) {
      console.error(err)
      setError(err.message)
      setStoreInfo(null)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStoreData()
  }, [storeId])

  if (loading) return <Loading />

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white/85 backdrop-blur-md border border-[#ebe7f5] rounded-3xl p-8 text-center shadow-[0_12px_35px_rgba(180,160,255,0.08)]">
          <StoreIcon className="w-10 h-10 mx-auto text-violet-400 mb-3" />
          <h1 className="text-2xl font-semibold text-slate-800">Store not found</h1>
          <p className="text-slate-500 mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fcfcfa,#f8fbff,#faf7ff)] px-4 py-8">

      {/* STORE HEADER */}
      {storeInfo && (
        <div className="max-w-7xl mx-auto mt-6 rounded-3xl bg-gradient-to-r from-[#dbeafe] via-[#e9d5ff] to-[#f5f5dc] p-[2px] shadow-[0_14px_40px_rgba(180,160,255,0.15)]">
          <div className="rounded-3xl bg-white/85 backdrop-blur-md p-6 md:p-10 flex flex-col md:flex-row items-center gap-6">
            
            <Image
              src={storeInfo.logo}
              alt={storeInfo.name}
              className="size-32 object-cover rounded-xl border border-[#ebe7f5]"
              width={200}
              height={200}
            />

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-semibold text-slate-800">
                {storeInfo.name}
              </h1>

              <p className="text-sm text-slate-500 mt-2 max-w-lg">
                {storeInfo.description}
              </p>

              <div className="space-y-2 text-sm text-slate-500 mt-4">
                <div className="flex items-center justify-center md:justify-start">
                  <MapPinIcon className="w-4 h-4 text-violet-400 mr-2" />
                  <span>{storeInfo.address}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <MailIcon className="w-4 h-4 text-sky-400 mr-2" />
                  <span>{storeInfo.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS */}
      <div className="max-w-7xl mx-auto mt-12 mb-32">
        <h1 className="text-2xl">
          Shop{" "}
          <span className="bg-gradient-to-r from-sky-500 via-violet-500 to-indigo-400 bg-clip-text text-transparent font-semibold">
            Products
          </span>
        </h1>

        {products.length === 0 ? (
          <div className="mt-6 bg-white/85 backdrop-blur-md border border-[#ebe7f5] rounded-2xl p-8 text-slate-500 shadow-sm">
            No products available for this store.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 sm:flex sm:flex-wrap gap-6 xl:gap-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// 'use client'

// import ProductCard from "@/components/ProductCard"
// import { useParams } from "next/navigation"
// import { useEffect, useState } from "react"
// import { MailIcon, MapPinIcon, StoreIcon } from "lucide-react"
// import Loading from "@/components/Loading"
// import Image from "next/image"

// const API = "http://localhost:5000"

// export default function StoreShop() {
//   const params = useParams()
//   const rawStoreId = params?.storeId
//   const storeId = Array.isArray(rawStoreId) ? rawStoreId[0] : rawStoreId

//   const [products, setProducts] = useState([])
//   const [storeInfo, setStoreInfo] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")

//   const normalizeImageUrl = (url) => {
//     if (!url || typeof url !== "string") return "/placeholder.png"

//     const clean = url.trim().replace(/^"+|"+$/g, "")
//     if (!clean) return "/placeholder.png"

//     if (clean.startsWith("http://") || clean.startsWith("https://")) return clean
//     if (clean.startsWith("/")) return `${API}${clean}`
//     return `${API}/${clean}`
//   }

//   const getProductImage = (product) => {
//     if (Array.isArray(product?.images) && product.images.length > 0) {
//       const first = product.images[0]

//       if (typeof first === "string") return normalizeImageUrl(first)

//       if (first && typeof first === "object") {
//         return normalizeImageUrl(
//           first.image_url || first.url || first.image || first.src || first.path
//         )
//       }
//     }

//     if (typeof product?.images === "string" && product.images.trim() !== "") {
//       return normalizeImageUrl(product.images)
//     }

//     return normalizeImageUrl(
//       product?.image_url ||
//       product?.image ||
//       product?.product_image ||
//       product?.thumbnail ||
//       product?.poster ||
//       product?.cover_url
//     )
//   }

//   const fetchStoreData = async () => {
//     try {
//       if (!storeId) {
//         throw new Error("Invalid store id")
//       }

//       setLoading(true)
//       setError("")

//       const res = await fetch(`${API}/api/public/stores/id/${storeId}`)

//       const contentType = res.headers.get("content-type") || ""

//       if (!contentType.includes("application/json")) {
//         const text = await res.text()
//         console.error("Non-JSON response:", text)
//         throw new Error("Server returned invalid response. Check backend route.")
//       }

//       const data = await res.json()

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to load store")
//       }

//       const store = data.store || null

//       if (!store) {
//         throw new Error("Store not found")
//       }

//       const storeProducts = (data.products || []).map((p) => ({
//         ...p,
//         id: p.id || p.product_id,
//         name: p.name || p.product_name,
//         category: p.category || p.category_name || "",
//         images: [getProductImage(p)],
//       }))

//       setStoreInfo({
//         store_id: store.store_id,
//         name: store.store_name || "Unnamed Store",
//         logo: normalizeImageUrl(store.logo || store.profile_img || store.store_logo),
//         description:
//           store.description ||
//           store.store_description ||
//           "No description available.",
//         address: store.address || "Address not available",
//         email: store.email || "Email not available",
//       })

//       setProducts(storeProducts)
//     } catch (err) {
//       console.error("Store fetch error:", err)
//       setError(err.message || "Could not load store")
//       setStoreInfo(null)
//       setProducts([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchStoreData()
//   }, [storeId])

//   if (loading) return <Loading />

//   if (error) {
//     return (
//       <div className="min-h-[70vh] mx-6 flex items-center justify-center">
//         <div className="max-w-xl w-full bg-white border border-slate-200 rounded-2xl p-8 text-center">
//           <StoreIcon className="w-10 h-10 mx-auto text-slate-400 mb-3" />
//           <h1 className="text-2xl font-semibold text-slate-800">Store not found</h1>
//           <p className="text-slate-500 mt-2">{error}</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-[70vh] mx-6">
//       {storeInfo && (
//         <div className="max-w-7xl mx-auto bg-slate-50 rounded-xl p-6 md:p-10 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-xs border border-slate-200">
//           <Image
//             src={storeInfo.logo}
//             alt={storeInfo.name}
//             className="size-32 sm:size-38 object-cover border-2 border-slate-100 rounded-md"
//             width={200}
//             height={200}
//           />
//           <div className="text-center md:text-left">
//             <h1 className="text-3xl font-semibold text-slate-800">{storeInfo.name}</h1>
//             <p className="text-sm text-slate-600 mt-2 max-w-lg">{storeInfo.description}</p>

//             <div className="space-y-2 text-sm text-slate-500 mt-4">
//               <div className="flex items-center justify-center md:justify-start">
//                 <MapPinIcon className="w-4 h-4 text-gray-500 mr-2" />
//                 <span>{storeInfo.address}</span>
//               </div>
//               <div className="flex items-center justify-center md:justify-start">
//                 <MailIcon className="w-4 h-4 text-gray-500 mr-2" />
//                 <span>{storeInfo.email}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto mb-40">
//         <h1 className="text-2xl mt-12">
//           Shop <span className="text-slate-800 font-medium">Products</span>
//         </h1>

//         {products.length === 0 ? (
//           <div className="mt-5 bg-white border border-slate-200 rounded-xl p-8 text-slate-500">
//             No products available for this store.
//           </div>
//         ) : (
//           <div className="mt-5 grid grid-cols-2 sm:flex sm:flex-wrap gap-6 xl:gap-12 mx-auto">
//             {products.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }