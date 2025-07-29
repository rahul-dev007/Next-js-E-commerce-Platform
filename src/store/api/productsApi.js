// src/store/api/productsApi.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      return headers;
    },
  }),
  tagTypes: ['Product'],

  endpoints: (builder) => ({
    
    getProducts: builder.query({
      query: ({ page = 1, search = '', scope = '' }) => {
        const params = new URLSearchParams({ page: page.toString(), search });
        if (scope) {
          params.append('scope', scope);
        }
        return `products?${params.toString()}`;
      },
      transformResponse: (response) => {
          return response.data || { products: [], pagination: {} };
      },
      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map(({ _id }) => ({ type: 'Product', id: _id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getProductById: builder.query({
      query: (id) => `products/${id}`,
      // ★★★ transformResponse আপডেট করা হয়েছে ★★★
      // API থেকে { data: { product: {...}, relatedProducts: [...] } } আসছে
      // আমরা এখন data অবজেক্টটিকেই রিটার্ন করছি
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: '/products',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `products/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, { type: 'Product', id: 'LIST' }],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    likeProduct: builder.mutation({
      query: (productId) => ({
        url: `products/${productId}/like`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, productId) => [{ type: 'Product', id: 'LIST' }, { type: 'Product', id: productId }],
    }),

    addComment: builder.mutation({
      query: ({ productId, text }) => ({
        url: `products/${productId}/comment`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),
    
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useLikeProductMutation,
  useAddCommentMutation,
} = productsApi;