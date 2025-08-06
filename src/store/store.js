import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice'; // ★★★ শুধু একটি apiSlice ইম্পোর্ট করা হচ্ছে ★★★
import authReducer from '../features/auth/authSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    // সাধারণ স্লাইসগুলো এখানে থাকবে
    auth: authReducer,
    cart: cartReducer,
    // RTK Query-র সব reducer একটি নামে যুক্ত হচ্ছে
    [apiSlice.reducerPath]: apiSlice.reducer, // ★★★ শুধু একটি reducer যোগ করা হয়েছে ★★★
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // ★★★ শুধু একটি middleware যোগ করা হয়েছে ★★★

  devTools: process.env.NODE_ENV !== 'production',
});