// src/components/HeroVideo.jsx

import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function HeroVideo() {
    return (
        <section className="relative h-[60vh] sm:h-[80vh] w-full flex items-center justify-center text-white overflow-hidden">
            {/* Video Background */}
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    src="https://cdn.pixabay.com/video/2021/09/20/89359-623838221_large.mp4"
                />
            </div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10" />
            {/* Content with Animation */}
            <div className="container mx-auto px-4 text-center relative z-20 animate-fade-in-up">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-shadow-lg">
                    Find Your <span className="text-sky-400">Extraordinary</span>
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-sky-100/90 text-shadow">
                    Step into a world of curated collections where quality meets innovation. Your next favorite thing is just a click away.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link
                        href="/products"
                        className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-gray-900 px-8 py-4 text-lg font-bold shadow-lg transition-all duration-300 ease-in-out hover:bg-sky-400 hover:text-white hover:shadow-2xl hover:shadow-sky-500/30 transform hover:-translate-y-1"
                    >
                        <ShoppingBag className="transition-transform duration-300 group-hover:rotate-[-12deg]" />
                        Start Shopping
                    </Link>
                    <Link
                        href="#featured"
                        className="group inline-flex items-center gap-2 text-white font-semibold transition-colors hover:text-sky-300"
                    >
                        Explore More
                        <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}