// src/app/api/checkout_sessions/route.js

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Stripe ক্লায়েন্ট ইনিশিয়ালাইজ করা হচ্ছে
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const { items, customerEmail } = await request.json();

        // ফ্রন্টএন্ড থেকে আসা Cart আইটেমগুলোকে Stripe-এর ফরম্যাটে সাজানো হচ্ছে
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'usd', // আপনি চাইলে এটি পরিবর্তন করতে পারেন
                product_data: {
                    name: item.name,
                    images: [item.imageUrl], // Stripe-কে ছবির URL দেওয়া হচ্ছে
                },
                unit_amount: Math.round(item.price * 100), // Stripe পয়সায় হিসাব করে, তাই 100 দিয়ে গুণ
            },
            quantity: item.quantity,
        }));

        // Stripe Checkout Session তৈরি করা হচ্ছে
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            customer_email: customerEmail, // ইউজারের ইমেইল যোগ করা হচ্ছে
            // পেমেন্ট সফল বা বাতিল হলে ইউজারকে কোন পেজে পাঠানো হবে
            success_url: `${request.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.get('origin')}/cart`,
        });

        // সফলভাবে সেশন তৈরি হলে সেশনের আইডি ফ্রন্টএন্ডে পাঠানো হচ্ছে
        return NextResponse.json({ success: true, id: session.id });

    } catch (error) {
        console.error("Error creating Stripe checkout session:", error);
        return NextResponse.json({ success: false, message: "Failed to create checkout session.", error: error.message }, { status: 500 });
    }
}