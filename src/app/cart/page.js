// src/app/cart/page.js
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { cartActions } from '../../store/cartSlice';
import { Trash2, ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CartPage() {
    const dispatch = useDispatch();
    const { data: session } = useSession();
    
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);

    const cartItems = useSelector(state => state.cart.cartItems);
    const totalAmount = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleAddItem = (item) => dispatch(cartActions.addItem(item));
    const handleRemoveItem = (id) => dispatch(cartActions.removeItem(id));
    const handleDeleteItem = (id) => dispatch(cartActions.deleteItem(id));

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        if (!session) {
            toast.error("Please log in to proceed to checkout.");
            setIsCheckingOut(false);
            return;
        }
        try {
            const response = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems,
                    customerEmail: session.user.email,
                }),
            });
            const checkoutSession = await response.json();
            if (!response.ok) {
                throw new Error(checkoutSession.message || 'Failed to create checkout session.');
            }
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({ sessionId: checkoutSession.id });
            if (error) {
                console.error("Stripe checkout error:", error);
                toast.error(error.message);
            }
        } catch (error) {
            console.error("Checkout process error:", error);
            toast.error("Could not proceed to checkout. Please try again.");
        } finally {
            setIsCheckingOut(false);
        }
    };
    
    if (!isClient) {
        return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-16 w-16 animate-spin text-indigo-500" /></div>;
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl sm:text-4xl font-bold mb-6 text-center text-gray-800 dark:text-white">Your Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <ShoppingCart size={64} className="mx-auto text-gray-400" />
                        <h2 className="mt-6 text-2xl font-semibold text-gray-700 dark:text-gray-300">Your cart is empty</h2>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Looks like you have not added anything to your cart yet.</p>
                        <Link href="/products" className="mt-6 inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition">
                            <ArrowLeft size={20} /> Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-2/3">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                {cartItems.map(item => (
                                    <div key={item._id} className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                        <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                                            <div className="relative h-20 w-20 flex-shrink-0">
                                                <Image src={item.imageUrl} alt={item.name} fill className="object-cover rounded-md" unoptimized />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{item.name}</h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">${item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                                                <button onClick={() => handleRemoveItem(item._id)} className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-md">-</button>
                                                <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                                                <button onClick={() => handleAddItem(item)} className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-md">+</button>
                                            </div>
                                            <p className="font-bold text-lg w-24 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                                            <button onClick={() => handleDeleteItem(item._id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/3">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
                                <h2 className="text-xl font-bold border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">Order Summary</h2>
                                <div className="flex justify-between mb-2">
                                    <p>Subtotal</p>
                                    <p>${totalAmount.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <p>Shipping</p>
                                    <p>Free</p>
                                </div>
                                <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                                    <p>Total</p>
                                    <p>${totalAmount.toFixed(2)}</p>
                                </div>
                                <button 
                                    onClick={handleCheckout} 
                                    disabled={isCheckingOut}
                                    className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-green-700 transition flex items-center justify-center disabled:bg-green-400 disabled:cursor-not-allowed"
                                >
                                    {isCheckingOut ? ( <Loader2 className="animate-spin" /> ) : ( 'Proceed to Checkout' )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}