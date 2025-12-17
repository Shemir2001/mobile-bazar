// API Route: /api/products/track-view/route.js
// This endpoint tracks when a user views a product

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function POST(request) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Increment view count for the product
    const product = await Product.findByIdAndUpdate(
      productId,
      { 
        $inc: { viewCount: 1 },
        $set: { lastViewedAt: new Date() }
      },
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      viewCount: product.viewCount,
      message: 'View tracked successfully'
    });

  } catch (error) {
    console.error('Error tracking product view:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to track view' },
      { status: 500 }
    );
  }
}