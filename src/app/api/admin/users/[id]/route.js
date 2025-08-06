// src/app/api/admin/users/[id]/route.js (সংশোধিত এবং ফিচারসহ উন্নত)

import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
import User from '../../../../../models/User';
import Product from '../../../../../models/Product';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/authOptions";

// PUT: একটি নির্দিষ্ট ইউজারের রোল আপডেট করার জন্য
export async function PUT(request, { params }) {
    const { id } = params;

    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { role } = await request.json();
        if (!['user', 'admin'].includes(role)) {
            return NextResponse.json({ message: "Invalid role specified." }, { status: 400 });
        }

        await dbConnect();
        
        const userToUpdate = await User.findById(id);
        if (!userToUpdate) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }
        if (userToUpdate.role === 'superadmin') {
            return NextResponse.json({ message: "Cannot change the role of a superadmin." }, { status: 400 });
        }

        // ⭐ নতুন ফিচার: যদি কোনো 'admin'-কে 'user' বানানো হয়, তার প্রোডাক্টগুলো নিষ্ক্রিয় করে দেওয়া হবে।
        if (userToUpdate.role === 'admin' && role === 'user') {
            await Product.updateMany({ createdBy: id }, { isActive: false });
        }

        const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });

        return NextResponse.json({ success: true, message: "User role updated successfully.", data: updatedUser });
    } catch (error) {
        console.error("Error updating user role:", error);
        return NextResponse.json({ success: false, message: "Failed to update user role." }, { status: 500 });
    }
}

// DELETE: একটি নির্দিষ্ট ইউজার এবং তার সব প্রোডাক্ট ডিলিট করার জন্য
export async function DELETE(request, { params }) {
    const { id } = params;

    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await dbConnect();
        
        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }
        if (userToDelete.role === 'superadmin') {
            return NextResponse.json({ message: "Cannot delete a superadmin." }, { status: 400 });
        }

        // একটি ট্রানজেকশনে দুটি কাজ করা হচ্ছে, যাতে একটি ফেইল করলে অন্যটিও রোলব্যাক হয় (উন্নত ডিবি ব্যবহারের জন্য আদর্শ)
        await dbConnect();
        const dbSession = await Product.startSession();
        dbSession.startTransaction();
        try {
            await Product.deleteMany({ createdBy: id }, { session: dbSession });
            await User.findByIdAndDelete(id, { session: dbSession });
            await dbSession.commitTransaction();
        } catch(error) {
            await dbSession.abortTransaction();
            throw error;
        } finally {
            dbSession.endSession();
        }

        return NextResponse.json({ success: true, message: "User and their products have been successfully deleted." });

    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ success: false, message: "Failed to delete user." }, { status: 500 });
    }
}