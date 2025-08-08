"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForgotPasswordMutation } from '../../store/api/apiSlice';
import toast from 'react-hot-toast';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword({ email }).unwrap();
            toast.success("Password reset link sent! Please check your email.");
            setEmailSent(true);
        } catch (err) {
            toast.error(err.data?.message || 'Failed to send reset link.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Forgot Your Password?</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        No worries! Enter your email and we'll send you a reset link.
                    </p>
                </div>

                {emailSent ? (
                    <div className="text-center p-6 bg-green-100 dark:bg-green-900/50 rounded-lg">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                        <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Check Your Inbox</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                            We have sent a password reset link to <span className="font-semibold">{email}</span>. Please follow the instructions in the email.
                        </p>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-md border-gray-300 py-3 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
                                    placeholder="Email address"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </div>
                    </form>
                )}

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>
                        Remembered your password?{' '}
                        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}