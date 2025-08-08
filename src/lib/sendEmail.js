// src/lib/sendEmail.js (চূড়ান্ত এবং সঠিক সংস্করণ)

import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import ResetPasswordEmail from '../emails/ResetPasswordEmail';

export const sendPasswordResetEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        secure: false, 
        auth: {
            user: process.env.EMAIL_SERVER_USER, 
            pass: process.env.EMAIL_SERVER_PASSWORD,
        },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;
    
    // ★★★ এটাই আসল এবং চূড়ান্ত সমাধান ★★★
    // চূড়ান্ত HTML স্ট্রিংটি পাওয়ার জন্য আমরা 'render' ফাংশনটিকে 'await' করছি।
    const emailHtml = await render(<ResetPasswordEmail resetUrl={resetUrl} />);

    const options = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Reset Your MyShop Password',
        html: emailHtml, // এখন, এটি একটি স্ট্রিং, কোনো Promise নয়
    };

    try {
        console.log(`Attempting to send email FROM: ${process.env.EMAIL_FROM} TO: ${email}`);
        const info = await transporter.sendMail(options);
        console.log("Email sent successfully! Message ID:", info.messageId);
        return { success: true, data: info };
    } catch (error) {
        console.error("!!! NODEMAILER/BREVO ERROR !!!:", error);
        return { success: false, error };
    }
};