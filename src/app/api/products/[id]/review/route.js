import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
import Product from '../../../../../models/Product';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/authOptions";

export async function POST(request, { params }) {
    const { id: productId } = params;
    
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized. Please log in to leave a review." }, { status: 401 });
        }

        await dbConnect();
        const { rating, comment } = await request.json();
        
        // ইনপুট ভ্যালিডেশন
        if (!rating || !comment) {
             return NextResponse.json({ message: "Rating and comment are required." }, { status: 400 });
        }

        const product = await Product.findById(productId);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === session.user.id.toString()
            );
            if (alreadyReviewed) {
                return NextResponse.json({ message: "You have already reviewed this product." }, { status: 400 });
            }

            const review = {
                name: session.user.name,
                rating: Number(rating),
                comment,
                user: session.user.id,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            // গড় রেটিং গণনা এবং এক দশমিক স্থান পর্যন্ত রাউন্ড করা
            product.rating = (product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length).toFixed(1);

            await product.save();
            return NextResponse.json({ message: "Review added successfully!" }, { status: 201 });
        } else {
            return NextResponse.json({ message: "Product not found." }, { status: 404 });
        }
    } catch (error) {
        console.error("Review API Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}