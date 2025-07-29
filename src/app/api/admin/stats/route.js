// src/app/api/admin/stats/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "../../../../lib/db";
import User from "../../../../models/User";
import Product from "../../../../models/Product";
// Order মডেল ইম্পোর্ট করতে হবে (ভবিষ্যতের জন্য)
// import Order from "../../../../models/Order";

export async function GET(request) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    try {
        await dbConnect();
        const userRole = session.user.role;
        const userId = session.user.id;

        // গত ৭ দিনের ডেটা আনার জন্য তারিখ সেট করা
        const today = new Date();
        const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        let stats = {};
        let salesData = []; // চার্টের জন্য

        // ডেমো সেলস ডেটা (যেহেতু Order মডেল নেই)
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
            salesData.push({
                name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                sales: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
            });
        }
        
        if (userRole === 'superadmin') {
            const [totalUsers, totalProducts, totalRevenue] = await Promise.all([
                User.countDocuments(),
                Product.countDocuments(),
                // Order.aggregate([...]), // ভবিষ্যতে মোট আয় গণনা করা হবে
                Promise.resolve(12500) // ডেমো রেভিনিউ
            ]);
            stats = { totalUsers, totalProducts, totalRevenue, salesData };
        } else if (userRole === 'admin') {
            const [myTotalProducts, myTotalRevenue] = await Promise.all([
                 Product.countDocuments({ createdBy: userId }),
                 Promise.resolve(2350) // ডেমো রেভিনিউ
            ]);
            stats = { myTotalProducts, myTotalRevenue, salesData };
        }

        return NextResponse.json({ success: true, stats });

    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}