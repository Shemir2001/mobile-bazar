// // app/api/orders/my/route.js
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // <- change path if yours is different
// import dbConnect from '@/lib/db'; // <- change to your actual db connect helper
// import Order from '@/models/Order';

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || !session.user) {
//       return NextResponse.json(
//         { error: 'Not authenticated' },
//         { status: 401 }
//       );
//     }

//     // If your session stores ID as session.user._id instead of id, change here
//     const userId = session.user.id || session.user._id;

//     await dbConnect();

//     const orders = await Order.find({ user: userId })
//       .sort({ createdAt: -1 })
//       .lean();

//     return NextResponse.json({ orders }, { status: 200 });
//   } catch (err) {
//     console.error('Error fetching user orders:', err);
//     return NextResponse.json(
//       { error: 'Failed to fetch orders' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const session = await getServerSession(authOptions);
//     const body = await req.json();

//     const {
//       items,
//       customer,
//       total,
//       paymentMethod,
//     } = body;

//     if (!items || items.length === 0) {
//       return NextResponse.json({ error: 'No items' }, { status: 400 });
//     }

//     const order = await Order.create({
//       user: session?.user?.id || session?.user?._id || null,
//       email: customer.email,

//       items: items.map(item => ({
//         product: item.id || null,
//         name: item.name,
//         quantity: item.quantity,
//         price: item.price,
//         image: item.image || item.images?.[0],
//       })),

//       shippingAddress: {
//         name: customer.name,
//         address: customer.address.line1,
//         city: customer.address.city,
//         state: customer.address.state,
//         postalCode: customer.address.postal_code,
//         country: customer.address.country,
//       },

//       paymentMethod: 'cod',
//       isPaid: false,
//       status: 'pending',

//       itemsPrice: total,
//       taxPrice: 0,
//       shippingPrice: 0,
//       totalPrice: total,
//     });

//     return NextResponse.json({ success: true, order });
//   } catch (err) {
//     console.error('COD order error:', err);
//     return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
//   }
// }
// app/api/orders/route.js
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import dbConnect from '@/lib/db';
// import Order from '@/models/Order';

// // GET - Fetch user orders
// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || !session.user) {
//       return NextResponse.json(
//         { error: 'Not authenticated' },
//         { status: 401 }
//       );
//     }

//     const userId = session.user.id || session.user._id;

//     await dbConnect();

//     const orders = await Order.find({ user: userId })
//       .sort({ createdAt: -1 })
//       .lean();

//     return NextResponse.json({ orders }, { status: 200 });
//   } catch (err) {
//     console.error('Error fetching user orders:', err);
//     return NextResponse.json(
//       { error: 'Failed to fetch orders' },
//       { status: 500 }
//     );
//   }
// }

// // POST - Create new order (COD or Card)
// export async function POST(req) {
//   try {
//     await dbConnect();

//     const session = await getServerSession(authOptions);
//     const body = await req.json();

//     const {
//       items,
//       email,
//       shippingAddress,
//       paymentMethod,
//       itemsPrice,
//       taxPrice,
//       shippingPrice,
//       totalPrice,
//       paymentIntentId, // Optional - only for card payments
//     } = body;

//     // Validation
//     if (!items || items.length === 0) {
//       return NextResponse.json({ error: 'No items in order' }, { status: 400 });
//     }

//     if (!email || !shippingAddress) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     if (!paymentMethod || !['card', 'cod'].includes(paymentMethod)) {
//       return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
//     }

//     // Create order data
//     const orderData = {
//       user: session?.user?.id || session?.user?._id || null,
//       email: email.toLowerCase(),
      
//       items: items.map(item => ({
//         product: item.id || null,
//         name: item.name,
//         quantity: item.quantity,
//         price: item.price,
//         image: item.image || item.images?.[0],
//       })),

//       shippingAddress: {
//         name: shippingAddress.name,
//         address: shippingAddress.address,
//         city: shippingAddress.city,
//         state: shippingAddress.state,
//         postalCode: shippingAddress.postalCode,
//         country: shippingAddress.country || 'United States',
//       },

//       paymentMethod: paymentMethod,
//       itemsPrice: itemsPrice || totalPrice,
//       taxPrice: taxPrice || 0,
//       shippingPrice: shippingPrice || 0,
//       totalPrice: totalPrice,
//     };

//     // Handle COD vs Card payments differently
//     if (paymentMethod === 'cod') {
//       // COD orders start as pending and unpaid
//       orderData.status = 'pending';
//       orderData.isPaid = false;
//       orderData.paymentIntentId = `COD-${Date.now()}`; // Generate unique ID for COD
//     } else if (paymentMethod === 'card') {
//       // Card payments should have a payment intent ID
//       if (!paymentIntentId) {
//         return NextResponse.json(
//           { error: 'Payment intent ID required for card payments' },
//           { status: 400 }
//         );
//       }
//       orderData.paymentIntentId = paymentIntentId;
//       orderData.status = 'paid';
//       orderData.isPaid = true;
//       orderData.paidAt = new Date();
//     }

//     // Create the order
//     const order = await Order.create(orderData);

//     return NextResponse.json({ 
//       success: true, 
//       order: {
//         _id: order._id.toString(),
//         orderNumber: order.orderNumber,
//         totalPrice: order.totalPrice,
//         status: order.status,
//         paymentMethod: order.paymentMethod,
//         createdAt: order.createdAt,
//       }
//     }, { status: 201 });

//   } catch (err) {
//     console.error('Order creation error:', err);
//     return NextResponse.json(
//       { error: 'Failed to create order', details: err.message },
//       { status: 500 }
//     );
//   }
// }
// app/api/orders/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import nodemailer from 'nodemailer';
// GET - Fetch user orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const userId = session.user.id || session.user._id;

    await dbConnect();

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ orders }, { status: 200 });
  } catch (err) {
    console.error('Error fetching user orders:', err);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - Create new order (COD or Card)
// app/api/orders/route.js - POST method (FIXED)

export async function POST(req) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      items,
      email,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentIntentId,
    } = body;

    // Validation
    if (!items || items.length === 0)
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });

    if (!email || !shippingAddress)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    if (!paymentMethod || !['card', 'cod'].includes(paymentMethod))
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });

    // Create order data
    const orderData = {
      user: session?.user?.id || session?.user?._id || null,
      email: email.toLowerCase(),
      items: items.map(item => ({
        product: item.id || null,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image || item.images?.[0],
      })),
      shippingAddress: {
        name: shippingAddress.name,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'United States',
      },
      paymentMethod,
      itemsPrice: itemsPrice || totalPrice,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalPrice,
    };

    // Handle COD vs Card payments
    if (paymentMethod === 'cod') {
      orderData.status = 'pending';
      orderData.isPaid = false;
      orderData.paymentIntentId = `COD-${Date.now()}`;
    } else if (paymentMethod === 'card') {
      if (!paymentIntentId)
        return NextResponse.json(
          { error: 'Payment intent ID required for card payments' },
          { status: 400 }
        );
      orderData.paymentIntentId = paymentIntentId;
      orderData.status = 'paid';
      orderData.isPaid = true;
      orderData.paidAt = new Date();
    }

    // Create the order
    const order = await Order.create(orderData);

    // ----------- Send email to customer -----------
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user: process.env.Email_User, pass: process.env.Email_Password },
      });

      const emailContent = `
        Hello ${shippingAddress.name || 'Customer'},

        Thank you for your order (${order.orderNumber})!
        Total Amount: $${order.totalPrice.toFixed(2)}
        Payment Method: ${order.paymentMethod}
        Status: ${order.status}

        Shipping Address:
        ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}
        ${shippingAddress.country || 'United States'}

        Items:
        ${items.map(i => `- ${i.name} x${i.quantity} - $${i.price}`).join('\n')}

        Regards,
        Your Shop Team
      `;

      await transporter.sendMail({
        from: `"Your Shop" <${process.env.Email_User}>`,
        to: order.email,
        subject: `Order Confirmation - ${order.orderNumber}`,
        text: emailContent,
      });
    } catch (emailErr) {
      console.error('Failed to send email to customer:', emailErr);
    }

    // Prepare response
    const orderIdString = order._id.toString();
    const responseData = {
      success: true,
      message: 'Order created successfully',
      order: {
        _id: orderIdString,
        id: orderIdString,
        orderNumber: order.orderNumber,
        totalPrice: order.totalPrice,
        status: order.status,
        paymentMethod: order.paymentMethod,
        isPaid: order.isPaid,
        createdAt: order.createdAt,
        email: order.email,
        shippingAddress: order.shippingAddress,
      },
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (err) {
    console.error('ORDER CREATION ERROR:', err);
    return NextResponse.json(
      { error: 'Failed to create order', details: err.message },
      { status: 500 }
    );
  }
}