"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
// ★★★ সঠিক পাথ: তিনটি ../ ★★★
import { useResetPasswordMutation } from '../../../store/api/apiSlice';
import toast from 'react-hot-toast';
import { Lock, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const router = useRouter();
    const params = useParams();
    const { token } = params;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordReset, setPasswordReset] = useState(false);
    
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }
        try {
            await resetPassword({ token, password }).unwrap();
            toast.success("Password reset successfully! You can now log in.");
            setPasswordReset(true);
            setTimeout(() => router.push('/login'), 3000);
        } catch (err) {
            toast.error(err.data?.message || 'Failed to reset password. The link might be expired or invalid.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Set a New Password</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Please enter and confirm your new password below.
                    </p>
                </div>

                {passwordReset ? (
                    <div className="text-center p-6 bg-green-100 dark:bg-green-900/50 rounded-lg">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                        <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Password Changed!</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                            You will be redirected to the <Link href="/login" className="font-semibold text-indigo-500 hover:underline">login page</Link> shortly.
                        </p>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="password" className="sr-only">New Password</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-md border-gray-300 py-3 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
                                    placeholder="New Password"
                                />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="confirm-password" className="sr-only">Confirm New Password</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-md border-gray-300 py-3 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
                                    placeholder="Confirm New Password"
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
                                    'Reset Password'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}