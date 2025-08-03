// src/app/api/profile/update/route.js (DEBUGGING VERSION)

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import connectDB from "../../../../lib/db"; // ★★★★★ আপনার আসল ফাইল Path ব্যবহার করা হয়েছে
import User from "../../../../models/User";

export async function PATCH(request) {
  console.log("\n--- UPDATE PROFILE API CALLED ---"); // নতুন: এপিআই কল হয়েছে কি না, তা দেখার জন্য

  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("Unauthorized: No session found.");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  console.log("Session found for user:", session.user.email);

  try {
    const body = await request.json();
    console.log("Received body for update:", body); // নতুন: কী ডেটা আসছে, তা দেখার জন্য

    const { name, image } = body;

    if (!name && !image) {
      console.log("Validation Error: No update data provided.");
      return NextResponse.json({ message: "No update data provided" }, { status: 400 });
    }

    await connectDB();
    console.log("MongoDB connected for profile update.");

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (image) fieldsToUpdate.image = image;

    console.log("Fields to update in DB:", fieldsToUpdate); // নতুন: কী আপডেট করতে যাচ্ছি, তা দেখার জন্য

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: fieldsToUpdate },
      { new: true } // এই অপশনটি নিশ্চিত করে যে আমরা আপডেটেড ডকুমেন্টটি ফেরত পাব
    ).select('-password');

    // ★★★★★ সবচেয়ে গুরুত্বপূর্ণ ডিবাগিং লাইন ★★★★★
    console.log("User data after findOneAndUpdate attempt:", updatedUser);

    if (!updatedUser) {
      console.log("DB Error: User not found with email:", session.user.email);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log("--- UPDATE SUCCESSFUL, SENDING RESPONSE ---");
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        role: updatedUser.role,
      }
    }, { status: 200 });

  } catch (error) {
    console.error("!!! CRITICAL ERROR in profile update:", error);
    return NextResponse.json({ message: "Error updating profile", error: error.message }, { status: 500 });
  }
}