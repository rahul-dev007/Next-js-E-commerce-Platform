// src/app/api/userExists/route.js

import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import User from "../../../models/User";

export async function POST(req) {
    try {
        await connectDB();
        const { email } = await req.json();
        const user = await User.findOne({ email }).select("_id");
        return NextResponse.json({ user });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "An error occurred." }, { status: 500 });
    }
}