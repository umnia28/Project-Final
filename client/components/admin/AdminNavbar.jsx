'use client'
import Link from "next/link"

const AdminNavbar = () => {

    return (
        <div className="flex items-center justify-between px-12 py-3 border-b border-[#e5dfec] bg-white/70 backdrop-blur-md transition-all">
            
            <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                
                {/* Logo */}
                <span className="font-serif text-5xl bg-gradient-to-r from-[#d8c3a5] via-[#a78bdb] to-[#7fb6ea] bg-clip-text text-transparent">
                    Charis
                </span>
                <span className="font-serif text-3xl ml-1 text-slate-700">
                    Atelier
                </span>  

                {/* Admin Badge */}
                <p className="absolute -top-1 -right-14 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#a78bdb] to-[#7fb6ea] px-3 py-0.5 text-xs font-semibold text-white shadow-sm">
                    Admin
                </p>
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-3 text-slate-600">
                <p className="font-medium">Hi, Admin</p>
            </div>
        </div>
    )
}

export default AdminNavbar


// 'use client'
// import Link from "next/link"

// const AdminNavbar = () => {


//     return (
//         <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
//             <Link href="/" className="relative text-4xl font-semibold text-slate-700">
//                 <span className="font-serif text-orange-600 text-5xl">Charis</span>
//                 <span className="font-serif text-pink-700 text-3xl">Atelier</span>  
//                 <p className="absolute text-xs font-semibold -top-1 -right-13 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-purple-800">
//                     Admin
//                 </p>
//             </Link>
//             <div className="flex items-center gap-3">
//                 <p>Hi, Admin</p>
//             </div>
//         </div>
//     )
// }

// export default AdminNavbar