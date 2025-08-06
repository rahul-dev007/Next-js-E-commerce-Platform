// src/app/api/admin/users/route.js (চূড়ান্ত সঠিক পাথ সহ)

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
// ★★★ সঠিক পাথ: চার লেভেল উপরে ★★★
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import { authOptions } from '../../../../lib/authOptions';

export async function GET(request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'superadmin') {
        return NextResponse.json(
            { success: false, message: 'Unauthorized: Access is restricted to superadmins.' },
            { status: 401 }
        );
    }

    try {
        await dbConnect();
        const users = await User.find({}).select('-password').lean();
        
        return NextResponse.json(
            { success: true, data: users },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { success: false, message: 'An internal server error occurred.' },
            { status: 500 }
        );
    }
}