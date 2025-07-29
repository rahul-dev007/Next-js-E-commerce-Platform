// src/app/products/add/page.js
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, UploadCloud } from "lucide-react";
import { useAddProductMutation } from "../../../store/api/productsApi";
import toast from 'react-hot-toast';
import Image from "next/image";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  category: z.string().min(1, "Category is required."),
});

export default function AddProductPage() {
  const router = useRouter();
  const { status } = useSession({ required: true });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addProduct] = useAddProductMutation();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
          toast.error("Image file size cannot exceed 5MB.");
          return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (formData) => {
    if (!imageFile) {
      toast.error("Please upload an image for the product.");
      return;
    }
    setIsSubmitting(true);
    const toastId = toast.loading("Submitting product...");

    try {
      let imageUrl = "";
      try {
        const imageUploadData = new FormData();
        imageUploadData.append('file', imageFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageUploadData,
        });
        const uploadResult = await uploadResponse.json();
        
        if (!uploadResponse.ok) {
          throw new Error(uploadResult.message || "Image upload failed");
        }
        imageUrl = uploadResult.url;
        toast.loading("Image uploaded, adding product details...", { id: toastId });
      } catch (uploadError) {
        throw new Error(`Image Upload Failed: ${uploadError.message}`);
      }

      await addProduct({ ...formData, imageUrl }).unwrap();
      toast.success("Product added successfully!", { id: toastId });
      router.push("/products");
    } catch (err) {
      console.error("Failed to add product:", err);
      const errorMessage = err.data?.message || err.message || "Failed to add product.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-10 w-10 animate-spin" /></div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="w-full max-w-2xl space-y-8 rounded-2xl bg-white p-10 shadow-2xl dark:bg-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Add a New Product</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Fill out the form below to add a new product to your store.</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Image</label>
            <div className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <Image src={imagePreview} alt="Product Preview" width={128} height={128} className="mx-auto h-32 w-32 object-cover rounded-md" />
                ) : (
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white dark:bg-gray-700 font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/png, image/jpeg, image/gif" />
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Product Name</label>
            <input id="name" type="text" {...register("name")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium">Description</label>
            <textarea id="description" rows="4" {...register("description")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label htmlFor="price" className="block text-sm font-medium">Price ($)</label>
                <input id="price" type="number" step="0.01" {...register("price")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium">Category</label>
                <input id="category" type="text" {...register("category")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
              </div>
          </div>
          
          <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center rounded-lg bg-indigo-600 py-3 px-4 text-base font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed">
            {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isSubmitting ? "Submitting..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}