"use client"; // এটা ক্লায়েন্ট সাইড কম্পোনেন্ট হিসেবে কাজ করবে

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
