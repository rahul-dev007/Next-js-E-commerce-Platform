import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Product', 'User', 'Notification', 'Stats'],

  endpoints: (builder) => ({
    
    // ===== প্রোডাক্ট এন্ডপয়েন্ট =====
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
    likeProduct: builder.mutation({
      query: (productId) => ({ url: `products/${productId}/like`, method: 'POST' }),
      invalidatesTags: (result, error, productId) => [{ type: 'Product', id: 'LIST' }, { type: 'Product', id: productId }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try { await queryFulfilled; dispatch(apiSlice.util.invalidateTags(['Notification'])); } catch (err) {}
      },
    }),
    addComment: builder.mutation({
      query: ({ productId, text }) => ({ url: `products/${productId}/comment`, method: 'POST', body: { text } }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try { await queryFulfilled; dispatch(apiSlice.util.invalidateTags(['Notification'])); } catch (err) {}
      },
    }),
    // ==========================================================
    // ===== ★★★ রিভিউ মিউটেশন এখানে যোগ করা হয়েছে ★★★ =====
    // ==========================================================
    addProductReview: builder.mutation({
        query: ({ productId, review }) => ({
            url: `/products/${productId}/review`,
            method: 'POST',
            body: review,
        }),
        // যখন একটি নতুন রিভিউ যোগ করা হবে, তখন সেই συγκεκριμένη প্রোডাক্টের ডেটা রিফ্রেশ হবে
        invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),

    // ===== ইউজার এন্ডপয়েন্ট =====
    getUsers: builder.query({
      query: () => 'admin/users',
      transformResponse: (response) => response.data || [],
      providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: 'User', id: _id })), { type: 'User', id: 'LIST' }] : [{ type: 'User', id: 'LIST' }],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({ url: `admin/users/${id}`, method: 'PUT', body: { role } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, { type: 'User', id: 'LIST' }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `admin/users/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // ===== অন্যান্য এন্ডপয়েন্ট =====
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
  }),
});

export const {
  // পুরনো হুকগুলো
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
  useLikeProductMutation,
  useAddCommentMutation,
  // ★★★ নতুন হুক এখানে যোগ করা হয়েছে ★★★
  useAddProductReviewMutation,
} = apiSlice;