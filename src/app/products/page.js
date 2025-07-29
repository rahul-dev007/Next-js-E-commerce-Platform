// src/app/products/page.js

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetProductsQuery } from "../../store/api/productsApi";
import { useSession } from "next-auth/react";
import { Search, PlusCircle, Inbox } from "lucide-react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// ==========================================================
// ===== ★★★ আসল সমাধানটি এখানে (THIS IS THE REAL FIX) ★★★ =====
// ==========================================================
// ProductCard এর পরিবর্তে ShopProductCard ইম্পোর্ট করা হয়েছে
import ShopProductCard from '../../components/ShopProductCard'; 
// ==========================================================


// Product Card Skeleton Component (অপরিবর্তিত)
function ProductCardSkeleton() {
    return (
        <div className="rounded-xl bg-white shadow-lg dark:bg-gray-800 overflow-hidden">
            <Skeleton height={256} />
            <div className="p-5">
                <Skeleton height={28} width="80%" />
                <Skeleton className="mt-2" width="50%" />
                <div className="mt-4 flex items-center justify-between">
                    <Skeleton height={36} width="40%" />
                    <Skeleton height={42} width="35%" />
                </div>
            </div>
        </div>
    );
}

// Pagination Component (অপরিবর্তiťত)
function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;
    return (
        <div className="mt-12 flex items-center justify-center space-x-4">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600">Previous</button>
            <span className="text-gray-700 dark:text-gray-300">Page {currentPage} of {totalPages}</span>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600">Next</button>
        </div>
    );
}

// মূল পেজ কম্পোনেন্ট
export default function ProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();

    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    
    const [searchTerm, setSearchTerm] = useState(search);
    const { data: response, error, isLoading, isFetching } = useGetProductsQuery({ page, search });
    
    const products = response?.products;
    const pagination = response?.pagination;
    const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'superadmin';

    const updateUrlParams = (newParams) => {
        const currentParams = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value) currentParams.set(key, value.toString());
            else currentParams.delete(key);
        });
        router.push(`/products?${currentParams.toString()}`);
    };

    const handleSearchSubmit = (e) => { e.preventDefault(); updateUrlParams({ search: searchTerm, page: '1' }); };
    const handlePageChange = (newPage) => { updateUrlParams({ page: newPage }); };

    const renderContent = () => {
        if (isLoading || isFetching) {
            return (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
            );
        }
        if (error) {
            return <p className="py-20 text-center text-lg text-red-500">Oops! Failed to load products. Please try again later.</p>;
        }
        if (products && products.length > 0) {
            return (
                <div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {/* ★★★ এখানে নতুন ShopProductCard ব্যবহার করা হয়েছে ★★★ */}
                        {products.map((product) => <ShopProductCard key={product._id} product={product} />)}
                    </div>
                    {pagination && <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />}
                </div>
            );
        }
        return (
            <div className="py-20 text-center">
                <Inbox className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">No Products Found</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">There are no products matching your search. Try a different keyword.</p>
            </div>
        );
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900/50 min-h-screen">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8 flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Explore Our Products</h1>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Find the best products curated for you.</p>
                    </div>
                    <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row">
                        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search products..."
                                className="w-full rounded-lg border-gray-300 py-2.5 pl-4 pr-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
                            />
                            <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <Search className="h-5 w-5 text-gray-400" />
                            </button>
                        </form>
                        {isAdmin && (
                            <Link href="/products/add" className="w-full text-center whitespace-nowrap rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 md:w-auto">Add Product</Link>
                        )}
                    </div>
                </div>
                {renderContent()}
            </div>
        </div>
    );
}