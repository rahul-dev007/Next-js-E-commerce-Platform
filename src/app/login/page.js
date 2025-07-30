// src/app/login/page.js
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Github, Chrome, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "A valid email is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const errorFromUrl = searchParams.get("error");
  
  const { data: session, status } = useSession();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (errorFromUrl) {
      setError("Invalid email or password. Please try again.");
      toast.error("Invalid email or password.");
    }
  }, [errorFromUrl]);

  useEffect(() => {
    if (status === 'authenticated' && session) {
        toast.success("Logged in successfully! Redirecting...");
        const userRole = session.user?.role?.toLowerCase();
        if (userRole === 'admin' || userRole === 'superadmin') {
            router.push('/admin/dashboard');
        } else {
            router.push(callbackUrl || '/');
        }
    }
  }, [status, session, router, callbackUrl]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (result.error) {
        throw new Error(result.error);
      }
    } catch (err) {
      setError("Invalid credentials. Please check your email and password.");
      toast.error("Invalid credentials. Please check your email and password.");
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = (provider) => {
    setIsLoading(true);
    signIn(provider, { callbackUrl: callbackUrl || '/' });
  };
  
  if (status === 'loading' || status === 'authenticated') {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
            <Loader2 className="h-16 w-16 animate-spin text-indigo-500" />
        </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Do not have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Sign Up
            </Link>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSocialSignIn("github")}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <Github className="mr-2 h-5 w-5" /> GitHub
          </button>
          <button
            onClick={() => handleSocialSignIn("google")}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <Chrome className="mr-2 h-5 w-5" /> Google
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600" /></div>
          <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">Or with email</span></div>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input id="email" type="email" {...register("email")} className="w-full rounded-lg border-gray-300 py-3 pl-12 pr-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500/50" placeholder="Email address" />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input id="password" type={showPassword ? "text" : "password"} {...register("password")} className="w-full rounded-lg border-gray-300 py-3 pl-12 pr-12 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500/50" placeholder="Password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>
          <div className="text-right text-sm"><a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a></div>
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</div>}
          <div>
            <button type="submit" disabled={isLoading} className="flex w-full justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 py-3 px-4 font-semibold text-white shadow-lg transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 dark:focus:ring-offset-gray-800">
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}