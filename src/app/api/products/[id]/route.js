import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Product from '../../../../models/Product';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";

// ===================================
// ===== GET: একটি নির্দিষ্ট প্রোডাক্ট পাওয়ার জন্য =====
// ===================================
export async function GET(request, { params }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ success: false, message: "Product ID is missing." }, { status: 400 });
    }

    try {
        await dbConnect();
        const product = await Product.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
            .populate('createdBy', 'name image')
            .populate('comments.user', 'name image')
            .lean({ virtuals: true });

        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
        }

        const relatedProducts = await Product.find({ category: product.category, _id: { $ne: product._id } })
            .limit(4)
            .lean({ virtuals: true });
            
        return NextResponse.json({ success: true, data: { product, relatedProducts } });
    } catch (error) {
        console.error("Get Product by ID Error:", error);
        if (error.kind === 'ObjectId') {
            return NextResponse.json({ success: false, message: "Invalid Product ID." }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
    }
}

// ==========================================================
// ===== ★★★ আসল সমাধান: PATCH ফাংশনটি এখানে যোগ করা হয়েছে ★★★ =====
// ==========================================================
export async function PATCH(request, { params }) {
    const { id } = params;
    if (!id) {
        return NextResponse.json({ success: false, message: "Product ID is missing." }, { status: 400 });
    }

    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const body = await request.json();

        const productToUpdate = await Product.findById(id);
        if (!productToUpdate) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        const isOwner = productToUpdate.createdBy.toString() === session.user.id;
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

// ===========================================================
// ===== ★★★ আসল সমাধান: DELETE ফাংশনটি এখানে যোগ করা হয়েছে ★★★ =====
// ===========================================================
export async function DELETE(request, { params }) {
    const { id } = params;
    if (!id) {
        return NextResponse.json({ success: false, message: "Product ID is missing." }, { status: 400 });
    }

    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await dbConnect();

        const productToDelete = await Product.findById(id);
        if (!productToDelete) {
            return NextResponse.json({ message: "Product not found." }, { status: 404 });
        }

        const isOwner = productToDelete.createdBy.toString() === session.user.id;
        if (!isOwner && session.user.role !== 'superadmin') {
            return NextResponse.json({ message: "Forbidden: You are not authorized to delete this product." }, { status: 403 });
        }
        
        await Product.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Product deleted successfully." });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ success: false, message: "Failed to delete product." }, { status: 500 });
    }
}