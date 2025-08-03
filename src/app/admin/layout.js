// src/app/admin/layout.js (Final Version with better spacing)

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, Fragment } from "react";
import Link from 'next/link';
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { Loader2, LayoutDashboard, Users, ShoppingBag, Settings, ExternalLink, Menu, X, ChevronDown } from 'lucide-react';

function AdminSidebar({ isOpen, setIsOpen }) {
    // ... (এই কম্পোনেন্টের কোড অপরিবর্তিত)
    const pathname = usePathname();
    const { data: session } = useSession();
    const userRole = session?.user?.role;
    const navItems = [
        { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'superadmin'] },
        { href: '/admin/users', icon: Users, label: 'Users', roles: ['superadmin'] },
        { href: '/admin/products', icon: ShoppingBag, label: 'Products', roles: ['admin', 'superadmin'] },
        { href: '/admin/settings', icon: Settings, label: 'Settings', roles: ['superadmin'] },
    ];
    return (
        <>
            {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 z-30 lg:hidden"></div>}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white flex flex-col justify-between transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:flex`}>
                <div>
                    <div className="flex items-center justify-between p-5 text-2xl font-semibold text-white border-b border-gray-700">
                        <Link href="/admin/dashboard">Admin Panel</Link>
                        <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white"><X size={24} /></button>
                    </div>
                    <nav className="mt-5">
                        {navItems.map(item => (
                            userRole && item.roles.includes(userRole) && (
                                <Link key={item.label} href={item.href} onClick={() => setIsOpen(false)} className={`flex items-center py-3 px-5 mx-2 rounded-lg transition-colors duration-200 hover:bg-gray-700 ${pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href)) ? 'bg-indigo-600' : ''}`}>
                                    <item.icon className="h-5 w-5 mr-3" /><span>{item.label}</span>
                                </Link>
                            )
                        ))}
                    </nav>
                </div>
                <div className="p-4 border-t border-gray-700">
                    <Link href="/" target="_blank" rel="noopener noreferrer" className="flex items-center py-3 px-5 mx-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white">
                        <ExternalLink className="h-5 w-5 mr-3" /><span>View Site</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}

function AdminTopbar({ onMenuClick }) {
    // ... (এই কম্পোনেন্টের কোড অপরিবর্তিত)
    const { data: session } = useSession();
    return (
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
            <button onClick={onMenuClick} className="lg:hidden text-gray-600 dark:text-gray-300"><Menu size={24} /></button>
            <div className="flex-1 flex justify-end">
                {session?.user && (
                    <HeadlessMenu as="div" className="relative">
                        <HeadlessMenu.Button className="flex items-center gap-2 text-sm">
                            <Image src={session.user.image || '/avatar-placeholder.png'} alt={session.user.name || 'User'} width={32} height={32} className="rounded-full" />
                            <span className="hidden sm:inline font-medium text-gray-700 dark:text-gray-200">{session.user.name}</span>
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        </HeadlessMenu.Button>
                        <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                            <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="p-1">
                                    <HeadlessMenu.Item>
                                        {({ active }) => (
                                            <Link href="/profile" className={`${active ? 'bg-indigo-500 text-white' : 'text-gray-900 dark:text-gray-100'} group flex rounded-md items-center w-full px-2 py-2 text-sm`}>Profile</Link>
                                        )}
                                    </HeadlessMenu.Item>
                                </div>
                            </HeadlessMenu.Items>
                        </Transition>
                    </HeadlessMenu>
                )}
            </div>
        </header>
    );
}

export default function AdminLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (status === 'authenticated') {
            const userRole = session.user.role;
            if (userRole !== 'admin' && userRole !== 'superadmin') { router.replace("/"); }
        } else if (status === 'unauthenticated') { router.replace("/login"); }
    }, [session, status, router]);
  
    if (status === "loading" || !session) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-900"><Loader2 className="h-16 w-16 animate-spin text-indigo-500" /></div>;
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col lg:ml-64">
                <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
                {/* ★★★★★ গ্যাপ কমানোর জন্য প্যাডিং পরিবর্তন করা হয়েছে ★★★★★ */}
                <main className="flex-1 p-4 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );   
}