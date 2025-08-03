// src/context/UserContext.js

"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

// ১. কনটেক্সট তৈরি করা হচ্ছে
const UserContext = createContext(null);

// ২. প্রোভাইডার কম্পোনেন্ট তৈরি করা হচ্ছে
export const UserProvider = ({ children }) => {
    // SessionProvider থেকে সেশন ডেটা নেওয়া হচ্ছে
    const { data: session, status } = useSession();
    
    // আমাদের নিজস্ব ইউজার এবং লোডিং স্টেট
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(status === 'loading');
        if (status === 'authenticated') {
            setUser(session.user);
        } else if (status === 'unauthenticated') {
            setUser(null);
        }
    }, [session, status]);
    
    // এই ফাংশনটি আমাদের UserContext-কে বাইরে থেকে আপডেট করার ক্ষমতা দেবে
    const updateUserContext = useCallback((newUserData) => {
        setUser(prevUser => ({
            ...prevUser,
            ...newUserData
        }));
    }, []);

    const value = { user, isLoading, updateUserContext };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

// ৩. একটি কাস্টম হুক তৈরি করা হচ্ছে, যাতে ব্যবহার করা সহজ হয়
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};