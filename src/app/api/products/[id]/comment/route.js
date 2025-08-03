// src/app/api/products/[id]/comment/route.js

import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
import Product from '../../../../../models/Product';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/authOptions";

export async function POST(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    try {
        await dbConnect();
        
        // ★★★ সমাধান এখানে ★★★
        const { id: productId } = params;
        
        const { text } = await request.json();

        if (!text || text.trim() === '') {
            return NextResponse.json({ message: "Comment text cannot be empty." }, { status: 400 });
        }

        const comment = {
            text,
            user: session.user.id,
            createdAt: new Date(),
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $push: { comments: comment } },
            { new: true }
        ).populate('comments.user', 'name image');

        if (!updatedProduct) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true, 
            message: "Comment added successfully.",
            comments: updatedProduct.comments
        });
        
    } catch (error) {
        return NextResponse.json({ message: "Failed to add comment.", error: error.message }, { status: 500 });
    }
}