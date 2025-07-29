import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// Cloudinary কনফিগার করা হচ্ছে
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export async function POST(request) {
  const session = await getServerSession(authOptions);

  // শুধুমাত্র লগইন করা ব্যবহারকারীই ইমেজ আপলোড করতে পারবে
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    // ফাইলটিকে buffer-এ রূপান্তর করা হচ্ছে
    const fileBuffer = await file.arrayBuffer();
    const mimeType = file.type;
    const encoding = 'base64';
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = 'data:' + mimeType + ';' + encoding + ',' + base64Data;
    
    // Cloudinary-তে আপলোড করা হচ্ছে
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: 'my-auth-app-products', // Cloudinary-তে এই ফোল্ডারে ছবিগুলো জমা হবে
      public_id: `${Date.now()}-${file.name.split('.')[0]}`, // ফাইলের একটি ইউনিক নাম দেওয়া হচ্ছে
      resource_type: 'auto'
    });
    
    // সফল হলে, নিরাপদ URL-টি ফেরত পাঠানো হচ্ছে
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