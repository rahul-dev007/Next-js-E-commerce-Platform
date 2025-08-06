import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Notification from '../../../models/Notification';
import Product from '../../../models/Product'; // ★★★ আসল এবং একমাত্র সমাধান এখানে ★★★
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";

// GET: লগইন করা ইউজারের নোটিফিকেশন পাওয়ার জন্য (অপটিমাইজড)
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        await dbConnect();
        
        const [notifications, unreadCount] = await Promise.all([
            Notification.find({ recipient: session.user.id })
                .limit(20)
                .populate('sender', 'name image')
                .populate('product', 'name imageUrl') // এখন এটি সঠিকভাবে কাজ করবে
                .sort({ createdAt: -1 })
                .lean(),
            Notification.countDocuments({ recipient: session.user.id, read: false })
        ]);
        
        return NextResponse.json({
            success: true,
            notifications,
            unreadCount
        });

    } catch (error) {
        console.error("Error fetching notifications:", error);
        return new Response(JSON.stringify({ success: false, message: "Failed to fetch notifications." }), { status: 500, headers: { 'Content-Type': 'application/json' }});
    }
}

// POST: সব নোটিফিকেশন পড়া হিসেবে মার্ক করার জন্য
export async function POST(request) {
     try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        await dbConnect();

        await Notification.updateMany(
            { recipient: session.user.id, read: false },
            { $set: { read: true } }
        );
        
        return NextResponse.json({
            success: true,
            message: "All notifications marked as read."
        });

    } catch (error) {
        console.error("Error marking notifications as read:", error);
        return new Response(JSON.stringify({ success: false, message: "Failed to mark notifications as read." }), { status: 500, headers: { 'Content-Type': 'application/json' }});
    }
}