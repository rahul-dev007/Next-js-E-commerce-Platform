// src/app/layout.js

"use client"; 

import { Inter } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';

import "./globals.css";

import AuthProvider from "../components/AuthProvider";
import StoreProvider from "../components/StoreProvider";
import ReactQueryProvider from "../components/ReactQueryProvider";
import Navbar from "../components/Navbar";
import Footer from '../components/layout/Footer';

// ★★★ নতুন: UserProvider ইম্পোর্ট করুন ★★★
import { UserProvider } from "../context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <ReactQueryProvider>
          <StoreProvider>
            <AuthProvider>
              {/* ★★★ নতুন: এখানে UserProvider যোগ করুন ★★★ */}
              <UserProvider>
                <Toaster
                  position="top-center"
                  toastOptions={{
                    style: {
                      background: '#333',
                      color: '#fff',
                    },
                  }}
                />
                
                {!isAdminRoute && <Navbar />}
                
                <main className={!isAdminRoute ? "container mx-auto px-4 py-8" : ""}>
                  {children}
                </main>
                
                <Footer />
              </UserProvider>
            </AuthProvider>
          </StoreProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}