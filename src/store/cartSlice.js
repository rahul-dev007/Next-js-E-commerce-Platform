// src/store/cartSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

// localStorage থেকে আগের Cart ডেটা লোড করার চেষ্টা করা হচ্ছে
const getInitialState = () => {
    try {
        if (typeof window !== 'undefined') {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                return JSON.parse(storedCart);
            }
        }
    } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
    }
    // যদি কোনো ডেটা না থাকে বা এরর হয়, তাহলে ডিফল্ট স্টেট রিটার্ন করা হবে
    return {
        cartItems: [],
        totalQuantity: 0,
        totalAmount: 0,
    };
};

const initialState = getInitialState();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // ★★★ ১. কার্টে প্রোডাক্ট যোগ করার জন্য ★★★
        addItem: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.cartItems.find(item => item._id === newItem._id);

            state.totalQuantity++;

            if (!existingItem) {
                state.cartItems.push({
                    ...newItem,
                    quantity: 1,
                    totalPrice: newItem.price,
                });
            } else {
                existingItem.quantity++;
                existingItem.totalPrice = Number(existingItem.totalPrice) + Number(newItem.price);
            }

            localStorage.setItem('cart', JSON.stringify(state));
            toast.success(`"${newItem.name}" added to cart!`);
        },

        // ★★★ ২. কার্ট থেকে প্রোডাক্টের পরিমাণ কমানোর জন্য ★★★
        removeItem: (state, action) => {
            const id = action.payload;
            const existingItem = state.cartItems.find(item => item._id === id);

            if (existingItem) {
                state.totalQuantity--;
                if (existingItem.quantity === 1) {
                    state.cartItems = state.cartItems.filter(item => item._id !== id);
                } else {
                    existingItem.quantity--;
                    existingItem.totalPrice = Number(existingItem.totalPrice) - Number(existingItem.price);
                }
                localStorage.setItem('cart', JSON.stringify(state));
            }
        },

        // ==========================================================
        // ===== ★★★ আসল সমাধানটি এখানে (THIS IS THE REAL FIX) ★★★ =====
        // ==========================================================
        // ★★★ ৩. কার্ট থেকে একটি প্রোডাক্ট বা পুরো কার্ট ডিলিট করার জন্য ★★★
        deleteItem: (state, action) => {
            const id = action.payload;

            // যদি কোনো id না দেওয়া হয় (null), তাহলে পুরো কার্ট খালি হবে
            if (id === null) {
                state.cartItems = [];
                state.totalQuantity = 0;
                state.totalAmount = 0;
            } else {
                // অন্যথায়, শুধু নির্দিষ্ট আইটেমটি ডিলিট হবে
                const existingItem = state.cartItems.find(item => item._id === id);
                if (existingItem) {
                    state.cartItems = state.cartItems.filter(item => item._id !== id);
                    state.totalQuantity = state.totalQuantity - existingItem.quantity;
                }
            }
            
            localStorage.setItem('cart', JSON.stringify(state));
        },

        // ★★★ ৪. কার্টের মোট হিসাব গণনা করার জন্য ★★★
        calculateTotals: (state) => {
            let quantity = 0;
            let total = 0;
            state.cartItems.forEach(item => {
                quantity += item.quantity;
                total += item.price * item.quantity;
            });
            state.totalQuantity = quantity;
            state.totalAmount = total;
        },
    },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;