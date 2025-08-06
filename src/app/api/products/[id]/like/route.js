import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
import Product from '../../../../../models/Product';
import Notification from '../../../../../models/Notification';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/authOptions";

export async function POST(request, { params }) {
    const { id: productId } = params;

    if (!productId) {
        return NextResponse.json({ success: false, message: "Product ID is missing." }, { status: 400 });
    }
    
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Authentication required" }, { status: 401 });
        }
        const userId = session.user.id;

        await dbConnect();
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ message: "Product not found." }, { status: 404 });
        }

        const isLiked = product.likes.includes(userId);
        
        // ★★★ আসল সমাধান এখানে: লাইক রুটে কোনো request.json() নেই, কারণ এর কোনো প্রয়োজন নেই ★★★
        
        if (isLiked) {
            // যদি আগে থেকে লাইক করা থাকে, তাহলে লাইক তুলে নেওয়া হচ্ছে
            product.likes.pull(userId);
        } else {
            // যদি লাইক করা না থাকে, তাহলে লাইক যোগ করা হচ্ছে
            product.likes.addToSet(userId);
        }
        
        await product.save();

        // নোটিফিকেশন পাঠানোর লজিক
        if (!isLiked && product.createdBy.toString() !== userId) {
            await Notification.create({ recipient: product.createdBy, sender: userId, product: productId, type: 'like' });
        }

        return NextResponse.json({ success: true, message: "Like status updated.", likesCount: product.likes.length });
    } catch (error) {
        console.error("Like API Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}