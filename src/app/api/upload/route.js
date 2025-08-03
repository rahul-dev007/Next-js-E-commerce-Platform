// src/app/api/upload/route.js

import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    // ★★★ নতুন: ফ্রন্টএন্ড থেকে ফোল্ডারের নাম নেওয়া হচ্ছে ★★★
    const folderName = formData.get('folderName') || 'my-auth-app-products'; // ডিফল্ট ফোল্ডার

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const mimeType = file.type;
    const encoding = 'base64';
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = 'data:' + mimeType + ';' + encoding + ',' + base64Data;
    
    // Cloudinary-তে আপলোড করা হচ্ছে
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: folderName, // ★★★ ডাইনামিক ফোল্ডার নাম ব্যবহার করা হচ্ছে ★★★
      public_id: `${Date.now()}`, 
      resource_type: 'auto'
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Image uploaded successfully",
      url: result.secure_url 
    }, { status: 200 });

  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ message: "Error uploading image", error: error.message }, { status: 500 });
  }
}