// src/app/api/admin/users/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import connectDB from "../../../../lib/db";
import User from "../../../../models/User";

export async function GET(request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'superadmin') {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    try {
        await connectDB();
        // নিজের অ্যাকাউন্ট বাদে বাকি সব ইউজারকে খোঁজা হচ্ছে
        const users = await User.find({ _id: { $ne: session.user.id } }).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: users // ★★★ ডেটা একটি `data` প্রপার্টির ভেতরে পাঠানো হচ্ছে ★★★
        });

    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}