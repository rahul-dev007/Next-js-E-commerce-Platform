"use client"; // usePathname ব্যবহার করার জন্য এটি আবশ্যক

import { Inter } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation'; // ★★★ usePathname ইম্পোর্ট করা হয়েছে ★★★

import "./globals.css";

import AuthProvider from "../components/AuthProvider";
import StoreProvider from "../components/StoreProvider";
import ReactQueryProvider from "../components/ReactQueryProvider";
import Navbar from "../components/Navbar";
import Footer from '../components/layout/Footer'; 

const inter = Inter({ subsets: ["latin"] });

// "use client" ব্যবহার করার কারণে, metadata এখানে স্ট্যাটিক ভাবে কাজ করবে না।
// এটি এখন প্রতিটি পেজের page.js/tsx ফাইলে export করতে হবে।
// export const metadata = { ... };

export default function RootLayout({ children }) {
  // ★★★ বর্তমান রুটের পাথ নেওয়া হচ্ছে ★★★
  const pathname = usePathname();
  // ★★★ চেক করা হচ্ছে যে বর্তমান পেজটি অ্যাডমিন প্যানেলের অংশ কিনা ★★★
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <ReactQueryProvider>
          <StoreProvider>
            <AuthProvider>
              <Toaster
                position="top-center"
                toastOptions={{
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                }}
              />
              
              {/* ★★★ শর্তসাপেক্ষে Navbar দেখানো হচ্ছে ★★★ */}
              {/* যদি অ্যাডমিন রুট না হয়, তবেই Navbar দেখাও */}
              {!isAdminRoute && <Navbar />}
              
              {/* ★★★ শর্তসাপেক্ষে main ট্যাগের স্টাইল পরিবর্তন ★★★ */}
              {/* অ্যাডমিন রুটের জন্য কোনো কন্টেইনার বা প্যাডিং দরকার নেই, কারণ AdminLayout নিজেই তা হ্যান্ডেল করবে */}
              <main className={!isAdminRoute ? "container mx-auto px-4 py-8" : ""}>
                {children}
              </main>
              <Footer />

            </AuthProvider>
          </StoreProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}