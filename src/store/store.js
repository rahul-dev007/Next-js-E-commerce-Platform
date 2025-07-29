// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';

// আমাদের সব API স্লাইস ইম্পোর্ট করা হচ্ছে
import { productsApi } from './api/productsApi'; 
import { usersApi } from './api/usersApi'; 

// আমাদের ফিচার স্লাইস ইম্পোর্ট করা হচ্ছে
import authReducer from '../features/auth/authSlice';
// ★★★ নতুন cartSlice ইম্পোর্ট করা হয়েছে ★★★
import cartReducer from './cartSlice'; 

export const store = configureStore({
  reducer: {
    // API স্লাইসগুলোর reducer এখানে যোগ করা হয়
    [productsApi.reducerPath]: productsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,

    // সাধারণ স্লাইসগুলোর reducer এখানে যোগ করা হয়
    auth: authReducer,
    cart: cartReducer, // ★★★ cartReducer এখানে যোগ করা হয়েছে ★★★
  },

  // middleware কনফিগার করা হচ্ছে
  // RTK Query-এর প্রতিটি API স্লাইসের জন্য middleware যোগ করতে হয়
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productsApi.middleware,
      usersApi.middleware
    ),

  // শুধুমাত্র ডেভেলপমেন্ট মোডে DevTools চালু থাকবে
  devTools: process.env.NODE_ENV !== 'production',
});