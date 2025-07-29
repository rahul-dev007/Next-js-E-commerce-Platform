// src/app/admin/dashboard/page.js

"use client";

import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';
import { Loader2, Users, ShoppingBag, DollarSign, Package, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// API থেকে ডেটা fetch করার ফাংশন
const fetchAdminStats = async () => {
  const res = await fetch('/api/admin/stats');
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};

// StatCard কম্পোনেন্ট
function StatCard({ title, value, icon: Icon, colorClass, isLoading, isMoney = false }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center transition-all duration-300 hover:shadow-xl hover:scale-105 border-l-4" style={{ borderColor: colorClass }}>
      <div className={`p-4 rounded-full bg-opacity-10`} style={{ backgroundColor: `${colorClass}30`}}>
        <Icon className="h-8 w-8" style={{ color: colorClass }} />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        {isLoading ? 
          <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mt-1"></div> : 
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{isMoney && '$'}{value.toLocaleString()}</p>
        }
      </div>
    </div>
  );
}

// মূল ড্যাশবোর্ড পেজ
export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const { data: response, isLoading, error } = useQuery({ queryKey: ['adminStats'], queryFn: fetchAdminStats });

  const stats = response?.stats;
  const userRole = session?.user?.role;
  
  if (error) return <div className="text-center p-8 text-red-500 ...">Error: {error.message}</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome back, {session?.user?.name}!
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Here is a snapshot of your {userRole === 'superadmin' ? 'site' : 'contributions'}.
        </p>
      </div>
      
      {/* ★★★ নতুন এবং ইউনিক পরিসংখ্যান কার্ড ★★★ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userRole === 'superadmin' && (
          <>
            <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} colorClass="#3B82F6" isLoading={isLoading} />
            <StatCard title="Total Products" value={stats?.totalProducts || 0} icon={ShoppingBag} colorClass="#EF4444" isLoading={isLoading} />
            <StatCard title="Total Revenue" value={stats?.totalRevenue || 0} icon={DollarSign} colorClass="#10B981" isLoading={isLoading} isMoney={true} />
          </>
        )}
        {userRole === 'admin' && (
          <>
            <StatCard title="My Products" value={stats?.myTotalProducts || 0} icon={Package} colorClass="#10B981" isLoading={isLoading} />
            <StatCard title="My Revenue" value={stats?.myTotalRevenue || 0} icon={DollarSign} colorClass="#8B5CF6" isLoading={isLoading} isMoney={true} />
          </>
        )}
      </div>

      {/* ★★★ নতুন এবং ইউনিক চার্ট ★★★ */}
      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-indigo-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sales Overview (Last 7 Days)
            </h2>
        </div>
        {isLoading ? (
            <div className="h-80 flex justify-center items-center"><Loader2 className="h-10 w-10 animate-spin text-indigo-500" /></div>
        ) : (
            <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={stats?.salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }} />
                    <Area type="monotone" dataKey="sales" stroke="#8884d8" fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
            </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}