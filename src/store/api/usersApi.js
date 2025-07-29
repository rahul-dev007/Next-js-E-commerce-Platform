// src/store/api/usersApi.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/admin' }),
  tagTypes: ['User'],

  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'users',
      // ★★★ transformResponse ব্যবহার করে ডেটাকে সরল করা হয়েছে ★★★
      transformResponse: (response) => {
          // API থেকে আসা { success: true, data: [...] } গঠনটিকে
          // সরাসরি ইউজারদের অ্যারে [...] তে পরিণত করা হচ্ছে
          return response.data || [];
      },
      providesTags: (result = []) =>
        [
            ...result.map(({ _id }) => ({ type: 'User', id: _id })),
            { type: 'User', id: 'LIST' },
        ],
    }),
    
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, { type: 'User', id: 'LIST' }],
    }),

    deleteUser: builder.mutation({
        query: (id) => ({
            url: `users/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    
  }),
});

export const { 
    useGetUsersQuery,
    useUpdateUserRoleMutation,
    useDeleteUserMutation,
} = usersApi;