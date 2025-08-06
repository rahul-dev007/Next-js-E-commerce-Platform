"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, Fragment } from "react";
import Link from 'next/link';
import Image from "next/image";
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { Loader2, LayoutDashboard, Users, ShoppingBag, Settings, ExternalLink, Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
// ★★★ আসল সমাধান: Path alias ছাড়া রিলেটিভ পাথ ব্যবহার করা হয়েছে ★★★
import { cartActions } from '../../store/cartSlice'; 

// ===================================
// ===== AdminSidebar Component =====
// ===================================
function AdminSidebar({ isOpen, setIsOpen }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const userRole = session?.user?.role;
    const navItems = [
        { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'superadmin'] },
        { href: '/admin/users', icon: Users, label: 'Users', roles: ['superadmin'] },
        { href: '/admin/products', icon: ShoppingBag, label: 'Products', roles: ['admin', 'superadmin'] },
    ];
    return (
        <>
            <div onClick={() => setIsOpen(false)} className={`fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}></div>
            
            <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-gray-200 flex flex-col justify-between shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div>
                    <div className="flex items-center justify-between p-5 text-2xl font-semibold text-white border-b border-gray-700">
                        <Link href="/admin/dashboard" className="hover:opacity-80 transition-opacity">Admin Panel</Link>
                        <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
                    </div>
                    <nav className="mt-5 px-2">
                        {navItems.map(item => (
                            userRole && item.roles.includes(userRole) && (
                                <Link key={item.label} href={item.href} onClick={() => setIsOpen(false)} 
                                      className={`flex items-center py-2.5 px-4 my-1 rounded-lg transition-colors duration-200 hover:bg-gray-700 hover:text-white ${pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href)) ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>
                                    <item.icon className="h-5 w-5 mr-3" />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        ))}
                    </nav>
                </div>
                <div className="p-4 border-t border-gray-700">
                    <Link href="/" target="_blank" rel="noopener noreferrer" className="flex items-center py-2.5 px-4 mx-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                        <ExternalLink className="h-5 w-5 mr-3" />
                        <span>View Live Site</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}

// ===================================
// ===== AdminTopbar Component =====
// ===================================
function AdminTopbar({ onMenuClick }) {
    const { data: session } = useSession();
    const router = useRouter();
    const dispatch = useDispatch();

    const handleSignOut = async () => {
        dispatch(cartActions.deleteItem(null));
        await signOut({ redirect: false });
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center border-b dark:border-gray-700">
            <button onClick={onMenuClick} className="lg:hidden text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Menu size={24} />
            </button>
            
            <div className="flex-1"></div>

            <div className="flex items-center gap-4">
                {session?.user && (
                    <HeadlessMenu as="div" className="relative">
                        <HeadlessMenu.Button className="flex items-center gap-2 text-sm rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <div className="relative h-8 w-8 rounded-full overflow-hidden">
                                <Image 
                                    src={session.user.image || '/avatar-placeholder.png'} 
                                    alt={session.user.name || 'User'} 
                                    fill 
                                    className="object-cover" 
                                />
                            </div>
                            <span className="hidden sm:inline font-medium text-gray-700 dark:text-gray-200">{session.user.name}</span>
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        </HeadlessMenu.Button>
                        <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                            <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="px-1 py-1">
                                    <div className="px-3 py-2 border-b dark:border-gray-600">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Signed in as</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{session.user.email}</p>
                                    </div>
                                    <HeadlessMenu.Item>
                                        {({ active }) => (
                                            <Link href="/profile" className={`${active ? 'bg-indigo-500 text-white' : 'text-gray-900 dark:text-gray-100'} group flex rounded-md items-center w-full px-3 py-2 text-sm`}>
                                                <User className="mr-2 h-5 w-5" /> Profile
                                            </Link>
                                        )}
                                    </HeadlessMenu.Item>
                                    <HeadlessMenu.Item>
                                        {({ active }) => (
                                            <button onClick={handleSignOut} className={`${active ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-100'} group flex rounded-md items-center w-full px-3 py-2 text-sm`}>
                                                <LogOut className="mr-2 h-5 w-5" /> Sign Out
                                            </button>
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

// ===================================
// ===== AdminLayout Component (Main) =====
// ===================================
export default function AdminLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (status === 'authenticated') {
            const userRole = session.user.role;
            if (userRole !== 'admin' && userRole !== 'superadmin') {
                router.replace("/");
            }
        } else if (status === 'unauthenticated') {
            router.replace("/login");
        }
    }, [session, status, router]);
  
    if (status === "loading" || !session) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out lg:ml-64">
                <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );   
}