// src/app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "../../../../lib/db";
import User from "../../../../models/User";

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
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) { return null; }
                try {
                    await connectDB();
                    const user = await User.findOne({ email: credentials.email });
                    if (!user || !user.password) { return null; }
                    const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
                    if (!passwordsMatch) { return null; }
                    return user;
                } catch (error) {
                    console.log("Error in authorize:", error);
                    return null;
                }
            }
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === 'google' || account.provider === 'github') {
                await connectDB();
                try {
                    const existingUser = await User.findOne({ email: user.email });
                    if (!existingUser) {
                        // ★★★ নতুন ইউজার তৈরি হওয়ার পর তার ডেটা user অবজেক্টে যোগ করা হচ্ছে ★★★
                        const newUser = await User.create({
                            name: user.name,
                            email: user.email,
                            image: user.image,
                        });
                        // signIn callback থেকে user অবজেক্ট পরিবর্তন করা যায় না,
                        // কিন্তু jwt callback এটি হ্যান্ডেল করবে।
                    }
                } catch (error) {
                    console.error("Error in signIn callback:", error);
                    return false;
                }
            }
            return true;
        },

        // ==========================================================
        // ===== ★★★ আসল সমাধানটি এখানে (THIS IS THE REAL FIX) ★★★ =====
        // ==========================================================
        async jwt({ token, user, trigger, session }) { 
            // `user` অবজেক্টটি authorize বা OAuth থেকে প্রথমবার লগইনের সময় আসে
            if (user) {
                await connectDB();
                // ডেটাবেস থেকে সর্বশেষ ইউজার তথ্য আনা হচ্ছে
                const dbUser = await User.findOne({ email: user.email });
                
                if (dbUser) {
                    // ★★★ টোকেনে এখন সবসময় MongoDB-র আসল _id থাকবে ★★★
                    token.id = dbUser._id.toString();
                    token.role = dbUser.role; // ডেটাবেস থেকে রোল আনা হচ্ছে
                    token.name = dbUser.name;
                    token.email = dbUser.email;
                    token.image = dbUser.image;
                }
            }

            if (trigger === "update" && session) {
                if (session.name) {
                    token.name = session.name;
                }
                if (session.image) {
                    token.image = session.image;
                }
            }

            return token;
        },

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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };