'use client'
import { assets } from "@/assets/assets"
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"

export default function CreateStore() {

    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const [storeInfo, setStoreInfo] = useState({
        name: "",
        username: "",
        description: "",
        email: "",
        contact: "",
        address: "",
        image: ""
    })

    const onChangeHandler = (e) => {
        setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
    }

    const fetchSellerStatus = async () => {
        setLoading(false)
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
    }

    useEffect(() => {
        fetchSellerStatus()
    }, [])

    return !loading ? (
        <>
            {!alreadySubmitted ? (
                <div className="relative mx-6 my-16 min-h-[70vh] overflow-hidden">

                    {/* Background */}
                    <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#f7f1e8] via-[#f7f5fb] to-[#eef6ff]" />
                    <div className="absolute -top-24 -left-24 -z-10 h-80 w-80 rounded-full bg-[#e6d8c3]/30 blur-3xl" />
                    <div className="absolute top-32 right-0 -z-10 h-96 w-96 rounded-full bg-[#d7c4ef]/25 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 -z-10 h-80 w-80 rounded-full bg-[#bfdaf6]/25 blur-3xl" />

                    <form
                        onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Submitting data..." })}
                        className="max-w-4xl mx-auto flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-[0_20px_60px_rgba(167,139,219,0.10)] backdrop-blur-xl text-slate-600"
                    >
                        {/* Title */}
                        <div>
                            <h1 className="text-3xl font-semibold">
                                Add Your{" "}
                                <span className="bg-gradient-to-r from-[#7fb6ea] via-[#a78bdb] to-[#d8c3a5] bg-clip-text text-transparent">
                                    Store
                                </span>
                            </h1>
                            <p className="max-w-lg mt-2 text-slate-500">
                                To become a seller on GoCart, submit your store details for review.
                                Your store will be activated after admin verification.
                            </p>
                        </div>

                        {/* Logo */}
                        <label className="mt-8 cursor-pointer">
                            <p className="text-sm font-medium text-slate-500">Store Logo</p>
                            <div className="mt-2 inline-block rounded-xl border border-[#e5dfec] bg-gradient-to-br from-[#fffdf9] via-[#f5f0fb] to-[#eef6ff] p-2 shadow-sm">
                                <Image
                                    src={storeInfo.image ? URL.createObjectURL(storeInfo.image) : assets.upload_area}
                                    className="rounded-lg h-16 w-auto object-contain"
                                    alt=""
                                    width={150}
                                    height={100}
                                />
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })}
                                hidden
                            />
                        </label>

                        {/* Inputs */}
                        <div className="grid gap-4">

                            <div>
                                <p className="text-sm text-slate-500 mb-1">Username</p>
                                <input
                                    name="username"
                                    onChange={onChangeHandler}
                                    value={storeInfo.username}
                                    placeholder="Enter your store username"
                                    className="w-full max-w-lg rounded-xl border border-[#e5dfec] bg-white/80 px-4 py-3 text-sm outline-none shadow-sm focus:border-[#a78bdb] focus:ring-2 focus:ring-[#e7ddf7]"
                                />
                            </div>

                            <div>
                                <p className="text-sm text-slate-500 mb-1">Name</p>
                                <input
                                    name="name"
                                    onChange={onChangeHandler}
                                    value={storeInfo.name}
                                    placeholder="Enter your store name"
                                    className="w-full max-w-lg rounded-xl border border-[#e5dfec] bg-white/80 px-4 py-3 text-sm outline-none shadow-sm focus:border-[#7fb6ea] focus:ring-2 focus:ring-[#dfeffc]"
                                />
                            </div>

                            <div>
                                <p className="text-sm text-slate-500 mb-1">Description</p>
                                <textarea
                                    name="description"
                                    onChange={onChangeHandler}
                                    value={storeInfo.description}
                                    rows={5}
                                    placeholder="Enter your store description"
                                    className="w-full max-w-lg rounded-xl border border-[#e5dfec] bg-white/80 px-4 py-3 text-sm outline-none shadow-sm resize-none focus:border-[#d8c3a5] focus:ring-2 focus:ring-[#f2e8d8]"
                                />
                            </div>

                            <div>
                                <p className="text-sm text-slate-500 mb-1">Email</p>
                                <input
                                    name="email"
                                    onChange={onChangeHandler}
                                    value={storeInfo.email}
                                    type="email"
                                    placeholder="Enter your store email"
                                    className="w-full max-w-lg rounded-xl border border-[#e5dfec] bg-white/80 px-4 py-3 text-sm outline-none shadow-sm focus:border-[#a78bdb] focus:ring-2 focus:ring-[#e7ddf7]"
                                />
                            </div>

                            <div>
                                <p className="text-sm text-slate-500 mb-1">Contact Number</p>
                                <input
                                    name="contact"
                                    onChange={onChangeHandler}
                                    value={storeInfo.contact}
                                    placeholder="Enter your store contact number"
                                    className="w-full max-w-lg rounded-xl border border-[#e5dfec] bg-white/80 px-4 py-3 text-sm outline-none shadow-sm focus:border-[#7fb6ea] focus:ring-2 focus:ring-[#dfeffc]"
                                />
                            </div>

                            <div>
                                <p className="text-sm text-slate-500 mb-1">Address</p>
                                <textarea
                                    name="address"
                                    onChange={onChangeHandler}
                                    value={storeInfo.address}
                                    rows={5}
                                    placeholder="Enter your store address"
                                    className="w-full max-w-lg rounded-xl border border-[#e5dfec] bg-white/80 px-4 py-3 text-sm outline-none shadow-sm resize-none focus:border-[#d8c3a5] focus:ring-2 focus:ring-[#f2e8d8]"
                                />
                            </div>
                        </div>

                        {/* Button */}
                        <button className="mt-8 w-fit rounded-full bg-gradient-to-r from-[#d8c3a5] via-[#a78bdb] to-[#7fb6ea] px-10 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(167,139,219,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(127,182,234,0.28)] active:scale-95">
                            Submit
                        </button>
                    </form>
                </div>
            ) : (
                <div className="min-h-[80vh] flex flex-col items-center justify-center">
                    <p className="text-center max-w-2xl text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-500">
                        {message}
                    </p>
                    {status === "approved" && (
                        <p className="mt-5 text-slate-400">
                            redirecting to dashboard in <span className="font-semibold">5 seconds</span>
                        </p>
                    )}
                </div>
            )}
        </>
    ) : (<Loading />)
}


