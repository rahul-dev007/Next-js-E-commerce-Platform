// src/components/ShopProductCard.jsx

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageSquare, ShoppingCart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { useLikeProductMutation } from '../store/api/productsApi';
import { cartActions } from '../store/cartSlice';

export default function ShopProductCard({ product }) {
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const [likeProduct, { isLoading: isLiking }] = useLikeProductMutation();

    const isLikedByCurrentUser = product.likes?.includes(session?.user?.id);

    const handleLikeClick = async (e) => {
        e.preventDefault();
        if (!session) {
            // toast.error("Please log in to like."); // toast ব্যবহার করতে চাইলে ইম্পোর্ট করে নেবেন
            return;
        }
        try {
            await likeProduct(product._id).unwrap();
        } catch (err) {
            // toast.error("Failed to like.");
        }
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        dispatch(cartActions.addItem({
            _id: product._id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
        }));
    };

    const imageUrl = product.imageUrl?.startsWith('https://res.cloudinary.com') ? product.imageUrl : '/placeholder.png';

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5">
            <Link href={`/products/${product._id}`} className="block">
                <div className="relative h-64 w-full">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized={true}
                    />
                </div>
            </Link>

            <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                    onClick={handleLikeClick}
                    disabled={isLiking || !session}
                    className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-3 rounded-full shadow-lg transition-colors focus:outline-none disabled:cursor-not-allowed"
                    title="Add to Wishlist"
                >
                    <Heart 
                        size={20} 
                        className={isLikedByCurrentUser ? 'text-red-500 fill-current' : 'text-gray-700 dark:text-gray-300 hover:text-red-500'} 
                    />
                </button>
                <Link 
                    href={`/products/${product._id}#comments`}
                    className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-3 rounded-full shadow-lg text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    title="View Comments"
                >
                    <MessageSquare size={20} />
                </Link>
                <button 
                    onClick={handleAddToCart}
                    className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-3 rounded-full shadow-lg text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
                    title="Add to Cart"
                >
                    <ShoppingCart size={20} />
                </button>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{product.category}</p>
                <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white truncate">
                    <Link href={`/products/${product._id}`} className="hover:text-indigo-600 transition-colors">{product.name}</Link>
                </h3>
                
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <Heart size={16} className={product.likeCount > 0 ? 'text-red-400' : ''}/>
                        <span>{product.likeCount || 0}</span>
                    </div>
                    <Link href={`/products/${product._id}#comments`} className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                        <MessageSquare size={16} />
                        <span>{product.commentCount || 0}</span>
                    </Link>
                </div>

                <div className="flex-grow"></div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-gray-800 dark:text-white">${product.price?.toFixed(2) || '0.00'}</span>
                    <button onClick={handleAddToCart} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}