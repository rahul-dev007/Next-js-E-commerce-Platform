// src/app/payment-success/page.js

"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { cartActions } from '../../store/cartSlice';

export default function PaymentSuccessPage() {
    const dispatch = useDispatch();

    // ★★★ পেমেন্ট সফল হওয়ার পর Cart খালি করে দেওয়া হচ্ছে ★★★
    useEffect(() => {
        // এই পেজে আসার সাথে সাথেই Cart-এর আইটেমগুলো মুছে ফেলা হবে
        // এবং localStorage থেকেও মুছে যাবে
        dispatch(cartActions.deleteItem(null)); // একটি বিশেষ অ্যাকশন যা সব আইটেম ডিলিট করবে
    }, [dispatch]);

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-2xl shadow-2xl text-center max-w-lg mx-4">
                <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
                <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Payment Successful!</h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    Thank you for your purchase. Your order is being processed and you will receive a confirmation email shortly.
                </p>
                <div className="mt-8">
                    <Link href="/products" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-indigo-700 transition-transform hover:scale-105 shadow-lg">
                        Continue Shopping
                        <ArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
}