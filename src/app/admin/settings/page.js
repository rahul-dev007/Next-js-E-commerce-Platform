"use client";

import { useSession } from 'next-auth/react';

export default function AdminSettingsPage() {
    const { data: session } = useSession();

    // শুধুমাত্র superadmin-রাই এই পেজ দেখতে পারবে
    if (session?.user?.role !== 'superadmin') {
        return (
            <div className="text-center p-8 text-red-500 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <h2 className="text-2xl font-bold">Access Denied</h2>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Site Settings</h1>
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                <p className="text-xl">This feature is coming soon.</p>
                <p>Superadmins will be able to manage site-wide settings from here.</p>
            </div>
        </div>
    );
}