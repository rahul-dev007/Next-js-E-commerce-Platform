"use client";

import { useEffect, useState } from 'react';
import Link from "next/link";
// ★★★ আসল সমাধান এখানে: ArrowRight আইকনটি ইম্পোর্ট করা হয়েছে ★★★
import { ArrowRight } from 'lucide-react'; 
import { useGetProductsQuery } from "../store/api/apiSlice";
import ShopProductCard from "../components/ShopProductCard";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// দুটি নতুন Hero কম্পোনেন্ট এবং অন্যান্য সেকশন কম্পোনেন্ট ইম্পোর্ট করা হচ্ছে
import HeroVideo from '../components/HeroVideo';
import HeroImage from '../components/HeroImage';
import CategoryExplorer from "../components/CategoryExplorer";
import TestimonialSlider from "../components/TestimonialSlider";
import SeasonalOffer from "../components/SeasonalOffer";
import FeatureSlider from "../components/FeatureSlider";

// ★★★ FeaturedProducts কম্পোনেন্ট তৈরি করা হচ্ছে ★★★
function FeaturedProducts() {
    const { data, isLoading, error } = useGetProductsQuery({ page: 1 });
    
    // মার্কির জন্য আমরা ৬টি প্রোডাক্ট নিচ্ছি
    const products = data?.products?.slice(0, 10) || [];
    
    // অসীম এবং মসৃণ স্ক্রলিংয়ের অনুভূতি তৈরি করার জন্য আমরা তালিকাটিকে ডুপ্লিকেট করছি
    // যদি ৬টির কম প্রোডাক্ট থাকে, তাহলে তালিকাটি কয়েকবার ডুপ্লিকেট করা হবে
    const MIN_PRODUCTS_FOR_MARQUEE = 12;
    let marqueeProducts = [];
    if (products.length > 0) {
        while (marqueeProducts.length < MIN_PRODUCTS_FOR_MARQUEE) {
            marqueeProducts = [...marqueeProducts, ...products];
        }
    }

    // ডেটা লোড হওয়ার সময় একটি সুন্দর স্কেলেটন লোডার দেখানো হচ্ছে
    if (isLoading) {
        return (
            <div className="flex gap-8 overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-80 flex-shrink-0">
                        <Skeleton height={420} /> {/* কার্ডের নতুন উচ্চতা অনুযায়ী */}
                    </div>
                ))}
            </div>
        );
    }

    // যদি কোনো এরর হয় বা কোনো প্রোডাক্ট না থাকে
    if (error || products.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-lg text-red-500">Could not load featured products at the moment.</p>
                <p className="text-gray-500 mt-2">Please check back later.</p>
            </div>
        );
    }

    // ★★★ চূড়ান্ত মার্কি (Marquee) লেআউট ★★★
    return (
        // [mask-image] ব্যবহার করে দুই পাশে একটি সুন্দর ফেড-আউট এফেক্ট তৈরি করা হয়েছে
        <div className="w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            
            {/* 
              'hover:[animation-play-state:paused]'
              এই Tailwind ক্লাসটি বলছে: যখন এই div-টির উপর মাউস হোভার করা হবে,
              তখন এর ভিতরে চলা 'animate-marquee' অ্যানিমেশনটি থামিয়ে দাও।
            */}
            <div className="flex animate-marquee hover:[animation-play-state:paused]">
                
                {marqueeProducts.map((product, index) => (
                    <div 
                        key={`${product._id}-${index}`} 
                        className="w-80 flex-shrink-0 mx-4 transition-transform duration-300 hover:scale-105"
                    >
                        {/* প্রতিটি প্রোডাক্টের জন্য ShopProductCard রেন্ডার করা হচ্ছে */}
                        <ShopProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}
// ★★★ এবং `#featured` <section> ট্যাগটিও আপডেট করো ★★★
<section id="featured">
    <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            This Season's Highlights
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Discover the products everyone is talking about. Curated for you.
        </p>
    </div>
    <FeaturedProducts />
    <div className="text-center mt-16">
        <Link 
            href="/products" 
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 text-white px-8 py-4 text-base font-bold shadow-lg transition-all duration-300 ease-in-out hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-500/30 transform hover:-translate-y-1"
        >
            Explore All Products 
            <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
    </div>
</section>
// ===================================
// ===== HomePage Component (Main) =====
// ===================================
export default function HomePage() {
    const [heroVariant, setHeroVariant] = useState(null);

    useEffect(() => {
        const variant = Math.random() < 0.5 ? 'video' : 'image';
        setHeroVariant(variant);
    }, []);

    const renderHeroSection = () => {
        if (!heroVariant) {
            return <div className="h-[60vh] sm:h-[80vh] w-full bg-gray-900 animate-pulse"></div>;
        }
        return heroVariant === 'video' ? <HeroVideo /> : <HeroImage />;
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            {renderHeroSection()}

            <main className="container mx-auto px-4 py-16 sm:py-24 space-y-24">
                <section id="featured">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                            This Season's Highlights
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                            Discover the products everyone is talking about. Curated for you.
                        </p>
                    </div>
                    <FeaturedProducts />
                    <div className="text-center mt-16">
                        <Link
                            href="/products"
                            className="group inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 text-white px-8 py-4 text-base font-bold shadow-lg transition-all duration-300 ease-in-out hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-500/30 transform hover:-translate-y-1"
                        >
                            Explore All Products
                            <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </section>

                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Explore Our Categories</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">Find what you love from our diverse collections.</p>
                    </div>
                    <CategoryExplorer />
                </section>

                <section>
                    <SeasonalOffer />
                </section>

                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">What Our Customers Say</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">We are trusted by thousands of happy customers.</p>
                    </div>
                    <TestimonialSlider />
                </section>

                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Why Sell With Us?</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">Unlock your potential and grow your brand on our platform.</p>
                    </div>
                    <FeatureSlider />
                </section>
            </main>
        </div>
    );
}