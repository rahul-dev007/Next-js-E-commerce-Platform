'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// ★★★ Star আইকন ইম্পোর্ট করা হয়েছে ★★★
import { ShoppingCart, Heart, MessageSquare, Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { cartActions } from '../store/cartSlice';
import { useLikeProductMutation } from '../store/api/apiSlice';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

// ★★★ রেটিং স্টার দেখানোর জন্য একটি নতুন, রি-ইউজেবল কম্পোনেন্ট ★★★
function RatingStars({ rating = 0, numReviews = 0 }) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-1">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} size={16} className="text-yellow-400 fill-current" />
            ))}
            {halfStar && <Star size={16} className="text-yellow-400" />}
            {[...Array(emptyStars)].map((_, i) => (
                <Star key={`empty-${i}`} size={16} className="text-gray-300 dark:text-gray-600" />
            ))}
            {numReviews > 0 && <span className="ml-1 text-xs text-gray-500">({numReviews})</span>}
        </div>
    );
}


export default function ShopProductCard({ product }) {
    const { data: session } = useSession();
    const dispatch = useDispatch();
    const router = useRouter();
    const [likeProduct, { isLoading: isLiking }] = useLikeProductMutation();

    if (!product) return null;

    const handleActionClick = (e, action) => {
        e.stopPropagation();
        e.preventDefault();
        if (!session) {
            toast.error("Please log in to perform this action.");
            return;
        }
        action();
    };

    const handleLike = () => {
        likeProduct(product._id).unwrap()
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
            
            <div className="p-4 flex-grow flex flex-col">
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{product.category}</p>
                <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg mt-1">
                    {product.name}
                </h3>
                
                <div className="mt-2 h-5">
                    {product.numReviews > 0 ? (
                        <RatingStars rating={product.rating} numReviews={product.numReviews} />
                    ) : (
                        <span className="text-xs text-gray-400 italic">No reviews yet</span>
                    )}
                </div>
                
                <div className="flex-grow"></div> 
                
                <div className="mt-4 flex justify-between items-center">
                    <p className="font-semibold text-indigo-600 dark:text-indigo-400 text-xl">
                        ${product.price ? product.price.toFixed(2) : '0.00'}
                    </p>
                    <button 
                        onClick={(e) => handleActionClick(e, handleAddToCart)}
                        className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-bold py-2 px-4 rounded-lg text-sm transition-colors duration-300 hover:bg-indigo-600 hover:text-white"
                    >
                        Add
                    </button>
                </div>
            </div>
        </Link>
    );
}