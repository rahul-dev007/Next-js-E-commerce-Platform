// src/app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/authOptions"; // ★★★ নতুন পাথ থেকে ইম্পোর্ট করা হচ্ছে ★★★

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };