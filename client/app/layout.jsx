import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "CharisAtelier: Where Artistry and Timeless Craft Converge",
    description: "CharisAtelier: Where Artistry and Timeless Craft Converge",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
            </head>
            <body className={`${outfit.className} antialiased bg-[#fffdfa] text-stone-900`}>
                <StoreProvider>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 2500,
                            style: {
                                borderRadius: "14px",
                                background: "rgba(255,250,245,0.95)",
                                color: "#2d241c",
                                border: "1px solid #efe6dc",
                                boxShadow: "0 12px 30px rgba(91,68,46,0.10)",
                                backdropFilter: "blur(8px)",
                            },
                        }}
                    />
                    {children}
                </StoreProvider>
            </body>
        </html>
    );
}