import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar"
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "LMS — Learning Portal",
  description: "Next-gen Learning Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} bg-[#080d1a] h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${inter.className} relative min-h-full flex flex-col antialiased bg-[#080d1a] text-white`}>
        <Toaster position="top-center" reverseOrder={false} />
        
        <div className="absolute z-999 min-w-full">
          <Navbar/>
        </div>
        <main>{children}</main> 
      </body>
    </html>
  );
}