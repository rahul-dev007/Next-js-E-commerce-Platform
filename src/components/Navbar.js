// src/components/layout/Navbar.jsx

"use client";

import { useState, Fragment, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { LayoutDashboard, Menu as MenuIcon, X, ShoppingCart, Store, User, LogOut } from "lucide-react";
import { useSelector } from "react-redux";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  const totalQuantity = useSelector(state => state.cart.totalQuantity);
  
  const isAuthenticated = status === "authenticated";
  const userRole = session?.user?.role;
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';

  const getLinkClass = (href, baseClass = "px-3 py-2 rounded-md text-sm font-medium") => {
    return `${baseClass} ${pathname === href ? 'bg-sky-700 text-white' : 'text-gray-300 hover:bg-sky-600 hover:text-white'}`;
  };
  
  return (
    <nav className="bg-gradient-to-r from-gray-800 to-sky-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 text-2xl font-bold text-white tracking-wider hover:opacity-80 transition-opacity">
              <Store className="h-7 w-7 text-sky-400" />
              <span>MyShop</span>
            </Link>
            {/* ★★★★★ আসল সমাধানটি এখানে (items-baseline -> items-center) ★★★★★ */}
            <div className="hidden md:ml-10 md:flex md:items-center md:space-x-4">
              <Link href="/" className={getLinkClass('/')}>Home</Link>
              <Link href="/products" className={getLinkClass('/products')}>Products</Link>
              {isAuthenticated && !isAdmin && ( <Link href="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link> )}
              {isAdmin && (
                <Link href="/admin/dashboard" className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname.startsWith('/admin') ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:bg-indigo-600 hover:text-white'}`}>
                  <LayoutDashboard size={18} /> Admin Panel
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Link href="/cart" className="relative p-2 text-gray-300 hover:text-white transition-colors">
              <ShoppingCart size={24} />
              {isClient && totalQuantity > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none ring-2 ring-offset-2 ring-offset-sky-800 ring-white">
                  <span className="sr-only">Open user menu</span>
                  <div className="relative h-8 w-8">
                    <Image src={session.user.image || '/avatar-placeholder.png'} alt="User Avatar" fill sizes="32px" className="rounded-full object-cover" />
                  </div>
                </Menu.Button>
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{session.user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{session.user.email}</p>
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <Link href="/profile" className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''} group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}>
                          <User className="mr-3 h-5 w-5" /> Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button onClick={() => signOut({ callbackUrl: '/' })} className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''} group flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 font-semibold`}>
                          <LogOut className="mr-3 h-5 w-5" /> Sign Out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-sky-600 hover:bg-sky-700">Login</Link>
                <Link href="/register" className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Register</Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <Link href="/cart" className="relative p-2 text-gray-300 hover:text-white transition-colors mr-2">
              <ShoppingCart size={24} />
              {isClient && totalQuantity > 0 && (
                 <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                  {totalQuantity}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      <Transition show={isMobileMenuOpen} as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 -translate-y-4" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 -translate-y-4">
        <div className="md:hidden bg-gray-800/95 backdrop-blur-sm border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className={getLinkClass('/', 'block text-base')} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link href="/products" className={getLinkClass('/products', 'block text-base')} onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
            {isAuthenticated && !isAdmin && <Link href="/dashboard" className={getLinkClass('/dashboard', 'block text-base')} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>}
            {isAdmin && <Link href="/admin/dashboard" className={getLinkClass('/admin/dashboard', 'block text-base')} onClick={() => setIsMobileMenuOpen(false)}>Admin Panel</Link>}
            
            {isAuthenticated ? (
              <div className="pt-4 mt-4 border-t border-gray-700">
                <div className="flex items-center px-2">
                  <div className="relative h-10 w-10 flex-shrink-0">
                     <Image src={session.user.image || '/avatar-placeholder.png'} alt="User Avatar" fill sizes="40px" className="rounded-full object-cover"/>
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-white">{session.user.name}</p>
                    <p className="text-sm font-medium text-gray-400">{session.user.email}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Your Profile</Link>
                  <button onClick={() => { signOut({ callbackUrl: '/' }); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-700 hover:text-white">Sign out</button>
                </div>
              </div>
            ) : (
              <div className="pt-2 mt-2 space-y-1 border-t border-gray-700">
                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        </div>
      </Transition>
    </nav>
  );
}