// src/app/profile/page.js (THE FINAL, CORRECT, AND OFFICIAL METHOD)

"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, User, Save, LogOut, UploadCloud, ShieldCheck, Mail, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    // ★★★ আমরা শুধুমাত্র useSession ব্যবহার করব ★★★
    const { data: session, status, update } = useSession({ required: true });
    const router = useRouter();
    
    // States
    const [name, setName] = useState('');
    const [imagePreview, setImagePreview] = useState('/avatar-placeholder.png');
    const [stagedFile, setStagedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const fileInputRef = useRef(null);

    // useEffect এখন session-এর উপর নির্ভর করবে, যা সঠিক
    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || '');
            if (!stagedFile) {
                setImagePreview(session.user.image || '/avatar-placeholder.png');
            }
        }
    }, [session]); // নির্ভরতা এখন session
    
    const hasChanges = (session?.user && name !== session.user.name) || stagedFile !== null;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) { 
                toast.error("Image size must be less than 2MB.");
                return;
            }
            setStagedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        if (!hasChanges) return;

        setIsSubmitting(true);
        const toastId = toast.loading('Saving changes...');
        
        let uploadedImageUrl = session?.user?.image;

        try {
            if (stagedFile) {
                const formData = new FormData();
                formData.append('file', stagedFile);
                formData.append('folderName', 'profile_images');
                
                const uploadResponse = await fetch('/api/upload', { method: 'POST', body: formData });
                if (!uploadResponse.ok) throw new Error('Image upload failed.');
                const uploadResult = await uploadResponse.json();
                uploadedImageUrl = uploadResult.url;
            }

            const updatePayload = { name, image: uploadedImageUrl };
            
            const response = await fetch('/api/profile/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload),
            });
            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.message || 'Failed to update profile.');
            }
            
            const result = await response.json();
            
            // ★★★★★ আসল এবং ফাইনাল সমাধানটি এখানেই (THE ONLY CORRECT WAY) ★★★★★
            // NextAuth-এর session-কে নতুন তথ্য দিয়ে আপডেট করার জন্য অনুরোধ করা হচ্ছে।
            // এটি নিজে থেকেই UI রি-রেন্ডার ট্রিগার করবে।
            await update({
                ...session, // পুরনো সেশনের সব তথ্য রাখা হচ্ছে (যেমন token)
                user: {
                    ...session.user, // পুরনো ইউজার তথ্য রাখা হচ্ছে (যেমন email, role)
                    name: result.user.name,   // নতুন নাম দিয়ে আপডেট
                    image: result.user.image, // নতুন ছবি দিয়ে আপডেট
                },
            });
            // ★★★★★ সমাধান শেষ ★★★★★

            setStagedFile(null);
            toast.success('Profile updated successfully!', { id: toastId });

        } catch (error) {
            toast.error(error.message || 'Something went wrong.', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === "loading" || !session?.user) {
        return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-16 w-16 animate-spin text-indigo-500" /></div>;
    }

    // UI কোডটি অপরিবর্তিত আছে
    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <button onClick={() => router.back()} className="flex items-center gap-2 mb-6 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <ChevronLeft size={18} /> Back
                </button>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="relative h-40 md:h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                            <div className="relative h-32 w-32 md:h-36 md:w-36 ring-8 ring-white dark:ring-gray-800 rounded-full group">
                                <Image src={imagePreview} alt="Profile Picture" fill className="rounded-full object-cover" unoptimized={true} />
                                <button onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer" aria-label="Change profile picture">
                                    <UploadCloud className="h-8 w-8 text-white" />
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} />
                            </div>
                        </div>
                    </div>
                    <div className="pt-20 pb-8 px-6 text-center">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{name}</h1>
                        <div className="mt-3 flex items-center justify-center gap-4 text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2"><Mail size={16} /><span>{session.user.email}</span></div>
                            {session.user.role && (<div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium"><ShieldCheck size={16} /> <span className="capitalize">{session.user.role}</span></div>)}
                        </div>
                    </div>
                    <form onSubmit={handleFinalSubmit} className="border-t border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Edit Your Profile</h2>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                            <div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="block w-full rounded-lg border-gray-300 py-3 pl-12 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" required />
                            </div>
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end items-center pt-4 gap-4">
                            <button type="button" onClick={() => signOut({ callbackUrl: '/' })} className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-600 font-semibold text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"><LogOut size={16} /><span>Sign Out</span></button>
                            <button type="submit" disabled={!hasChanges || isSubmitting} className="flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-500/30">
                                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : <Save size={20} />}<span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}