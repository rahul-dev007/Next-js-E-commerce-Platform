import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
import User from '../../../../../models/User';
import Product from '../../../../../models/Product';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/authOptions";

// PUT: একটি নির্দিষ্ট ইউজারের রোল আপডেট করার জন্য
export async function PUT(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'superadmin') {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    
    const { id } = params; // ★★★ সমাধান এখানে ★★★
    
    try {
        await dbConnect();
        const { role } = await request.json();

        if (!['user', 'admin'].includes(role)) {
            return NextResponse.json({ message: "Invalid role specified." }, { status: 400 });
        }

        const userToUpdate = await User.findById(id);
        if (userToUpdate.role === 'superadmin') {
            return NextResponse.json({ message: "Cannot change the role of a superadmin." }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });
        return NextResponse.json({ success: true, message: "User role updated.", data: updatedUser });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to update user role." }, { status: 500 });
    }
}


// DELETE: একটি নির্দিষ্ট ইউজার এবং তার সব প্রোডাক্ট ডিলিট করার জন্য
export async function DELETE(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'superadmin') {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = params; // ★★★ সমাধান এখানে ★★★

    try {
        await dbConnect();

        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        if (userToDelete.role === 'superadmin') {
            return NextResponse.json({ message: "Cannot delete a superadmin." }, { status: 400 });
        }

        // ইউজারের তৈরি করা সব প্রোডাক্ট ডিলিট করা হচ্ছে
        await Product.deleteMany({ createdBy: id });
        
        // ইউজারকে ডিলিট করা হচ্ছে
        await User.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "User and their products have been deleted." });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to delete user." }, { status: 500 });
    }
}