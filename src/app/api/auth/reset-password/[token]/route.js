import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
// ★★★ সঠিক পাথ: চারটি ../ ★★★
import dbConnect from '../../../../../lib/db';
import User from '../../../../../models/User';

export const runtime = 'nodejs';

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const { token } = await params;
        const { password } = await request.json();
        
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
            
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json({ message: "Invalid or expired token. Please try again." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return NextResponse.json({ success: true, message: "Password has been reset successfully." });

    } catch (error) {
        console.error("Reset Password Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}