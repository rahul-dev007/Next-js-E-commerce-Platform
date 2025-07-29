
// src/app/api/products/[id]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Product from '../../../../models/Product';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../api/auth/[...nextauth]/route';

// GET ফাংশন (আপনার কোডটি সঠিক ছিল, তাই অপরিবর্তিত)
export async function GET(request, { params }) {
    if (!params || !params.id) {
        return NextResponse.json({ success: false, message: "Product ID is missing." }, { status: 400 });
    }
    const { id } = params;
    
    try {
        await dbConnect();
        const product = await Product.findById(id).populate('createdBy', 'name image').populate('comments.user', 'name image').lean({ virtuals: true });
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
        }
        const relatedProducts = await Product.find({ category: product.category, _id: { $ne: product._id } }).limit(4).populate('createdBy', 'name image').lean({ virtuals: true });
        return NextResponse.json({ success: true, data: { product, relatedProducts } });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
    }
}

// ==========================================================
// ===== ★★★ আসল সমাধানটি এখানে (THIS IS THE REAL FIX) ★★★ =====
// ==========================================================
// PATCH: একটি নির্দিষ্ট প্রোডাক্ট আপডেট করার জন্য
export async function PATCH(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!params || !params.id) {
        return NextResponse.json({ success: false, message: "Product ID is missing." }, { status: 400 });
    }
    const { id } = params;

    try {
        await dbConnect();
        const body = await request.json();

        const productToUpdate = await Product.findById(id);
        if (!productToUpdate) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }
        
        // ★★★ মালিকানা যাচাই করার নির্ভুল পদ্ধতি ★★★
        // নিশ্চিত করা হচ্ছে যে createdBy ফিল্ডটি স্ট্রিং-এ পরিণত হয়েছে
        const isOwner = productToUpdate.createdBy.toString() === session.user.id.toString();
        
        // যদি ইউজার মালিক না হয় এবং সে সুপারঅ্যাডমিনও না হয়, তাহলে এরর
        if (!isOwner && session.user.role !== 'superadmin') {
            return NextResponse.json({ message: "You are not authorized to edit this product." }, { status: 403 });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        return NextResponse.json({ success: true, message: "Product updated successfully.", data: updatedProduct });

    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ success: false, message: "Failed to update product." }, { status: 500 });
    }
}

// DELETE ফাংশন (এখানেও একই পরিবর্তন করা হয়েছে)
export async function DELETE(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!params || !params.id) {
        return NextResponse.json({ success: false, message: "Product ID is missing." }, { status: 400 });
    }
    const { id } = params;
    
    try {
        await dbConnect();

        const productToDelete = await Product.findById(id);
        if (!productToDelete) {
            return NextResponse.json({ message: "Product not found." }, { status: 404 });
        }

        const isOwner = productToDelete.createdBy.toString() === session.user.id.toString();
        if (!isOwner && session.user.role !== 'superadmin') {
            return NextResponse.json({ message: "Forbidden: You are not authorized to delete this product." }, { status: 403 });
        }
        
        await Product.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Product deleted successfully." });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to delete product." }, { status: 500 });
    }
}