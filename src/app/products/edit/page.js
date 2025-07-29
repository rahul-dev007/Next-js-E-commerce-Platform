"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

// সঠিক Relative Path ব্যবহার করা হয়েছে
import { useGetProductByIdQuery, useUpdateProductMutation } from "../../../../store/api/productsApi";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  category: z.string().min(1, "Category is required."),
  imageUrl: z.string().url("A valid image URL is required."),
});

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams(); // URL থেকে id নিন
  
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });

  // ডেটা ফেচ এবং আপডেট করার জন্য RTK Query হুক
  const { data: productData, isLoading: isProductLoading, isError } = useGetProductByIdQuery(id, { skip: !id });
  const [updateProduct, { isLoading: isUpdating, isSuccess }] = useUpdateProductMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // react-hook-form থেকে reset ফাংশন
  } = useForm({
    resolver: zodResolver(productSchema),
  });
  
  // ডেটা লোড হওয়ার পর ফর্মের ফিল্ডগুলো পূরণ করুন
  useEffect(() => {
    if (productData?.product) {
      reset(productData.product);
    }
  }, [productData, reset]);

  const onSubmit = async (data) => {
    try {
      await updateProduct({ id, ...data }).unwrap();
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  };
  
  if (isSuccess) {
      router.push(`/products/${id}`);
      router.refresh(); // পেজ রিফ্রেশ করে নতুন ডেটা দেখান
  }

  if (status === "loading" || isProductLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (isError) {
      return <div className="text-center py-10 text-red-500">Failed to load product data.</div>
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-2xl space-y-8 rounded-2xl bg-white p-10 shadow-2xl dark:bg-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Product
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Form fields will be pre-filled */}
          <div>
            <label>Name</label>
            <input {...register("name")} className="mt-1 w-full rounded-lg border-gray-300 shadow-sm" />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label>Description</label>
            <textarea {...register("description")} rows="4" className="mt-1 w-full rounded-lg border-gray-300 shadow-sm"></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-6">
             <div>
                <label>Price ($)</label>
                <input type="number" step="0.01" {...register("price")} className="mt-1 w-full rounded-lg border-gray-300 shadow-sm" />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
             </div>
             <div>
                <label>Category</label>
                <input {...register("category")} className="mt-1 w-full rounded-lg border-gray-300 shadow-sm" />
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
             </div>
          </div>
          <div>
            <label>Image URL</label>
            <input type="url" {...register("imageUrl")} className="mt-1 w-full rounded-lg border-gray-300 shadow-sm" />
            {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isUpdating}
            className="flex w-full items-center justify-center rounded-lg bg-indigo-600 py-3 font-semibold text-white shadow-lg hover:bg-indigo-700 disabled:opacity-70"
          >
            {isUpdating && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isUpdating ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}