"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Loader2, LayoutDashboard, Users, ShoppingBag, Settings, ExternalLink } from 'lucide-react'; // ExternalLink আইকন ইম্পোর্ট করা হয়েছে

// অ্যাডমিন সাইডবার কম্পোনেন্ট
function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession(); // সেশন থেকে ডেটা নিন
  const userRole = session?.user?.role;

  const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'superadmin'] },
    { href: '/admin/users', icon: Users, label: 'Users', roles: ['superadmin'] },
    { href: '/admin/products', icon: ShoppingBag, label: 'Products', roles: ['admin', 'superadmin'] },
    { href: '/admin/settings', icon: Settings, label: 'Settings', roles: ['superadmin'] },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white flex-shrink-0 hidden md:flex md:flex-col justify-between">
      <div>
        <div className="p-5 text-2xl font-semibold text-white border-b border-gray-700">
          <Link href="/admin/dashboard">Admin Panel</Link>
        </div>
        <nav className="mt-5">
          {navItems.map(item => (
            userRole && item.roles.includes(userRole) && (
              <Link 
                key={item.label} 
                href={item.href}
                className={`flex items-center py-3 px-5 mx-2 rounded-lg transition-colors duration-200 hover:bg-gray-700 ${pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href)) ? 'bg-indigo-600' : ''}`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            )
          ))}
        </nav>
      </div>
      
      {/* ★★★ "View Site" লিংকটি এখানে যোগ করা হয়েছে ★★★ */}
      <div className="p-4 border-t border-gray-700">
        <Link 
          href="/" 
          target="_blank" // নতুন ট্যাবে লিংকটি খুলবে
          rel="noopener noreferrer" // নিরাপত্তার জন্য
          className="flex items-center py-3 px-5 mx-2 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <ExternalLink className="h-5 w-5 mr-3" />
          <span>View Site</span>
        </Link>
      </div>
    </aside>
  );
}

// মূল অ্যাডমিন লেআউট
export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

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
  
  if (status === "loading" || status === "unauthenticated" || !session) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Loader2 className="h-16 w-16 animate-spin text-indigo-500" />
        <p className="ml-4 text-white">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );   
}