// src/app/admin/dashboard/page.js (সম্পূর্ণ নতুন এবং ডায়নামিক সংস্করণ)

"use client";

import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';
import { Loader2, Users, ShoppingBag, DollarSign, Package, TrendingUp, BarChart3, Shield } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import Link from 'next/link';

// API থেকে ডেটা fetch করার ফাংশন
const fetchAdminStats = async () => {
  const res = await fetch('/api/admin/stats');
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};

// StatCard কম্পোনেন্ট (এখন এটি ক্লিকেবল)
function StatCard({ title, value, icon: Icon, color, link, isLoading, isMoney = false }) {
  const cardContent = (
    <motion.div
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-2xl flex items-center gap-5 transition-all duration-300 hover:bg-slate-800 hover:-translate-y-1"
      whileHover={{ scale: 1.03 }}
    >
      <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}20` }}>
        <Icon className="h-7 w-7" style={{ color }} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        {isLoading ? 
          <div className="h-8 w-28 bg-slate-700 rounded-md animate-pulse mt-1"></div> : 
          <p className="text-2xl font-bold text-white">{isMoney && '$'}{value.toLocaleString()}</p>
        }
      </div>
    </motion.div>
  );

  // যদি লিংক থাকে, তাহলে Link কম্পোনেন্ট দিয়ে র‍্যাপ করা হবে
  return link ? <Link href={link}>{cardContent}</Link> : <div>{cardContent}</div>;
}

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 p-3 rounded-lg shadow-lg">
        <p className="label font-bold text-white">{`${label}`}</p>
        <p className="intro text-sky-300">{`Sales : $${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};


// মূল ড্যাশবোর্ড পেজ
export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const { data: response, isLoading, error } = useQuery({ queryKey: ['adminStats'], queryFn: fetchAdminStats });

  const stats = response?.stats;
  const userRole = session?.user?.role;
  
  const greetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (error) return <div className="text-center p-8 text-red-400 bg-red-900/30 rounded-lg">Error: {error.message}</div>;

  return (
    <div className="aurora-background min-h-screen p-4 sm:p-6 lg:p-8 text-white">
        <motion.div 
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {greetingMessage()}, {session?.user?.name}!
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-300">
            Welcome to your command center. Here's what's happening on your platform.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-700 border border-slate-600 text-sm">
            <Shield className="h-4 w-4 text-green-400"/>
            <span>Role: <span className="font-bold text-green-400 capitalize">{userRole}</span></span>
          </div>
        </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {userRole === 'superadmin' && (
          <>
            <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="#38bdf8" link="/admin/users" isLoading={isLoading} />
            <StatCard title="Total Products" value={stats?.totalProducts || 0} icon={ShoppingBag} color="#fb7185" link="/admin/products" isLoading={isLoading} />
            <StatCard title="Total Revenue" value={stats?.totalRevenue || 0} icon={DollarSign} color="#34d399" isLoading={isLoading} isMoney={true} />
          </>
        )}
        {userRole === 'admin' && (
          <>
            <StatCard title="My Products" value={stats?.myTotalProducts || 0} icon={Package} color="#34d399" link="/admin/products" isLoading={isLoading} />
            <StatCard title="My Revenue" value={stats?.myTotalRevenue || 0} icon={DollarSign} color="#a78bfa" isLoading={isLoading} isMoney={true} />
          </>
        )}
      </motion.div>

      <motion.div 
        className="mt-10 bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="text-sky-400" />
            <h2 className="text-2xl font-bold text-white">Sales Overview (Last 7 Days)</h2>
        </div>
        {isLoading ? (
            <div className="h-80 flex justify-center items-center"><Loader2 className="h-10 w-10 animate-spin text-sky-400" /></div>
        ) : (
            <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={stats?.salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" stroke="#94a3b8"/>
                    <YAxis tickFormatter={(value) => `$${value}`} stroke="#94a3b8"/>
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="sales" stroke="#38bdf8" fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
            </ResponsiveContainer>
        )}
      </motion.div>
    </div>
  );
}