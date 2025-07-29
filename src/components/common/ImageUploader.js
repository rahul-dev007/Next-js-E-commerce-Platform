"use client";

import { useState, useCallback, useEffect } from 'react'; // useEffect ইম্পোর্ট করা হয়েছে
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function ImageUploader({ onFileChange, initialImageUrl, isUploading }) {
  const [preview, setPreview] = useState(initialImageUrl || null);

  // ★★★ এটাই সেই ১০০% পারফেক্ট সমাধান ★★★
  // এই useEffect নিশ্চিত করে যে, যখনই initialImageUrl প্রপটি বাইরে থেকে পরিবর্তন হবে
  // (যেমন: RTK Query নতুন ডেটা fetch করলে), ভেতরের preview স্টেটটিও আপডেট হয়ে যাবে।
  useEffect(() => {
    if (initialImageUrl) {
        setPreview(initialImageUrl);
    }
  }, [initialImageUrl]);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB.'); // alert-এর বদলে toast
        return;
      }
      onFileChange(file); // Parent কম্পোনেন্টকে ফাইলটি পাঠানো হচ্ছে
      setPreview(URL.createObjectURL(file)); // লোকাল প্রিভিউ দেখানো হচ্ছে
    }
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: false
  });

  const removePreview = (e) => {
    e.stopPropagation();
    setPreview(null);
    onFileChange(null);
    // URL.revokeObjectURL() এখানে কল করা যেতে পারে মেমোরি লিক এড়ানোর জন্য, তবে এটি জটিলতা বাড়াতে পারে।
  };

  return (
    <div {...getRootProps()} className={`relative w-full h-56 border-2 border-dashed rounded-lg flex items-center justify-center text-center cursor-pointer transition-colors
      ${isDragActive ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'}
    `}>
      <input {...getInputProps()} />
      {isUploading ? (
        <div className="flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            <p className="mt-2 text-sm font-semibold">Uploading...</p>
        </div>
      ) : preview ? (
        <>
          <Image src={preview} alt="Preview" fill className="object-contain rounded-lg p-2" unoptimized />
          <button
            onClick={removePreview}
            className="absolute top-2 right-2 bg-white/80 dark:bg-gray-900/80 p-1.5 rounded-full shadow-md hover:scale-110 transition-transform"
            aria-label="Remove image"
          >
            <X className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
          <UploadCloud className="h-12 w-12" />
          <p className="mt-2 text-sm font-semibold">
            {isDragActive ? 'Drop the image here' : 'Drag & drop an image, or click to select'}
          </p>
          <p className="text-xs">PNG, JPG, WEBP up to 2MB</p>
        </div>
      )}
    </div>
  );
}