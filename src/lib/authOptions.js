// src/lib/authOptions.js (সম্পূর্ণ এবং ফিক্সড সংস্করণ)

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
                    console.error("Authorize Error:", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        // ★★★★★ প্রধান সমাধানটি এখানে ★★★★★
        async signIn({ user, account }) {
            if (account.provider === "google" || account.provider === "github") {
                await dbConnect();
                try {
                    let existingUser = await User.findOne({ email: user.email });

                    if (!existingUser) {
                        // যখন নতুন সোশ্যাল ইউজার তৈরি হচ্ছে
                        const newUser = await User.create({ 
                            name: user.name, 
                            email: user.email, 
                            image: user.image, 
                            role: 'user' // ডিফল্ট রোল
                        });
                        // Social ID-কে MongoDB-র _id দিয়ে ওভাররাইট করা হচ্ছে
                        user.id = newUser._id.toString();
                    } else {
                        // যদি ইউজার আগে থেকেই থাকে, তার MongoDB _id ব্যবহার করা হচ্ছে
                        user.id = existingUser._id.toString();
                    }
                } catch (error) {
                    console.error("SignIn Callback Error:", error);
                    return false; // কোনো সমস্যা হলে লগইন ব্যর্থ হবে
                }
            }
            // CredentialsProvider বা অন্যান্য ক্ষেত্রে true রিটার্ন করা
            return true;
        },

        async jwt({ token, user, trigger, session }) {
            if (user) {
                // signIn থেকে আসা user অবজেক্ট ব্যবহার করা হচ্ছে, যেখানে সঠিক MongoDB ID আছে
                token.id = user.id;

                // ডেটাবেস থেকে সর্বশেষ রোল আনা হচ্ছে (ঐচ্ছিক কিন্তু ভালো অভ্যাস)
                await dbConnect();
                const dbUser = await User.findById(token.id);
                if(dbUser) {
                    token.role = dbUser.role;
                    token.name = dbUser.name;
                    token.email = dbUser.email;
                    token.image = dbUser.image;
                }
            }
            
            // সেশন আপডেট করার জন্য (যেমন প্রোফাইল এডিট)
            if (trigger === "update" && session) {
                token.name = session.user.name;
                token.image = session.user.image;
            }
            
            return token;
        },

        async session({ session, token }) {
            if (token && session.user) {
                // JWT থেকে পাওয়া সঠিক MongoDB ID সেশনে যোগ করা হচ্ছে
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