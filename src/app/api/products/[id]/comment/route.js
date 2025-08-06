// src/app/api/products/[id]/comment/route.js (নোটিফিকেশনসহ সম্পূর্ণ কোড)

import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
import Product from '../../../../../models/Product';
import Notification from '../../../../../models/Notification'; // ★★★ Notification মডেল ইম্পোর্ট করা হয়েছে ★★★
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/authOptions";

export async function POST(request, { params }) {
    const { id: productId } = params;

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { text } = await request.json();
        if (!text || text.trim() === '') {
            return NextResponse.json({ message: "Comment text cannot be empty." }, { status: 400 });
        }

        await dbConnect();
        
        const comment = {
            text,
            user: session.user.id,
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $push: { comments: { $each: [comment], $position: 0 } } },
            { new: true }
        ).populate('comments.user', 'name image');

        if (!updatedProduct) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        // ==========================================================
        // ===== ★★★ নোটিফিকেশন তৈরির লজিক (এখানে যুক্ত করা হয়েছে) ★★★ =====
        // ==========================================================
        // যদি ইউজার নিজের প্রোডাক্টে কমেন্ট না করে
        if (updatedProduct.createdBy.toString() !== session.user.id) {
            await Notification.create({
                recipient: updatedProduct.createdBy, // প্রোডাক্টের মালিক
                sender: session.user.id,             // যে কমেন্ট করেছে
                product: productId,
                type: 'comment'
            });
        }

        return NextResponse.json({
            success: true,
            message: "Comment added successfully.",
            comments: updatedProduct.comments
        });

    } catch (error) {
        console.error("Error adding comment:", error);
        return NextResponse.json({ message: "Failed to add comment.", error: error.message }, { status: 500 });
    }
}