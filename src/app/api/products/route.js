// src/app/api/products/route.js

import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";

// GET: সব প্রোডাক্টের লিস্ট আনার জন্য
export async function GET(request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(request.url);
        
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '8', 10);
        const search = searchParams.get('search') || '';
        const scope = searchParams.get('scope'); 
        
        const skip = (page - 1) * limit;
        let query = { name: { $regex: search, $options: 'i' } };

        if (scope === 'me') {
            if (!session || !session.user) {
                return NextResponse.json({ message: "Authentication required to view your products." }, { status: 401 });
            }
            query.createdBy = session.user.id; 
        }
        
        const productsQuery = Product.find(query)
            .populate('createdBy', 'name image')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const products = await productsQuery.exec();
        const productsWithVirtuals = products.map(p => p.toObject({ virtuals: true }));
        const totalProducts = await Product.countDocuments(query);
        
        const totalPages = Math.ceil(totalProducts / limit);

        return NextResponse.json({
            success: true,
            data: {
                products: productsWithVirtuals,
                pagination: { currentPage: page, totalPages, totalProducts, limit }
            }
        });

    } catch (error) {
        console.error("Error fetching products list:", error);
        return NextResponse.json({ success: false, message: "An error occurred while fetching products." }, { status: 500 });
    }
}

// POST: নতুন প্রোডাক্ট তৈরি করার জন্য
export async function POST(request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ success: false, message: "Unauthorized: Please log in." }, { status: 401 });
    }
    if (session.user.role !== 'admin' && session.user.role !== 'superadmin') {
        return NextResponse.json({ success: false, message: "Forbidden: You are not authorized to create products." }, { status: 403 });
    }

    try {
        await dbConnect();
        const body = await request.json();
        const { name, description, price, category, imageUrl } = body;

        if (!name || !description || !price || !category || !imageUrl) {
            return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 });
        }

        const newProduct = await Product.create({ ...body, createdBy: session.user.id });

        return NextResponse.json(
            { success: true, message: "Product created successfully.", product: newProduct },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { success: false, message: "An error occurred while creating the product.", error: error.message },
            { status: 500 }
        );
    }
}