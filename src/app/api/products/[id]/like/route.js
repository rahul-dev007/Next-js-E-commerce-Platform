// src/app/api/products/[id]/like/route.js

import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
import Product from '../../../../../models/Product';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/authOptions";

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Authentication required to perform this action." }, { status: 401 });
  }

  if (!params || !params.id) {
      return NextResponse.json({ success: false, message: "Product ID is missing." }, { status: 400 });
  }
  const productId = params.id;
  const userId = session.user.id;

  try {
    await dbConnect();

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    const isLiked = product.likes.includes(userId);

    if (isLiked) {
      await Product.updateOne({ _id: productId }, { $pull: { likes: userId } });
    } else {
      await Product.updateOne({ _id: productId }, { $addToSet: { likes: userId } });
    }

    return NextResponse.json({ success: true, message: "Like status updated successfully." });

  } catch (error) {
    console.error("Error in like API:", error);
    return NextResponse.json({ message: "An internal server error occurred.", error: error.message }, { status: 500 });
  }
}