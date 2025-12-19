import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Optional: protect admin route
    // if (!session || !session.user || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    await dbConnect();

    /**
     * Aggregate customers from orders
     */
    const customers = await Order.aggregate([
      {
        $group: {
          _id: '$email',
          name: { $first: '$shippingAddress.name' },
          email: { $first: '$email' },
          orders: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' },
          lastOrder: { $max: '$createdAt' },
          createdAt: { $min: '$createdAt' },
        },
      },
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' },
          name: 1,
          email: 1,
          orders: 1,
          totalSpent: 1,
          lastOrder: {
            $dateToString: { format: '%Y-%m-%d', date: '$lastOrder' },
          },
          createdAt: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          status: {
            $cond: [{ $gt: ['$orders', 0] }, 'active', 'inactive'],
          },
        },
      },
      { $sort: { lastOrder: -1 } },
    ]);

    return NextResponse.json({ customers }, { status: 200 });
  } catch (err) {
    console.error('ADMIN CUSTOMERS ERROR:', err);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
