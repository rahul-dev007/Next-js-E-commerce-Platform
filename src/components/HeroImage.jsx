// src/components/HeroImage.jsx

import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function HeroImage() {
    return (
        <section 
            className="relative bg-cover bg-center bg-no-repeat py-24 sm:py-40 text-gray-800 dark:text-white"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')" }}
        >
            {/* Light Overlay for better readability */}
            <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/60 backdrop-blur-sm"></div>
            
            {/* Content */}
            <div className="container mx-auto px-4 text-left relative z-10 animate-fade-in-up">
                <div className="max-w-xl">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                        Elegance in <span className="text-indigo-600 dark:text-indigo-400">Simplicity</span>.
                    </h1>
                    <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300">
                        Discover timeless pieces and modern essentials. Quality craftsmanship and impeccable design, delivered to your door.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Link
                            href="/products"
                            className="group inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 text-white px-8 py-4 text-lg font-bold shadow-lg transition-all duration-300 ease-in-out hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-500/30 transform hover:-translate-y-1"
                        >
                            <ShoppingBag className="transition-transform duration-300 group-hover:rotate-[-12deg]" />
                            Explore Collection
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}