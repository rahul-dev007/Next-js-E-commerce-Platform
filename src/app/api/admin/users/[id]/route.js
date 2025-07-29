// src/app/api/admin/users/[id]/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import connectDB from "../../../../../lib/db";
import User from "../../../../../models/User";
import Product from "../../../../../models/Product"; // ★★★ Product মডেল ইম্পোর্ট করা হয়েছে ★★★

// PUT: একজন ব্যবহারকারীর রোল আপডেট করার জন্য (আপনার কোডটি সঠিক ছিল, আমি শুধু params ঠিক করেছি)
export async function PUT(request, { params }) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'superadmin') {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = params;

    try {
        await connectDB();
        const { role } = await request.json();
        
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return NextResponse.json({ message: "Invalid User ID format" }, { status: 400 });
        }
        if (!role || !['user', 'admin'].includes(role)) {
            return NextResponse.json({ message: "Invalid role specified" }, { status: 400 });
        }

        const userToUpdate = await User.findById(id);
        if (!userToUpdate) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        
        if (userToUpdate.role === 'superadmin') {
            return NextResponse.json({ message: "Cannot change the role of a superadmin." }, { status: 400 });
        }

        userToUpdate.role = role;
        await userToUpdate.save();

        return NextResponse.json({ success: true, message: "User role updated successfully.", user: userToUpdate });

    } catch (error) {
        console.error("Error updating user role:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// ★★★ DELETE: একজন ব্যবহারকারী এবং তার সব প্রোডাক্ট ডিলিট করার জন্য ★★★
export async function DELETE(request, { params }) {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'superadmin') {
        return NextResponse.json({ message: "Forbidden: You are not authorized." }, { status: 403 });
    }
    
    const { id } = params;

    try {
        await connectDB();
        
        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        if (userToDelete.role === 'superadmin') {
            return NextResponse.json({ message: "Cannot delete a superadmin." }, { status: 400 });
        }

        // ধাপ ১: এই ইউজারের তৈরি করা সব প্রোডাক্ট ডিলিট করা
        await Product.deleteMany({ createdBy: id });

        // ধাপ ২: ইউজারকে ডিলিট করা
        await User.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "User and all their products have been deleted." });

    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ message: "Server error while deleting user." }, { status: 500 });
    }
}