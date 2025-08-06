// src/lib/authOptions.js (DEBUGGING VERSION)

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
            // ... তোমার CredentialsProvider-এর কোড অপরিবর্তিত ...
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
            // ... তোমার signIn callback অপরিবর্তিত ...
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
        async jwt({ token, user, trigger, session }) {
            // ... তোমার jwt callback অপরিবর্তিত ...
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
                token.picture = session.user.image;
            }
            return token;
        },
        async session({ session, token }) {
            // ... তোমার session callback অপরিবর্তিত ...
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