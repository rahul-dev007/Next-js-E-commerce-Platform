// src/app/products/edit/[id]/page.js

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { Loader2, Trash2 } from "lucide-react";
import toast from 'react-hot-toast';

// ==========================================================
// ===== ★★★ আসল সমাধানটি এখানে (THIS IS THE REAL FIX) ★★★ =====
// ==========================================================
// ★★★ সঠিক পাথ ব্যবহার করা হয়েছে ★★★
import { 
  useGetProductByIdQuery, 
  useUpdateProductMutation, 
  useDeleteProductMutation 
} from "../../../../store/api/productsApi";
// ==========================================================


import ConfirmationModal from "../../../../components/common/ConfirmationModal";
import ImageUploader from "../../../../components/common/ImageUploader";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  category: z.string().min(1, "Category is required."),
});

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session, status } = useSession({ required: true });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: response, isLoading: isProductLoading, error: productError } = useGetProductByIdQuery(id, { skip: !id });
  const productData = response?.product;
  
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (productData) {
      reset({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
      });
    }
  }, [productData, reset]);

  const onSubmit = async (data) => {
    const toastId = toast.loading("Updating product...");
    try {
      let newImageUrl = productData?.imageUrl;

      if (imageFile) {
        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        const uploadResponse = await fetch('/api/upload', { method: 'POST', body: uploadData });
        const uploadResult = await uploadResponse.json();
        setIsUploading(false);

        if (!uploadResponse.ok) throw new Error(uploadResult.message || 'Image upload failed.');
        newImageUrl = uploadResult.url;
      }
      
      const updatedData = { ...data, imageUrl: newImageUrl };
      await updateProduct({ id, ...updatedData }).unwrap();

      toast.success("Product updated successfully!", { id: toastId });
      router.push(`/admin/products`);
    } catch (err) {
      setIsUploading(false);
      toast.error(err?.data?.message || err.message || "Failed to update product.", { id: toastId });
    }
  };
  
  const handleDelete = async () => {
    const toastId = toast.loading("Deleting product...");
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted successfully!", { id: toastId });
      setIsDeleteModalOpen(false);
      router.push('/admin/products');
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete product.", { id: toastId });
    }
  };

  if (isProductLoading || status === "loading") {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-10 w-10 animate-spin" /></div>;
  }
  
  if (productError) {
    return <div className="text-center py-20 text-red-500 font-bold text-xl">Failed to load product data.</div>;
  }

  if (!productData) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-10 w-10 animate-spin" /></div>;
  }
  
  const isOwner = session.user.id === productData.createdBy?._id;
  const isSuperAdmin = session.user.role === 'superadmin';

  if (!isOwner && !isSuperAdmin) {
    return <div className="text-center py-20 text-red-500 font-bold text-2xl">You are not authorized to edit this product.</div>;
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900/50 py-12 px-4">
        <div className="w-full max-w-2xl space-y-8 rounded-2xl bg-white p-6 sm:p-10 shadow-2xl dark:bg-gray-800">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Product</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Image</label>
                <ImageUploader 
                    onFileChange={setImageFile} 
                    initialImageUrl={productData.imageUrl}
                    isUploading={isUploading}
                />
            </div>

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
                <input id="name" type="text" {...register("name")} className="mt-1 w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea id="description" rows="4" {...register("description")} className="mt-1 w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                   <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price ($)</label>
                   <input id="price" type="number" step="0.01" {...register("price")} className="mt-1 w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" />
                   {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
               </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <input id="category" type="text" {...register("category")} className="mt-1 w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" />
                    {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
                </div>
            </div>
            
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center pt-4">
              <button type="button" onClick={() => setIsDeleteModalOpen(true)} disabled={isDeleting} className="flex w-full sm:w-auto items-center justify-center rounded-lg bg-red-600 px-6 py-3 text-white font-semibold hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed mt-4 sm:mt-0">
                  <Trash2 className="mr-2 h-5 w-5" />Delete
              </button>
              <button type="submit" disabled={isUpdating || isUploading} className="flex w-full sm:w-auto items-center justify-center rounded-lg bg-indigo-600 px-8 py-3 text-white font-semibold hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                {(isUpdating || isUploading) && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {(isUpdating || isUploading) ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productData?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </>
  );
}