// src/store/api/apiSlice.js (চূড়ান্ত প্রোডাকশন-রেডি সংস্করণ)

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Product', 'User', 'Notification', 'Stats'],

  endpoints: (builder) => ({

    // ... তোমার অন্যান্য এন্ডপয়েন্ট (getProducts, getUsers, ইত্যাদি) অপরিবর্তিত থাকবে ...
    getProducts: builder.query({
      query: ({ page = 1, search = '', scope = '' }) => `products?page=${page}&search=${search}&scope=${scope}`,
      transformResponse: (response) => response.data || { products: [], pagination: {} },
      providesTags: (result) => result?.products ? [...result.products.map(({ _id }) => ({ type: 'Product', id: _id })), { type: 'Product', id: 'LIST' }] : [{ type: 'Product', id: 'LIST' }],
    }),
    getProductById: builder.query({
      query: (id) => `products/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    addProduct: builder.mutation({
      query: (newProduct) => ({ url: '/products', method: 'POST', body: newProduct }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...patch }) => ({ url: `products/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, { type: 'Product', id: 'LIST' }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `products/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id: 'LIST' }],
    }),

    getUsers: builder.query({
      query: () => 'admin/users',
      // ★★★ এই অংশটি যোগ করলে ভালো হয় ★★★
      transformResponse: (response) => response.data || [], // নিশ্চিত করে যে data প্রপার্টি রিটার্ন হবে, না থাকলে খালি অ্যারে
      providesTags: (result) =>
        result ?
          [...result.map(({ _id }) => ({ type: 'User', id: _id })), { type: 'User', id: 'LIST' }]
          : [{ type: 'User', id: 'LIST' }],
    }),

    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({ url: `admin/users/${id}`, method: 'PUT', body: { role } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, { type: 'User', id: 'LIST' }], // এভাবে করলে আরো নিখুঁতভাবে ইনভ্যালিডেট হয়
    }),

    deleteUser: builder.mutation({
      query: (id) => ({ url: `admin/users/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    getAdminStats: builder.query({
      query: () => 'admin/stats',
      providesTags: ['Stats', 'Product', 'User']
    }),
    getNotifications: builder.query({
      query: () => 'notifications',
      providesTags: ['Notification'],
    }),
    markNotificationsAsRead: builder.mutation({
      query: () => ({ url: 'notifications', method: 'POST' }),
      invalidatesTags: ['Notification'],
    }),

    // ==========================================================
    // ===== ★★★ আসল সমাধানটি এখানে (The Real Fix) ★★★ =====
    // ==========================================================

    likeProduct: builder.mutation({
      query: (productId) => ({ url: `products/${productId}/like`, method: 'POST' }),
      // প্রথমে প্রোডাক্ট ট্যাগ ইনভ্যালিডেট করা হচ্ছে
      invalidatesTags: (result, error, productId) => [{ type: 'Product', id: 'LIST' }, { type: 'Product', id: productId }],
      // সফল হওয়ার পর নোটিফিকেশন ডেটা রিফ্রেশ করার জন্য
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // অন্য API স্লাইসের ট্যাগকে ইনভ্যালিডেট করার জন্য dispatch করতে হয়
          dispatch(apiSlice.util.invalidateTags(['Notification']));
        } catch (err) {
          console.error('Failed to invalidate notifications after like:', err);
        }
      },
    }),

    addComment: builder.mutation({
      query: ({ productId, text }) => ({ url: `products/${productId}/comment`, method: 'POST', body: { text } }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(apiSlice.util.invalidateTags(['Notification']));
        } catch (err) {
          console.error('Failed to invalidate notifications after comment:', err);
        }
      },
    }),
  }),
});

export const {
  // ... তোমার পুরনো হুকগুলো ...
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetAdminStatsQuery,
  useGetNotificationsQuery,
  useMarkNotificationsAsReadMutation,
  // নতুন হুকগুলো
  useLikeProductMutation,
  useAddCommentMutation,
} = apiSlice;