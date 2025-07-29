// src/components/layout/Footer.jsx
import Link from 'next/link';
import { Store, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-800 dark:bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Branding Section */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white tracking-wider">
                            <Store className="h-7 w-7 text-sky-400" />
                            <span>MyAuthApp</span>
                        </Link>
                        <p className="mt-4 text-sm text-gray-400">
                            Your one-stop shop for discovering amazing products. Quality and customer satisfaction are our top priorities.
                        </p>
                        <div className="mt-6 flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-white transition"><Facebook /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition"><Twitter /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition"><Instagram /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/" className="hover:text-white transition">Home</Link></li>
                            <li><Link href="/products" className="hover:text-white transition">Products</Link></li>
                            <li><Link href="/cart" className="hover:text-white transition">My Cart</Link></li>
                            <li><Link href="/profile" className="hover:text-white transition">My Profile</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white">Support</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                            <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white transition">Shipping & Returns</a></li>
                        </ul>
                    </div>
                    
                    {/* Legal Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white">Legal</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
                    <p>© {new Date().getFullYear()} MyAuthApp. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}