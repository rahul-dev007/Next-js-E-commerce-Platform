// src/app/admin/products/page.js

"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSession } from 'next-auth/react';
import { Edit, Trash2, PlusCircle, Search, Inbox } from "lucide-react";

import { useGetProductsQuery, useDeleteProductMutation } from "../../../store/api/apiSlice";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import TableSkeleton from "../../../components/common/TableSkeleton";

// পেজিনেশন UI কম্পোনেন্ট (অপরিবর্তিত)
function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;
    return (
        <div className="mt-8 flex items-center justify-center space-x-2 sm:space-x-4">
            <button
                onClick={() => onPage - change(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg bg-indigo-600 px-3 sm:px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600"
            >
                Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg bg-indigo-600 px-3 sm:px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-600"
            >
                Next
            </button>
        </div>
    );
}

// মূল পেজ কম্পোনেন্ট
export default function AdminProductsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { data: session } = useSession();

    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';

    const [searchTerm, setSearchTerm] = useState(search);
    const [productToDelete, setProductToDelete] = useState(null);

    const userScope = session?.user?.role === 'superadmin' ? '' : 'me';
    const { data: response, isLoading, isFetching, error } = useGetProductsQuery({ page, search, scope: userScope });

    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

    // ==========================================================
    // ===== ★★★ আসল সমাধানটি এখানে (THIS IS THE REAL FIX) ★★★ =====
    // ==========================================================
    // এখন response থেকে সরাসরি products এবং pagination পাওয়া যাবে
    const products = response?.products;
    const pagination = response?.pagination;
    // ==========================================================

    const userRole = session?.user?.role;

    const handleUrlChange = (newParams) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value) params.set(key, value.toString());
            else params.delete(key);
        });
        router.push(`${pathname}?${params.toString()}`);
    };
    const handleSearchSubmit = (e) => { e.preventDefault(); handleUrlChange({ search: searchTerm, page: 1 }); };
    const handlePageChange = (newPage) => { handleUrlChange({ page: newPage }); };
    const openDeleteModal = (product) => { setProductToDelete(product); };

    const handleDelete = async () => {
        if (!productToDelete) return;
        const toastId = toast.loading("Deleting product...");
        try {
            await deleteProduct(productToDelete._id).unwrap();
            toast.success(`Product "${productToDelete.name}" deleted successfully!`, { id: toastId });
            setProductToDelete(null);
        } catch (err) {
            toast.error(err?.data?.message || "Failed to delete product.", { id: toastId });
        }
    };

    const renderContent = () => {
        if (isLoading || isFetching) {
            return <TableSkeleton rowCount={5} colCount={userRole === 'superadmin' ? 6 : 5} />;
        }
        if (error) {
            return (
                <div className="text-center py-16 text-red-500">
                    <h3 className="text-2xl font-semibold">Error Loading Products</h3>
                    <p>Something went wrong. Please try again later.</p>
                </div>
            );
        }
        if (products && products.length > 0) {
            return (
                <>
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                                    {userRole === 'superadmin' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Created By</th>}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Category</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4">
                                            <div className="relative h-16 w-16">
                                                <Image src={product.imageUrl} alt={product.name} fill className="object-cover rounded-md" unoptimized />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{product.name}</td>
                                        {userRole === 'superadmin' && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.createdBy ? product.createdBy.name : 'N/A'}</td>}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${product.price?.toFixed(2) || '0.00'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                            <Link href={`/products/edit/${product._id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200" title="Edit"><Edit className="inline h-5 w-5" /></Link>
                                            <button onClick={() => openDeleteModal(product)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200" title="Delete"><Trash2 className="inline h-5 w-5" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* মোবাইল ভিউ: কার্ড */}
                    <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {products.map((product) => (
                            <div key={product._id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3 shadow">
                                <div className="flex items-center gap-4">
                                    <div className="relative h-16 w-16 flex-shrink-0">
                                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover rounded-md" unoptimized />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{product.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                                    </div>
                                </div>
                                {userRole === 'superadmin' && <p className="text-sm text-gray-600 dark:text-gray-300"><strong>By:</strong> {product.createdBy ? product.createdBy.name : 'N/A'}</p>}
                                <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">${product.price?.toFixed(2) || '0.00'}</p>
                                    <div className="flex gap-4">
                                        <Link href={`/products/edit/${product._id}`} className="text-indigo-500 p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-gray-600"><Edit size={20} /></Link>
                                        <button onClick={() => openDeleteModal(product)} className="text-red-500 p-2 rounded-full hover:bg-red-100 dark:hover:bg-gray-600"><Trash2 size={20} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {pagination && <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />}
                </>
            );
        }
        return (
            <div className="text-center py-16">
                <Inbox className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">No Products Found</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">There are no products yet. Start by adding a new one!</p>
                <Link href="/products/add" className="mt-6 inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700">
                    <PlusCircle size={20} /> Add Your First Product
                </Link>
            </div>
        );
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Product Management</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all products in your inventory.</p>
                    </div>
                    <div className="flex w-full sm:w-auto items-center gap-2">
                        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-auto">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search products..."
                                className="w-full rounded-lg border-gray-300 py-2 pl-4 pr-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <Search className="h-5 w-5 text-gray-400" />
                            </button>
                        </form>
                        <Link href="/products/add" className="flex-shrink-0 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                            <PlusCircle size={20} />
                            <span className="hidden sm:inline">Add Product</span>
                        </Link>
                    </div>
                </div>
                {renderContent()}
            </div>
            <ConfirmationModal
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={handleDelete}
                title="Delete Product"
                message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                isLoading={isDeleting}
            />
        </>
    );
}