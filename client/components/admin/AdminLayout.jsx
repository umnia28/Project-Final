'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"

const AdminLayout = ({ children }) => {

    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchIsAdmin = async () => {
        setIsAdmin(true)
        setLoading(false)
    }

    useEffect(() => {
        fetchIsAdmin()
    }, [])

    return loading ? (
        <Loading />
    ) : isAdmin ? (
        <div className="flex h-screen flex-col bg-[linear-gradient(180deg,#fcfaf6_0%,#f7f4fb_45%,#f1f8ff_100%)]">
            <AdminNavbar />
            <div className="flex h-full flex-1 items-start overflow-y-scroll no-scrollbar">
                <AdminSidebar />
                <div className="flex-1 h-full overflow-y-scroll p-5 lg:pl-12 lg:pt-12">
                    {children}
                </div>
            </div>
        </div>
    ) : (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
            <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#f7f1e8] via-[#f7f5fb] to-[#eef6ff]" />
            <div className="absolute -top-24 -left-24 -z-10 h-80 w-80 rounded-full bg-[#e6d8c3]/30 blur-3xl" />
            <div className="absolute top-32 right-0 -z-10 h-96 w-96 rounded-full bg-[#d7c4ef]/25 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 -z-10 h-80 w-80 rounded-full bg-[#bfdaf6]/25 blur-3xl" />

            <div className="rounded-[2rem] border border-white/60 bg-white/70 px-8 py-12 shadow-[0_20px_70px_rgba(167,139,219,0.08)] backdrop-blur-xl">
                <h1 className="text-2xl font-semibold text-slate-500 sm:text-4xl">
                    You are not authorized to access this page
                </h1>

                <Link
                    href="/"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d8c3a5] via-[#a78bdb] to-[#7fb6ea] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(167,139,219,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(127,182,234,0.26)] max-sm:text-sm"
                >
                    Go to home <ArrowRightIcon size={18} />
                </Link>
            </div>
        </div>
    )
}

export default AdminLayout

// 'use client'
// import { useEffect, useState } from "react"
// import Loading from "../Loading"
// import Link from "next/link"
// import { ArrowRightIcon } from "lucide-react"
// import AdminNavbar from "./AdminNavbar"
// import AdminSidebar from "./AdminSidebar"

// const AdminLayout = ({ children }) => {

//     const [isAdmin, setIsAdmin] = useState(false)
//     const [loading, setLoading] = useState(true)

//     const fetchIsAdmin = async () => {
//         setIsAdmin(true)
//         setLoading(false)
//     }

//     useEffect(() => {
//         fetchIsAdmin()
//     }, [])

//     return loading ? (
//         <Loading />
//     ) : isAdmin ? (
//         <div className="flex flex-col h-screen">
//             <AdminNavbar />
//             <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
//                 <AdminSidebar />
//                 <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
//                     {children}
//                 </div>
//             </div>
//         </div>
//     ) : (
//         <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
//             <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">You are not authorized to access this page</h1>
//             <Link href="/" className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full">
//                 Go to home <ArrowRightIcon size={18} />
//             </Link>
//         </div>
//     )
// }

// export default AdminLayout