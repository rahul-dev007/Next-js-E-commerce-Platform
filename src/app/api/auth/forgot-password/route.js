import { NextResponse } from 'next/server';
import crypto from 'crypto';
// ★★★ সঠিক পাথ: চারটি ../ ★★★
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import { sendPasswordResetEmail } from '../../../../lib/sendEmail';

export async function POST(request) {
    try {
        await dbConnect();
        const { email } = await request.json();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "If a user with that email exists, a reset link has been sent." });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
            
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        const emailResponse = await sendPasswordResetEmail(user.email, resetToken);
        
        if (!emailResponse.success) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return NextResponse.json({ message: "Failed to send email. Please try again." }, { status: 500 });
        }

        return NextResponse.json({ message: "Password reset link sent successfully." });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}