// src/app/page.js

"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, LifeBuoy } from "lucide-react";

// ==========================================================
// ===== ★★★ আসল সমাধানটি এখানে (THIS IS THE REAL FIX) ★★★ =====
// ==========================================================
// ★★★ সঠিক পাথ ব্যবহার করা হয়েছে ★★★
import { useGetProductsQuery } from "../store/api/productsApi";
// ==========================================================

import ShopProductCard from "../components/ShopProductCard";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Hero Section Component
function HeroSection() {
    return (
        <section className="relative bg-gradient-to-r from-gray-900 to-sky-900 text-white py-20 sm:py-32 overflow-hidden">
            <div className="container mx-auto px-4 text-center relative z-10">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                    Discover Your Next Favorite Thing
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-sky-200">
                    Explore our curated collection of high-quality products, designed to bring joy and innovation into your life.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-gray-900 px-8 py-4 text-lg font-bold shadow-lg transition-transform hover:scale-105">
                        <ShoppingBag />
                        Shop Now
                    </Link>
                    <Link href="#featured" className="inline-flex items-center gap-2 text-white font-semibold">
                        Explore Features <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}

// Featured Products Section Component
function FeaturedProducts() {
    const { data, isLoading, error } = useGetProductsQuery({ page: 1, limit: 4 });
    const products = data?.products;

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, i) => <div key={i}><Skeleton height={350} /></div>)}
            </div>
        );
    }

    if (error || !products) return <p className="text-center text-red-500">Could not load featured products.</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
                <ShopProductCard key={product._id} product={product} />
            ))}
        </div>
    );
}

// Why Choose Us Section Component
function WhyChooseUs() {
    const features = [
        { icon: Truck, title: "Free Shipping", description: "Enjoy free shipping on all orders above $50." },
        { icon: ShieldCheck, title: "Secure Payments", description: "Your payments are safe with our encrypted checkout." },
        { icon: LifeBuoy, title: "24/7 Support", description: "Our team is here to help you around the clock." }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {features.map(feature => (
                <div key={feature.title} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-indigo-500/10 transition">
                    <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                        <feature.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
            ))}
        </div>
    );
}

// মূল হোম পেজ কম্পোনেন্ট
export default function HomePage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
        <HeroSection />

        <main className="container mx-auto px-4 py-16 sm:py-24 space-y-24">
            <section id="featured">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">Check out our handpicked collection of the best products.</p>
                </div>
                <FeaturedProducts />
                <div className="text-center mt-12">
                    <Link href="/products" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                        View All Products →
                    </Link>
                </div>
            </section>

            <section>
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Why Shop With Us?</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">We are committed to providing you the best shopping experience.</p>
                </div>
                <WhyChooseUs />
            </section>
        </main>
    </div>
  );
}