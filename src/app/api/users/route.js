import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import connectDB from "../../../lib/db";
import User from "../../../models/User";

// GET: সব ইউজারের তালিকা পাওয়ার জন্য (শুধুমাত্র Admin/Super Admin)
export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
    return NextResponse.json({ message: "Forbidden: Access is restricted to admins." }, { status: 403 });
  }

  try {
    await connectDB();
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    return NextResponse.json({ success: true, users });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}