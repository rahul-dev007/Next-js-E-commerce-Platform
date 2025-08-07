"use client";

import { useState, Suspense, Fragment } from 'react';
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from 'react-hot-toast';
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { cartActions } from "../../../store/cartSlice";
import {
    Loader2, Edit, Trash2, ArrowLeft, Send, Star, UserCircle,
    MessageSquare, Heart, ShoppingCart, MessageCircle
} from "lucide-react";

import {
    useGetProductByIdQuery,
    useDeleteProductMutation,
    useAddCommentMutation,
    useLikeProductMutation,
    useAddProductReviewMutation
} from "../../../store/api/apiSlice";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import ShopProductCard from "../../../components/ShopProductCard";

// ===================================
// ===== সাব-কম্পোনেন্টগুলো =====
// ===================================

// রেটিং স্টার দেখানোর জন্য (RangeError ফিক্সসহ)
function RatingStars({ rating, numReviews, size = 20 }) {
    const validRating = Number(rating) || 0;
    const fullStars = Math.floor(validRating);
    const halfStar = validRating % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - fullStars - (halfStar ? 1 : 0));

    return (
        <div className="flex items-center gap-1">
            {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} size={size} className="text-yellow-400 fill-current" />)}
            {halfStar && <Star size={size} className="text-yellow-400" />}
            {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} size={size} className="text-gray-300 dark:text-gray-600" />)}
            {numReviews !== undefined && <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">from {numReviews} reviews</span>}
        </div>
    );
}

// একটি রিভিউ দেখানোর জন্য
function ReviewCard({ review }) {
    return (
        <div className="py-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div className="flex items-center mb-2">
                <UserCircle size={32} className="mr-3 text-gray-400" />
                <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{review.name}</p>
                    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            <RatingStars rating={review.rating} size={16} />
            <p className="mt-3 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{review.comment}</p>
        </div>
    );
}

// রিভিউ জমা দেওয়ার ফর্ম
function ReviewForm({ productId, hasUserReviewed }) {
    const { data: session } = useSession();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [addProductReview, { isLoading }] = useAddProductReviewMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) { toast.error("Please select a star rating."); return; }
        if (!comment.trim()) { toast.error("Please write a comment."); return; }
        try {
            await addProductReview({ productId, review: { rating, comment } }).unwrap();
            toast.success("Review submitted successfully!");
            setRating(0);
            setComment('');
        } catch (err) {
            toast.error(err?.data?.message || "Failed to submit review.");
        }
    };

    if (!session) {
        return <p className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg text-yellow-800 dark:text-yellow-200">Please <Link href="/login" className="font-bold underline">log in</Link> to write a review.</p>;
    }
    
    if(hasUserReviewed) {
        return <p className="mt-8 p-4 bg-green-100 dark:bg-green-900/50 rounded-lg text-green-800 dark:text-green-200">You have already reviewed this product. Thank you for your feedback!</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Write a Review</h3>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Rating</label>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} size={24} onClick={() => setRating(star)} className={`cursor-pointer transition-colors ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-300'}`} />
                    ))}
                </div>
            </div>
            <div>
                <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Comment</label>
                <textarea id="review-comment" rows="4" value={comment} onChange={(e) => setComment(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"></textarea>
            </div>
            <button type="submit" disabled={isLoading} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700 disabled:opacity-50">
                {isLoading ? <><Loader2 className="animate-spin h-5 w-5" /> Submitting...</> : <><Send size={16} /> Submit Review</>}
            </button>
        </form>
    );
}