// 'use client'
// import { assets } from "@/assets/assets"
// import { useEffect, useState } from "react"
// import Image from "next/image"
// import toast from "react-hot-toast"
// import Loading from "@/components/Loading"

// export default function CreateStore() {

//     const [alreadySubmitted, setAlreadySubmitted] = useState(false)
//     const [status, setStatus] = useState("")
//     const [loading, setLoading] = useState(true)
//     const [message, setMessage] = useState("")

//     const [storeInfo, setStoreInfo] = useState({
//         name: "",
//         username: "",
//         description: "",
//         email: "",
//         contact: "",
//         address: "",
//         image: ""
//     })

//     const onChangeHandler = (e) => {
//         setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
//     }

//     const fetchSellerStatus = async () => {
//         // Logic to check if the store is already submitted


//         setLoading(false)
//     }

//     const onSubmitHandler = async (e) => {
//         e.preventDefault()
//         // Logic to submit the store details


//     }

//     useEffect(() => {
//         fetchSellerStatus()
//     }, [])

//     return !loading ? (
//         <>
//             {!alreadySubmitted ? (
//                 <div className="mx-6 min-h-[70vh] my-16">
//                     <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Submitting data..." })} className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500">
//                         {/* Title */}
//                         <div>
//                             <h1 className="text-3xl ">Add Your <span className="text-slate-800 font-medium">Store</span></h1>
//                             <p className="max-w-lg">To become a seller on GoCart, submit your store details for review. Your store will be activated after admin verification.</p>
//                         </div>

//                         <label className="mt-10 cursor-pointer">
//                             Store Logo
//                             <Image src={storeInfo.image ? URL.createObjectURL(storeInfo.image) : assets.upload_area} className="rounded-lg mt-2 h-16 w-auto" alt="" width={150} height={100} />
//                             <input type="file" accept="image/*" onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })} hidden />
//                         </label>

//                         <p>Username</p>
//                         <input name="username" onChange={onChangeHandler} value={storeInfo.username} type="text" placeholder="Enter your store username" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

//                         <p>Name</p>
//                         <input name="name" onChange={onChangeHandler} value={storeInfo.name} type="text" placeholder="Enter your store name" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

//                         <p>Description</p>
//                         <textarea name="description" onChange={onChangeHandler} value={storeInfo.description} rows={5} placeholder="Enter your store description" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none" />

//                         <p>Email</p>
//                         <input name="email" onChange={onChangeHandler} value={storeInfo.email} type="email" placeholder="Enter your store email" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

//                         <p>Contact Number</p>
//                         <input name="contact" onChange={onChangeHandler} value={storeInfo.contact} type="text" placeholder="Enter your store contact number" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

//                         <p>Address</p>
//                         <textarea name="address" onChange={onChangeHandler} value={storeInfo.address} rows={5} placeholder="Enter your store address" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none" />

//                         <button className="bg-slate-800 text-white px-12 py-2 rounded mt-10 mb-40 active:scale-95 hover:bg-slate-900 transition ">Submit</button>
//                     </form>
//                 </div>
//             ) : (
//                 <div className="min-h-[80vh] flex flex-col items-center justify-center">
//                     <p className="sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-500 text-center max-w-2xl">{message}</p>
//                     {status === "approved" && <p className="mt-5 text-slate-400">redirecting to dashboard in <span className="font-semibold">5 seconds</span></p>}
//                 </div>
//             )}
//         </>
//     ) : (<Loading />)
// }