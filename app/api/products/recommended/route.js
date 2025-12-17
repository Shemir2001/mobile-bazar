// API Route: /api/products/recommended/route.js
// This endpoint returns products sorted by popularity (views + purchases)

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 4;

    await dbConnect();

    // Get all products with view counts
    const products = await Product.find({ 
      stockStatus: 'in-stock' 
    })
      .select('name slug price images category viewCount purchaseCount stockStatus')
      .lean();

    // Calculate purchase count for each product from orders
    const productPurchaseCounts = {};
    
    try {
      const orders = await Order.find({ status: { $in: ['pending', 'processing', 'completed'] } })
        .select('items')
        .lean();

      orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            const productId = item.productId || item.product;
            if (productId) {
              const id = productId.toString();
              productPurchaseCounts[id] = (productPurchaseCounts[id] || 0) + (item.quantity || 1);
            }
          });
        }
      });
    } catch (orderError) {
      console.log('Could not fetch order data:', orderError.message);
      // Continue without purchase data
    }

    // Add purchase counts and calculate popularity score
    const productsWithStats = products.map(product => {
      const productId = product._id.toString();
      const purchaseCount = productPurchaseCounts[productId] || 0;
      const viewCount = product.viewCount || 0;
      
      // Popularity score: views + (purchases * 5) - giving more weight to purchases
      const popularityScore = viewCount + (purchaseCount * 5);

      return {
        ...product,
        _id: product._id.toString(),
        purchaseCount,
        viewCount,
        popularityScore
      };
    });

    // Sort by popularity score (highest first)
    productsWithStats.sort((a, b) => b.popularityScore - a.popularityScore);

    // Return top products
    const recommendedProducts = productsWithStats.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: recommendedProducts,
      total: recommendedProducts.length
    });

  } catch (error) {
    console.error('Error fetching recommended products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch recommended products', error: error.message },
      { status: 500 }
    );
  }
}