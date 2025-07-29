// src/app/dashboard/page.jsx

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';
import { Loader2, User, ShoppingBag, ListOrdered, ArrowRight, ShieldAlert } from "lucide-react";

// ডেমো অর্ডার ডেটা (ভবিষ্যতে API থেকে আসবে)
const dummyOrders = [
    { _id: 'ORD123', date: '2023-10-26', total: 119.99, status: 'Delivered' },
    { _id: 'ORD124', date: '2023-10-28', total: 45.50, status: 'Processing' },
    { _id: 'ORD125', date: '2023-10-29', total: 250.00, status: 'Shipped' },
];

// Access Denied Component (যদি কোনো অ্যাডমিন ভুল করে এখানে আসে)
function AccessDenied() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
                <ShieldAlert className="mx-auto h-16 w-16 text-yellow-500" />
                <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Admin Access</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    You have admin privileges. Please use the admin panel.
                </p>
                <Link href="/admin/dashboard" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition">
                    Go to Admin Dashboard
                </Link>
            </div>
        </div>
    );
}


export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // যদি সেশন লোড হয়ে যায় এবং ইউজার অথেনটিকেটেড না থাকে
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  // যদি অ্যাডমিন বা সুপারঅ্যাডমিন হয়, তাহলে তাকে তার নিজের ড্যাশবোর্ডে পাঠানো হবে
  if (session?.user?.role === 'admin' || session?.user?.role === 'superadmin') {
      return <AccessDenied />;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                Welcome, {session.user.name}!
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* বাম দিক: প্রোফাইল এবং কুইক অ্যাকশন */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
                        <div className="relative h-24 w-24 mx-auto">
                            <Image src={session.user.image || '/avatar-placeholder.png'} alt="Profile" fill className="rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md" unoptimized/>
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{session.user.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{session.user.email}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link href="/profile" className="flex items-center justify-between p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                                <span className="flex items-center gap-3 font-medium"><User size={20}/> My Profile</span>
                                <ArrowRight size={16}/>
                            </Link>
                            <Link href="/products" className="flex items-center justify-between p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                                <span className="flex items-center gap-3 font-medium"><ShoppingBag size={20}/> Shop Now</span>
                                <ArrowRight size={16}/>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ডান দিক: সাম্প্রতিক অর্ডার */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3"><ListOrdered/> My Recent Orders</h2>
                    <div className="space-y-4">
                        {dummyOrders.length > 0 ? dummyOrders.map(order => (
                            <div key={order._id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-3">
                                <div>
                                    <p className="font-bold text-indigo-600 dark:text-indigo-400">Order #{order._id}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Date: {order.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">${order.total.toFixed(2)}</p>
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                        order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                    }`}>{order.status}</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 py-10">You have no recent orders.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}