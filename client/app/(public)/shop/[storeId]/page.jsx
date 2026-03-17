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
      if (!storeId) {
        throw new Error("Invalid store id")
      }

      setLoading(true)
      setError("")

      const res = await fetch(`${API}/api/public/stores/id/${storeId}`)

      const contentType = res.headers.get("content-type") || ""

      if (!contentType.includes("application/json")) {
        const text = await res.text()
        console.error("Non-JSON response:", text)
        throw new Error("Server returned invalid response. Check backend route.")
      }

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to load store")
      }

      const store = data.store || null

      if (!store) {
        throw new Error("Store not found")
      }

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
      console.error("Store fetch error:", err)
      setError(err.message || "Could not load store")
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
      <div className="min-h-[70vh] mx-6 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <StoreIcon className="w-10 h-10 mx-auto text-slate-400 mb-3" />
          <h1 className="text-2xl font-semibold text-slate-800">Store not found</h1>
          <p className="text-slate-500 mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] mx-6">
      {storeInfo && (
        <div className="max-w-7xl mx-auto bg-slate-50 rounded-xl p-6 md:p-10 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-xs border border-slate-200">
          <Image
            src={storeInfo.logo}
            alt={storeInfo.name}
            className="size-32 sm:size-38 object-cover border-2 border-slate-100 rounded-md"
            width={200}
            height={200}
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-semibold text-slate-800">{storeInfo.name}</h1>
            <p className="text-sm text-slate-600 mt-2 max-w-lg">{storeInfo.description}</p>

            <div className="space-y-2 text-sm text-slate-500 mt-4">
              <div className="flex items-center justify-center md:justify-start">
                <MapPinIcon className="w-4 h-4 text-gray-500 mr-2" />
                <span>{storeInfo.address}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <MailIcon className="w-4 h-4 text-gray-500 mr-2" />
                <span>{storeInfo.email}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto mb-40">
        <h1 className="text-2xl mt-12">
          Shop <span className="text-slate-800 font-medium">Products</span>
        </h1>

        {products.length === 0 ? (
          <div className="mt-5 bg-white border border-slate-200 rounded-xl p-8 text-slate-500">
            No products available for this store.
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 sm:flex sm:flex-wrap gap-6 xl:gap-12 mx-auto">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}