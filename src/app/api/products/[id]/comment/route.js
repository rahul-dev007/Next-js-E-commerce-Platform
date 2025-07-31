// src/app/api/products/[id]/comment/route.js

import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
import Product from '../../../../../models/Product';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/authOptions";

export async function POST(request, { params }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Please log in to add a comment." }, { status: 401 });
    }

    try {
        await dbConnect();
        const productId = params.id;
        const { text } = await request.json();

        if (!text || text.trim() === '') {
            return NextResponse.json({ message: "Comment text cannot be empty." }, { status: 400 });
        }

        const newComment = {
            user: session.user.id,
            text: text,
            createdAt: new Date(),
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $push: { comments: { $each: [newComment], $position: 0 } } }, // নতুন কমেন্ট সবার উপরে দেখানোর জন্য
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ message: "Product not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Comment added successfully." });

    } catch (error) {
        console.error("Error adding comment:", error);
        return NextResponse.json({ message: "Server error while adding comment." }, { status: 500 });
    }
}