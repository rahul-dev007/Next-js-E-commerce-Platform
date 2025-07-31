// src/app/api/profile/update/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';

export async function PATCH(request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        await dbConnect();
        // ★★★ এখন আমরা JSON ডেটা গ্রহণ করছি, FormData নয় ★★★
        const { name, image } = await request.json();

        if (!name || name.trim().length < 3) {
            return NextResponse.json({ message: "Name must be at least 3 characters." }, { status: 400 });
        }

        const userId = session.user.id;
        const updateData = { name: name.trim() };

        // যদি নতুন ছবির URL থাকে, তাহলে সেটি যোগ করা হবে
        if (image) {
            updateData.image = image;
        }

        // ডেটাবেসে আপডেট করা হচ্ছে
        await User.findByIdAndUpdate(userId, updateData);
        
        const responseData = { 
            success: true, 
            message: "Profile updated successfully.", 
            user: updateData
        };

        return NextResponse.json(responseData);

    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ message: "Server error." }, { status: 500 });
    }
}