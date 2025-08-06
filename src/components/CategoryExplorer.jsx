import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categories = [
    { 
        name: 'New Arrivals', 
        tagline: 'Fresh & Trendy',
        href: '/products?category=fashion', 
        img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        gridSpan: 'lg:col-span-2' // এই কার্ডটি দুটি কলাম জুড়ে থাকবে
    },
    { 
        name: 'Gadget Zone', 
        tagline: 'Future is Here',
        href: '/products?category=electronics', 
        img: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
        gridSpan: 'lg:col-span-1'
    },
    { 
        name: 'Home Decor', 
        tagline: 'Your Perfect Space',
        href: '/products?category=furniture', 
        img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        gridSpan: 'lg:col-span-1'
    },
    { 
        name: 'Summer Sale', 
        tagline: 'Up to 50% Off',
        href: '/products?sale=true', 
        img: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        gridSpan: 'lg:col-span-2' // এই কার্ডটি দুটি কলাম জুড়ে থাকবে
    },
];

export default function CategoryExplorer() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* প্রথম দুটি কার্ড */}
            <div className="relative group block h-96 rounded-2xl overflow-hidden shadow-lg">
                <CardContent category={categories[0]} />
            </div>
            <div className="grid grid-rows-2 gap-6">
                <div className="relative group block h-full rounded-2xl overflow-hidden shadow-lg">
                    <CardContent category={categories[1]} />
                </div>
                <div className="relative group block h-full rounded-2xl overflow-hidden shadow-lg">
                    <CardContent category={categories[2]} />
                </div>
            </div>
            
            {/* শেষ কার্ড (পূর্ণ প্রস্থ জুড়ে) */}
            <div className="relative group block h-80 rounded-2xl overflow-hidden shadow-lg lg:col-span-2">
                 <CardContent category={categories[3]} />
            </div>
        </div>
    );
}

// কার্ডের ভেতরের ডিজাইনকে একটি আলাদা কম্পোনেন্টে ভাগ করা হয়েছে
const CardContent = ({ category }) => (
    <>
        {/* Background Image with Hover Effect */}
        <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
            style={{ backgroundImage: `url(${category.img})` }}
        />
        {/* Overlay with Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-all duration-300 group-hover:from-black/80" />
        
        {/* Content */}
        <div className="relative flex flex-col justify-end h-full text-white p-8">
            <p className="text-lg font-medium text-sky-300">{category.tagline}</p>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">{category.name}</h3>
            
            {/* ★★★ আকর্ষণীয় "Shop Now" বাটন যা হোভার করলে দেখা যাবে ★★★ */}
            <Link 
                href={category.href} 
                className="inline-flex items-center gap-2 mt-4 text-white font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-in-out"
            >
                Explore Collection <ArrowRight size={20} />
            </Link>
        </div>
    </>
);