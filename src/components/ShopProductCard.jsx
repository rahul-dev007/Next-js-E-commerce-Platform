// src/components/ShopProductCard.jsx (চূড়ান্ত সংস্করণ - উপর থেকে ভেসে ওঠা আইকনসহ)

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, MessageSquare } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { cartActions } from '../store/cartSlice';
import { useLikeProductMutation } from '../store/api/apiSlice';
import toast from 'react-hot-toast';

export default function ShopProductCard({ product }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [likeProduct, { isLoading: isLiking }] = useLikeProductMutation();

    if (!product) return null;

    const handleActionClick = (e, action) => {
        e.stopPropagation();
        e.preventDefault();
        action();
    };

    const handleLike = () => {
        likeProduct(product._id).unwrap()
            .then(() => toast.success('Thanks for your feedback!'))
            .catch((err) => toast.error(err?.data?.message || 'Could not like product.'));
    };
    
    const handleAddToCart = () => {
        dispatch(cartActions.addItem(product));
    };

    const handleCommentClick = () => {
        router.push(`/products/${product._id}#comments`);
    };

    return (
        <Link 
            href={`/products/${product._id}`}
            className="group relative block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2"
        >
            <div className="relative w-full overflow-hidden aspect-[4/3]">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            
            {/* 
              ★★★ আসল সমাধান এখানে ★★★
              - `justify-center` পরিবর্তন করে `justify-start` করা হয়েছে।
              - `pt-8` যোগ করে উপর থেকে কিছুটা গ্যাপ তৈরি করা হয়েছে।
            */}
            <div className="absolute inset-0 flex flex-col items-end justify-start gap-3 p-4 pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <button 
                    onClick={(e) => handleActionClick(e, handleLike)} 
                    disabled={isLiking} 
                    className="p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full text-gray-800 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 shadow-lg transition-all duration-300 transform translate-x-10 group-hover:translate-x-0 pointer-events-auto"
                    title="Like"
                >
                    <Heart />
                </button>
                <button 
                    onClick={(e) => handleActionClick(e, handleCommentClick)} 
                    className="p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 shadow-lg transition-all duration-300 transform translate-x-10 group-hover:translate-x-0 delay-100 pointer-events-auto"
                    title="Comment"
                >
                    <MessageSquare />
                </button>
                <button 
                    onClick={(e) => handleActionClick(e, handleAddToCart)} 
                    className="p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-lg transition-all duration-300 transform translate-x-10 group-hover:translate-x-0 delay-200 pointer-events-auto"
                    title="Add to Cart"
                >
                    <ShoppingCart />
                </button>
            </div>
            
            <div className="p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{product.category}</p>
                <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg mt-1">
                    {product.name}
                </h3>
                
                <div className="mt-4 flex justify-between items-center">
                    <p className="font-semibold text-indigo-600 dark:text-indigo-400 text-xl">
                        ${product.price ? product.price.toFixed(2) : '0.00'}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1.5" title={`${product.likeCount ?? 0} Likes`}>
                            <Heart size={16} />
                            <span>{product.likeCount ?? 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title={`${product.commentCount ?? 0} Comments`}>
                            <MessageSquare size={16} />
                            <span>{product.commentCount ?? 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}