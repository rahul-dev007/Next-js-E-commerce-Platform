// src/app/api/products/[id]/like/route.js

import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db'; // তোমার আসল Path
import Product from '../../../../../models/Product'; // তোমার আসল Path
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/authOptions"; // তোমার আসল Path

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Authentication required" }, { status: 401 });
  }

  // ★★★★★ আসল এবং একমাত্র পরিবর্তনটি এখানে ★★★★★
  // Next.js-এর নতুন নিয়ম অনুযায়ী, আমরা সরাসরি params থেকে id নিচ্ছি
  const { id: productId } = params;

  if (!productId) {
      return NextResponse.json({ success: false, message: "Product ID is missing." }, { status: 400 });
  }
  
  const userId = session.user.id;

  try {
    await dbConnect();

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    const isLiked = product.likes.includes(userId);

    if (isLiked) {
      // যদি আগে থেকে লাইক করা থাকে, তাহলে লাইক তুলে নেওয়া হচ্ছে
      product.likes.pull(userId);
    } else {
      // যদি লাইক করা না থাকে, তাহলে লাইক যোগ করা হচ্ছে
      product.likes.addToSet(userId);
    }

    await product.save(); // পরিবর্তনটি ডেটাবেসে সেভ করা হচ্ছে

    return NextResponse.json({ 
      success: true, 
      message: "Like status updated successfully.",
      // ফ্রন্টএন্ডের সুবিধার জন্য আমরা নতুন লাইক সংখ্যাও পাঠিয়ে দিতে পারি
      likesCount: product.likes.length 
    });

  } catch (error) {
    console.error("Error in like API:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}