import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const excludeId = searchParams.get("excludeId");
    const limit = parseInt(searchParams.get("limit")) || 4;

    if (!category) {
      return NextResponse.json({ success: false, data: [] });
    }

    await dbConnect();

    const products = await Product.find({
      category,
      stockStatus: "in-stock",
      _id: { $ne: excludeId }
    })
      .limit(limit)
      .select("name slug price images category stockStatus")
      .lean();

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
