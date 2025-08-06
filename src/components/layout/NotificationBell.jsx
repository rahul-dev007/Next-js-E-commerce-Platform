"use client";

import { Fragment, memo } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
// ★★★ আসল এবং একমাত্র সমাধান এখানে: আমরা এখন apiSlice.js থেকে ইম্পোর্ট করছি ★★★
import { useGetNotificationsQuery, useMarkNotificationsAsReadMutation } from '../../store/api/apiSlice';
import { Menu, Transition } from '@headlessui/react';
import { Bell, MessageSquare, Heart, Info, Loader2 } from 'lucide-react';
import Image from 'next/image';

const NotificationItem = memo(function NotificationItem({ notification }) {
    const Icon = notification.type === 'like' ? Heart : MessageSquare;
    const messageStart = notification.type === 'like' ? `liked your product:` : `commented on your product:`;

    return (
        <Link 
          href={notification.product ? `/products/${notification.product._id}` : '#'} 
          className={`block p-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${!notification.read ? 'bg-sky-50 dark:bg-sky-900/30' : ''}`}
        >
            <div className="flex items-start gap-3">
                <div className="relative h-8 w-8 flex-shrink-0">
                    <Image src={notification.sender?.image || '/avatar-placeholder.png'} alt={notification.sender?.name || 'User'} fill sizes="32px" className="rounded-full object-cover" />
                </div>
                <div className="w-full">
                    <p className="leading-tight">
                        <span className="font-semibold">{notification.sender?.name || 'A user'}</span>
                        {' '}{messageStart}{' '}
                        <span className="font-semibold text-sky-600 dark:text-sky-400">{notification.product?.name || '[Deleted Product]'}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                </div>
            </div>
        </Link>
    );
});

export default function NotificationBell() {
    const { data: session } = useSession();
    const { data, isLoading, error } = useGetNotificationsQuery(undefined, {
        skip: !session,
        pollingInterval: 60000, 
    });
    const [markAsRead, { isLoading: isMarkingRead }] = useMarkNotificationsAsReadMutation();

    const handleMenuOpen = () => {
        if (data?.unreadCount > 0 && !isMarkingRead) {
            markAsRead();
        }
    };
    
    if (!session) return null;

    const unreadCount = data?.unreadCount ?? 0;

    return (
        <Menu as="div" className="relative">
            <Menu.Button onClick={handleMenuOpen} className="relative p-2 text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-800 focus:ring-white rounded-full">
                <span className="sr-only">View notifications</span>
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white border-2 border-gray-800">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </Menu.Button>
            <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-80 sm:w-96 max-h-[80vh] overflow-y-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                        <p className="text-base font-semibold text-gray-900 dark:text-white">Notifications</p>
                    </div>
                    <div className="flex-grow">
                        {isLoading ? (
                            <div className="flex justify-center items-center p-10">
                                <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
                            </div>
                        ) : error ? (
                            <p className="p-4 text-sm text-center text-red-500">Could not load notifications.</p>
                        ) : data?.notifications?.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {data.notifications.map(notif => (
                                    <Menu.Item key={notif._id}>
                                        <NotificationItem notification={notif} />
                                    </Menu.Item>
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 text-center">
                                <Info className="mx-auto h-10 w-10 text-gray-400" />
                                <p className="mt-4 text-sm font-medium text-gray-500">You have no new notifications.</p>
                            </div>
                        )}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}