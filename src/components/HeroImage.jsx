// src/components/HeroImage.jsx (Final Corrected Version)

"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

export default function HeroImage() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.2,
                duration: 0.6,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
        <section ref={ref} className="relative h-screen overflow-hidden text-white">
            {/* Background Image with Parallax */}
            <motion.div className="absolute inset-0 z-[-1]" style={{ y }}>
                <Image
                    src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1280&q=70&auto=format&fit=crop"
                    alt="Fashion background"
                    fill
                    priority
                    className="object-cover"
                    // ★★★ THIS IS THE REAL FIX: Turn off Next.js optimization for this image ★★★
                    unoptimized={true} 
                />
            </motion.div>

            {/* Overlay with Shine Effect */}
            <div className="absolute inset-0 bg-gray-900/60 shine-overlay"></div>

            {/* Content */}
            <div className="relative z-10 flex h-full items-center justify-start">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="max-w-xl"
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.h1
                            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
                            variants={itemVariants}
                        >
                            Elegance in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Simplicity</span>.
                        </motion.h1>

                        <motion.p
                            className="mt-6 text-lg sm:text-xl text-gray-200"
                            variants={itemVariants}
                        >
                            Discover timeless pieces and modern essentials. Quality craftsmanship and impeccable design, delivered to your door.
                        </motion.p>

                        <motion.div className="mt-10" variants={itemVariants}>
                            <Link
                                href="/products"
                                className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-8 py-4 text-base font-bold shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-indigo-500/40 transform hover:-translate-y-1"
                            >
                                <ShoppingBag className="transition-transform duration-300 group-hover:rotate-[-12deg]" />
                                Explore Collection
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}