"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function ReactQueryProvider({ children }) {
  // QueryClient-এর একটি ইনস্ট্যান্স তৈরি করা হচ্ছে
  // useState ব্যবহার করা হচ্ছে যাতে ক্লায়েন্ট রেন্ডারের সময় এটি শুধু একবারই তৈরি হয়
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}