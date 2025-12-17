import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Review from "@/models/Reviews";
import Product from "@/models/Product";

// GET - Fetch reviews for a product
export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(req) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { productId, name, email, rating, comment } = body;

    // Validation
    if (!productId || !name || !email || !rating || !comment) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // For guest reviews, store name and email directly
    const review = await Review.create({
      product: productId,
      name,
      email,
      rating: Number(rating),
      comment: comment.trim()
    });

    // Update product rating (optional - calculate average)
    const allReviews = await Review.find({ product: productId });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    
    await Product.findByIdAndUpdate(productId, {
      rating: avgRating.toFixed(1),
      reviewCount: allReviews.length
    });

    return NextResponse.json(
      { message: "Review submitted successfully", review },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { message: "Failed to submit review" },
      { status: 500 }
    );
  }
}