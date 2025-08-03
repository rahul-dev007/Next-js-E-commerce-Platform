// src/lib/authOptions.js (Your Code, Corrected)

import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./db";
import User from "../models/User";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                try {
                    await dbConnect();
                    const user = await User.findOne({ email: credentials.email });
                    if (!user || !user.password) return null;
                    const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
                    if (!passwordsMatch) return null;
                    return user;
                } catch (error) {
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === "google" || account.provider === "github") {
                await dbConnect();
                try {
                    const existingUser = await User.findOne({ email: user.email });
                    if (!existingUser) {
                        await User.create({ name: user.name, email: user.email, image: user.image });
                    }
                } catch (error) {
                    return false;
                }
            }
            return true;
        },

        // ★★★★★ আসল এবং ফাইনাল সমাধানটি এখানে ★★★★★
        async jwt({ token, user, trigger, session }) {
            // যখন ইউজার প্রথমবার লগইন করে
            if (user) {
                // তোমার কোড অনুযায়ী, আমরা ডেটাবেস থেকে লেটেস্ট তথ্য নিচ্ছি, যা খুবই ভালো
                await dbConnect();

                // এখানে User.findOne ব্যবহার না করে সরাসরি user অবজেক্ট ব্যবহার করা ভালো
                // কারণ signIn callback-এ user অবজেক্টটি তৈরি বা খুঁজে পাওয়া যায়
                token.id = user.id || user._id.toString(); // বিভিন্ন provider থেকে id ভিন্নভাবে আসতে পারে
                token.role = user.role;
                token.name = user.name;
                token.email = user.email;
                token.image = user.image;
            }

            // যখন ফ্রন্টএন্ড থেকে update() ফাংশন কল করা হয়
            if (trigger === "update" && session) {
                console.log("JWT callback received update trigger with session:", session);

                // session অবজেক্টের user প্রপার্টি থেকে নতুন ডেটা নিতে হবে
                // এবং সেটা টোকেনের ভেতর আপডেট করতে হবে
                token.name = session.user.name;
                token.image = session.user.image;
                
                // NextAuth 'picture' নামে একটি প্রপার্টি ব্যবহার করে, তাই এটিও আপডেট করা ভালো
                token.picture = session.user.image; 
            }

            return token;
        },
        // ★★★★★ সমাধান শেষ ★★★★★

        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.image;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};