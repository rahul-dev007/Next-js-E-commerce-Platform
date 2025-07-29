// src/app/profile/page.js

"use client";

import { useState, useEffect, useRef } from 'react';
// ==========================================================
// ===== ★★★ আসল সমাধানটি এখানে (THIS IS THE REAL FIX) ★★★ =====
// ==========================================================
import { useSession, signOut } from 'next-auth/react'; // ★★★ signOut ইম্পোর্ট করা হয়েছে ★★★
// ==========================================================
import Image from 'next/image';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Loader2, User, Save, LogOut, UploadCloud, ShieldCheck, Mail, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

// Helper function to create cropped image (অপরিবর্তিত)
function getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                console.error('Canvas is empty');
                return;
            }
            const finalFileName = fileName || 'cropped-image.jpeg';
            const file = new File([blob], finalFileName, { type: 'image/jpeg' });
            resolve(file);
        }, 'image/jpeg');
    });
}

export default function ProfilePage() {
    const { data: session, status, update } = useSession({ required: true });
    const fileInputRef = useRef(null);
    const imgRef = useRef(null);

    const [name, setName] = useState('');
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [originalFileName, setOriginalFileName] = useState('');

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || '');
            setImagePreview(session.user.image || '/avatar-placeholder.png');
        }
    }, [session]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size should be less than 2MB.");
                return;
            }
            setCrop(undefined);
            setOriginalFileName(file.name);
            const reader = new FileReader();
            reader.addEventListener('load', () => setImageSrc(reader.result?.toString() || ''));
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    function onImageLoad(e) {
        const { width, height } = e.currentTarget;
        const aspect = 1;
        const cropWidth = Math.min(width, height) * 0.9;
        const crop = centerCrop(
            makeAspectCrop({ unit: 'px', width: cropWidth }, aspect, width, height),
            width, height
        );
        setCrop(crop);
    }

    const handleUpdateProfile = async (e) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading('Updating profile...');

        let imageUrl = null;

        try {
            if (completedCrop && imgRef.current) {
                const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop, originalFileName);
                const formData = new FormData();
                formData.append('file', croppedImageBlob);
                const uploadResponse = await fetch('/api/upload', { method: 'POST', body: formData });
                if (!uploadResponse.ok) throw new Error('Image upload failed.');
                const uploadResult = await uploadResponse.json();
                imageUrl = uploadResult.url;
                setImageSrc(null);
            }

            const updatePayload = { name, ...(imageUrl && { image: imageUrl }) };
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
            await update(result.user);
            toast.success('Profile updated successfully!', { id: toastId });
        } catch (error) {
            toast.error(error.message || 'Something went wrong.', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === "loading" || !session || !imagePreview) {
        return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-16 w-16 animate-spin text-indigo-500" /></div>;
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                            <div className="relative h-32 w-32 md:h-40 md:w-40 flex-shrink-0 group">
                                <Image
                                    src={imagePreview}
                                    alt="Profile Picture"
                                    fill
                                    className="rounded-full object-cover border-8 border-white dark:border-gray-800 shadow-lg"
                                    unoptimized={true}
                                />
                                <button onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <UploadCloud className="h-8 w-8 text-white" />
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleImageChange} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 pb-10 px-6 md:px-10 text-center">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">{session.user.name}</h1>
                        <div className="mt-2 flex items-center justify-center flex-wrap gap-x-4 gap-y-1 text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2"><Mail size={16} /><span>{session.user.email}</span></div>
                            {session.user.role && (
                                <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-green-500" /> <span className="font-semibold capitalize">{session.user.role}</span></div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 border-t-2 border-dashed border-gray-200 dark:border-gray-700 p-6 md:p-10">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Edit Profile</h2>
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                <div className="relative mt-1">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><User className="h-5 w-5 text-gray-400" /></div>
                                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="block w-full rounded-lg border-gray-300 py-3 pl-12 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600" required />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                                <button type="button" onClick={() => signOut({ callbackUrl: '/' })} className="flex justify-center items-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-600 px-6 py-3 text-gray-800 dark:text-white font-semibold shadow-md hover:bg-gray-300 dark:hover:bg-gray-500 transition">
                                    <LogOut size={20} /><span>Sign Out</span>
                                </button>
                                <button type="submit" disabled={isSubmitting || !!imageSrc} className="flex justify-center items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold shadow-md hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed">
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                    <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {imageSrc && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full">
                        <h3 className="text-2xl font-bold mb-4">Crop Your New Photo</h3>
                        <ReactCrop
                            crop={crop}
                            onChange={c => setCrop(c)}
                            onComplete={c => setCompletedCrop(c)}
                            aspect={1}
                            circularCrop
                            className="max-h-[60vh]"
                        >
                            <img ref={imgRef} src={imageSrc} onLoad={onImageLoad} alt="Crop preview" style={{ maxHeight: '60vh' }} />
                        </ReactCrop>
                        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                            <button onClick={() => { setImageSrc(null); fileInputRef.current.value = null; }} className="flex justify-center items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-white font-semibold shadow-md hover:bg-red-700 transition">
                                <X /><span>Cancel</span>
                            </button>
                            <button onClick={handleUpdateProfile} disabled={isSubmitting || !completedCrop} className="flex justify-center items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white font-semibold shadow-md hover:bg-green-700 transition disabled:bg-green-400 disabled:cursor-not-allowed">
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <Check />}
                                <span>{isSubmitting ? 'Uploading...' : 'Apply & Save'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}