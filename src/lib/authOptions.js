// src/lib/authOptions.js (তোমার দেওয়া কোড)

import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./db"; // ★★★ এই পাথটিই ব্যবহার করা হবে
import User from "../models/User"; // ★★★ এই পাথটিও ব্যবহার করা হবে

export const authOptions = {
    // ... বাকি সব কোড অপরিবর্তিত থাকবে যা তুমি দিয়েছিলে ...
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
                        await User.create({ name: user.name, email: user.email, image: user.image, role: 'user' });
                    }
                } catch (error) {
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id || user._id.toString();
                token.role = user.role;
                token.name = user.name;
                token.email = user.email;
                token.image = user.image;
            }
            if (trigger === "update" && session) {
                token.name = session.user.name;
                token.image = session.user.image;
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