// CommentSection Component
function CommentSection({ productId, comments = [], createdBy }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [commentText, setCommentText] = useState('');
    const [addComment, { isLoading }] = useAddCommentMutation();

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!session) { toast.error("You must be logged in to post a comment."); return; }
        if (!commentText.trim()) { toast.error("Comment cannot be empty."); return; }
        try {
            await addComment({ productId, text: commentText }).unwrap();
            setCommentText('');
            toast.success("Comment posted!");
        } catch (err) { toast.error(err?.data?.message || "Failed to post comment."); }
    };
    
    return (
        <div id="comments" className="mt-12 lg:mt-16 border-t border-gray-200 dark:border-gray-700 pt-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <MessageSquare /> Community Discussion ({comments.length})
            </h2>
            {session && (
                 <form onSubmit={handleCommentSubmit} className="mb-10 flex items-start gap-3 sm:gap-4">
                    <div className="relative h-12 w-12 flex-shrink-0">
                        <Image src={session.user.image || '/avatar-placeholder.png'} alt="user avatar" fill className="rounded-full object-cover" />
                    </div>
                    <div className="relative flex-1">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            rows="3"
                            placeholder="Join the discussion..."
                            disabled={isLoading}
                            className="w-full p-4 pr-16 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-60"
                        />
                        <button type="submit" disabled={isLoading} className="absolute top-1/2 right-4 -translate-y-1/2 bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 disabled:bg-indigo-400 shadow-lg transition-transform hover:scale-110">
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                        </button>
                    </div>
                </form>
            )}
            <div className="space-y-8">
                {comments.length > 0 ? comments.map((comment) => (
                    <div key={comment._id} className="flex items-start gap-3 sm:gap-4">
                        <div className="relative h-10 w-10 flex-shrink-0">
                            <Image src={comment.user?.image || '/avatar-placeholder.png'} alt={comment.user?.name || 'User'} fill className="rounded-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                <p className="font-bold text-gray-800 dark:text-white">
                                    {comment.user?.name || "Anonymous"}
                                    {comment.user?._id === createdBy?._id && <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium">Author</span>}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">{new Date(comment.createdAt).toLocaleString()}</p>
                            </div>
                            <p className="mt-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 p-4 rounded-xl whitespace-pre-wrap">{comment.text}</p>
                        </div>
                    </div>
                )) : (
                    <div className="text-center text-gray-500 py-12">
                        <p>No comments yet. Be the first to start the conversation!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// RelatedProducts Section Component
function RelatedProducts({ products }) {
    if (!products || products.length === 0) return null;
    return (
        <div className="mt-16 lg:mt-24 border-t border-gray-200 dark:border-gray-700 pt-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map(product => <ShopProductCard key={product._id} product={product} />)}
            </div>
        </div>
    );
}

// ===================================
// ===== মূল পেজ কম্পোনেন্ট =====
// ===================================
function ProductDetails() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { data: response, error, isLoading } = useGetProductByIdQuery(id);
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
    const [likeProduct, { isLoading: isLiking }] = useLikeProductMutation();

    const handleLikeClick = async () => {
        if (!session) { toast.error("Please log in to like this product."); return; }
        try { await likeProduct(id).unwrap(); } catch (err) { toast.error("Something went wrong."); }
    };
    const handleAddToCart = () => { if(response?.product) dispatch(cartActions.addItem(response.product)); };
    const handleDelete = async () => {
        if (!response?.product) return;
        const toastId = toast.loading("Deleting product...");
        try {
            await deleteProduct(id).unwrap();
            toast.success("Product deleted successfully!", { id: toastId });
            setIsDeleteModalOpen(false);
            router.push("/products");
        } catch (err) {
            toast.error(err?.data?.message || "Failed to delete the product.", { id: toastId });
        }
    };

    if (isLoading) { return <div className="flex justify-center items-center min-h-[80vh]"><Loader2 className="h-16 w-16 animate-spin text-indigo-500" /></div>; }
    if (error || !response?.product) { return <div className="text-center py-20"><p className="text-2xl font-bold text-red-500">Product Not Found</p></div>; }
    
    const { product, relatedProducts } = response;
    
    const isOwner = session && product.createdBy && session.user.id === product.createdBy._id;
    const isAdmin = session && (session.user.role === 'admin' || session.user.role === 'superadmin');
    const isLikedByCurrentUser = product.likes?.includes(session?.user?.id);
    const hasUserReviewed = (product.reviews || []).some(review => review.user?.toString() === session?.user?.id);

    return (
        <Fragment>
            <div className="bg-white dark:bg-gray-900 min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8">
                        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold">
                            <ArrowLeft size={20} /> Back to Products
                        </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
                        <div className="lg:col-span-3 lg:sticky lg:top-24">
                            <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700">
                                <Image src={product.imageUrl || '/placeholder.png'} alt={product.name || 'Product Image'} fill className="object-cover" priority />
                                {(isOwner || isAdmin) && (
                                    <div className="absolute top-4 right-4 flex gap-3">
                                        <Link href={`/products/edit/${id}`} className="flex items-center gap-2 bg-blue-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600"><Edit size={18} /> Edit</Link>
                                        <button onClick={() => setIsDeleteModalOpen(true)} disabled={isDeleting} className="flex items-center gap-2 bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-600 disabled:bg-red-400"><Trash2 size={18} /> Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="lg:col-span-2 flex flex-col">
                            <p className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">{product.category}</p>
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mt-2">{product.name}</h1>
                            <div className="mt-4 flex items-center gap-4">
                                <RatingStars rating={product.rating} numReviews={product.numReviews} />
                            </div>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="relative h-8 w-8 flex-shrink-0">
                                    <Image src={product.createdBy?.image || '/avatar-placeholder.png'} alt={product.createdBy?.name || 'author'} fill className="rounded-full object-cover" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400">by <span className="font-bold text-gray-700 dark:text-gray-200">{product.createdBy?.name || 'Unknown Author'}</span></p>
                            </div>
                            <p className="mt-8 text-5xl font-bold text-gray-800 dark:text-white">${product.price?.toFixed(2) || '0.00'}</p>
                            <div className="mt-8">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Description</h2>
                                <div className="prose dark:prose-invert mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }} />
                            </div>
                            <div className="mt-10 flex gap-4">
                                <button onClick={handleLikeClick} disabled={isLiking || !session} className="flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50">
                                    <Heart className={isLikedByCurrentUser ? 'text-red-500 fill-current' : ''} />
                                    <span>{product.likes?.length || 0}</span>
                                </button>
                                <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg">
                                    <ShoppingCart /> Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-16 lg:mt-24 border-t border-gray-200 dark:border-gray-700 pt-10">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Ratings & Reviews ({product.numReviews || 0})</h2>
                        {(product.reviews || []).length === 0 ? (
                            <div className="mt-8 p-6 text-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-4 text-gray-600 dark:text-gray-400">No reviews yet. Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            <div className="mt-8 space-y-6">
                                {(product.reviews || []).map(review => <ReviewCard key={review._id} review={review} />)}
                            </div>
                        )}
                        <ReviewForm productId={id} hasUserReviewed={hasUserReviewed} />
                    </div>

                    <CommentSection productId={id} comments={product.comments || []} createdBy={product.createdBy} />
                    <RelatedProducts products={relatedProducts || []} />
                </div>
            </div>
            <ConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} title="Delete Product" message={`Are you sure you want to delete "${product?.name}"? This action is permanent.`} confirmText="Delete" isLoading={isDeleting} />
        </Fragment>
    );
}

// ===================================
// ===== পেজ Wrapper =====
// ===================================
export default function ProductDetailsPageWrapper({ params }) {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><Loader2 className="h-16 w-16 animate-spin text-indigo-500" /></div>}>
            <ProductDetails params={params} />
        </Suspense>
    );
}