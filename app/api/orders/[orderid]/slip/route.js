// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/db';
// import Order from '@/models/Order';
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// export async function GET(req, context) {
//   try {
//     // Await params in App Router
//     const { params } = await context;
//     const { orderId } = params;

//     await dbConnect();

//     const order = await Order.findById(orderId).lean();
//     if (!order) {
//       return NextResponse.json({ error: 'Order not found' }, { status: 404 });
//     }

//     // ===============================
//     // CREATE PDF
//     // ===============================
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
//     const { width, height } = page.getSize();
//     let yPosition = height - 50;

//     // ===============================
//     // HEADER
//     // ===============================
//     page.drawText('Order Slip / Invoice', {
//       x: width / 2 - 100,
//       y: yPosition,
//       size: 20,
//       font: boldFont,
//       color: rgb(0, 0, 0),
//     });
//     yPosition -= 40;

//     // Order Details
//     const details = [
//       `Order Number: ${order.orderNumber}`,
//       `Order ID: ${order._id}`,
//       `Email: ${order.email}`,
//       `Status: ${order.status.toUpperCase()}`,
//       `Payment Method: ${order.paymentMethod.toUpperCase()}`,
//       `Order Date: ${new Date(order.createdAt).toLocaleString()}`,
//     ];

//     details.forEach(detail => {
//       page.drawText(detail, {
//         x: 50,
//         y: yPosition,
//         size: 11,
//         font,
//         color: rgb(0, 0, 0),
//       });
//       yPosition -= 20;
//     });

//     yPosition -= 10;

//     // ===============================
//     // SHIPPING ADDRESS
//     // ===============================
//     page.drawText('Shipping Address', {
//       x: 50,
//       y: yPosition,
//       size: 13,
//       font: boldFont,
//       color: rgb(0, 0, 0),
//     });
//     yPosition -= 25;

//     const addr = order.shippingAddress;
//     const addressLines = [
//       addr.name,
//       addr.address,
//       `${addr.city}, ${addr.state} ${addr.postalCode}`,
//       addr.country,
//     ];

//     addressLines.forEach(line => {
//       page.drawText(line, {
//         x: 50,
//         y: yPosition,
//         size: 11,
//         font,
//         color: rgb(0, 0, 0),
//       });
//       yPosition -= 18;
//     });

//     yPosition -= 15;

//     // ===============================
//     // ITEMS TABLE
//     // ===============================
//     page.drawText('Items', {
//       x: 50,
//       y: yPosition,
//       size: 13,
//       font: boldFont,
//       color: rgb(0, 0, 0),
//     });
//     yPosition -= 25;

//     // Table headers
//     const itemX = 50;
//     const qtyX = 300;
//     const priceX = 360;
//     const totalX = 460;

//     page.drawText('Item Name', { x: itemX, y: yPosition, size: 11, font: boldFont });
//     page.drawText('Qty', { x: qtyX, y: yPosition, size: 11, font: boldFont });
//     page.drawText('Price', { x: priceX, y: yPosition, size: 11, font: boldFont });
//     page.drawText('Total', { x: totalX, y: yPosition, size: 11, font: boldFont });
//     yPosition -= 5;

//     // Draw line
//     page.drawLine({
//       start: { x: itemX, y: yPosition },
//       end: { x: totalX + 60, y: yPosition },
//       thickness: 1,
//       color: rgb(0, 0, 0),
//     });
//     yPosition -= 20;

//     // Table rows
//     order.items.forEach((item) => {
//       const itemName = item.name.length > 30 ? item.name.substring(0, 30) + '...' : item.name;
//       page.drawText(itemName, { x: itemX, y: yPosition, size: 10, font });
//       page.drawText(item.quantity.toString(), { x: qtyX, y: yPosition, size: 10, font });
//       page.drawText(`$${item.price.toFixed(2)}`, { x: priceX, y: yPosition, size: 10, font });
//       page.drawText(`$${(item.price * item.quantity).toFixed(2)}`, { x: totalX, y: yPosition, size: 10, font });
//       yPosition -= 20;
//     });

//     yPosition -= 15;

//     // ===============================
//     // PRICE SUMMARY
//     // ===============================
//     const summaryX = 350;
//     page.drawText(`Items Price:`, { x: summaryX, y: yPosition, size: 11, font });
//     page.drawText(`$${order.itemsPrice.toFixed(2)}`, { x: summaryX + 100, y: yPosition, size: 11, font });
//     yPosition -= 20;

//     page.drawText(`Tax:`, { x: summaryX, y: yPosition, size: 11, font });
//     page.drawText(`$${order.taxPrice.toFixed(2)}`, { x: summaryX + 100, y: yPosition, size: 11, font });
//     yPosition -= 20;

//     page.drawText(`Shipping:`, { x: summaryX, y: yPosition, size: 11, font });
//     page.drawText(`$${order.shippingPrice.toFixed(2)}`, { x: summaryX + 100, y: yPosition, size: 11, font });
//     yPosition -= 25;

//     page.drawText(`Total:`, { x: summaryX, y: yPosition, size: 14, font: boldFont });
//     page.drawText(`$${order.totalPrice.toFixed(2)}`, { x: summaryX + 100, y: yPosition, size: 14, font: boldFont });

//     // ===============================
//     // GENERATE PDF
//     // ===============================
//     const pdfBytes = await pdfDoc.save();

//     return new NextResponse(Buffer.from(pdfBytes), {
//       headers: {
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': `inline; filename=order-${order.orderNumber}.pdf`,
//       },
//     });
//   } catch (error) {
//     console.error('PDF SLIP ERROR:', error);
//     return NextResponse.json({ error: 'Failed to generate order slip' }, { status: 500 });
//   }
// }
// app/api/orders/[orderId]/slip/route.js
// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/db';
// import Order from '@/models/Order';
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// // Force Node.js runtime (needed for pdf-lib on Vercel)
// export const runtime = 'nodejs';

// export async function GET(req, { params }) {
//   try {
//     const { orderId } = params;

//     await dbConnect();

//     const order = await Order.findById(orderId).lean();
//     if (!order) {
//       return NextResponse.json({ error: 'Order not found' }, { status: 404 });
//     }

//     // ===============================
//     // CREATE PDF
//     // ===============================
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//     const { width, height } = page.getSize();
//     let yPosition = height - 50;

//     // HEADER
//     page.drawText('Order Slip / Invoice', {
//       x: width / 2 - 100,
//       y: yPosition,
//       size: 20,
//       font: boldFont,
//       color: rgb(0, 0, 0),
//     });
//     yPosition -= 40;

//     // ORDER DETAILS
//     const details = [
//       `Order Number: ${order.orderNumber}`,
//       `Order ID: ${order._id}`,
//       `Email: ${order.email}`,
//       `Status: ${order.status.toUpperCase()}`,
//       `Payment Method: ${order.paymentMethod.toUpperCase()}`,
//       `Order Date: ${new Date(order.createdAt).toLocaleString()}`,
//     ];

//     details.forEach(detail => {
//       page.drawText(detail, { x: 50, y: yPosition, size: 11, font, color: rgb(0, 0, 0) });
//       yPosition -= 20;
//     });

//     yPosition -= 10;

//     // SHIPPING ADDRESS
//     page.drawText('Shipping Address', { x: 50, y: yPosition, size: 13, font: boldFont });
//     yPosition -= 25;

//     const addr = order.shippingAddress;
//     const addressLines = [
//       addr.name,
//       addr.address,
//       `${addr.city}, ${addr.state} ${addr.postalCode}`,
//       addr.country,
//     ];

//     addressLines.forEach(line => {
//       page.drawText(line, { x: 50, y: yPosition, size: 11, font, color: rgb(0, 0, 0) });
//       yPosition -= 18;
//     });

//     yPosition -= 15;

//     // ITEMS TABLE
//     page.drawText('Items', { x: 50, y: yPosition, size: 13, font: boldFont });
//     yPosition -= 25;

//     const itemX = 50;
//     const qtyX = 300;
//     const priceX = 360;
//     const totalX = 460;

//     // Table headers
//     page.drawText('Item Name', { x: itemX, y: yPosition, size: 11, font: boldFont });
//     page.drawText('Qty', { x: qtyX, y: yPosition, size: 11, font: boldFont });
//     page.drawText('Price', { x: priceX, y: yPosition, size: 11, font: boldFont });
//     page.drawText('Total', { x: totalX, y: yPosition, size: 11, font: boldFont });
//     yPosition -= 5;

//     page.drawLine({ start: { x: itemX, y: yPosition }, end: { x: totalX + 60, y: yPosition }, thickness: 1, color: rgb(0, 0, 0) });
//     yPosition -= 20;

//     // Table rows
//     order.items.forEach(item => {
//       const itemName = item.name.length > 30 ? item.name.substring(0, 30) + '...' : item.name;
//       page.drawText(itemName, { x: itemX, y: yPosition, size: 10, font });
//       page.drawText(item.quantity.toString(), { x: qtyX, y: yPosition, size: 10, font });
//       page.drawText(`$${item.price.toFixed(2)}`, { x: priceX, y: yPosition, size: 10, font });
//       page.drawText(`$${(item.price * item.quantity).toFixed(2)}`, { x: totalX, y: yPosition, size: 10, font });
//       yPosition -= 20;
//     });

//     yPosition -= 15;

//     // PRICE SUMMARY
//     const summaryX = 350;
//     page.drawText(`Items Price:`, { x: summaryX, y: yPosition, size: 11, font });
//     page.drawText(`$${order.itemsPrice.toFixed(2)}`, { x: summaryX + 100, y: yPosition, size: 11, font });
//     yPosition -= 20;

//     page.drawText(`Tax:`, { x: summaryX, y: yPosition, size: 11, font });
//     page.drawText(`$${order.taxPrice.toFixed(2)}`, { x: summaryX + 100, y: yPosition, size: 11, font });
//     yPosition -= 20;

//     page.drawText(`Shipping:`, { x: summaryX, y: yPosition, size: 11, font });
//     page.drawText(`$${order.shippingPrice.toFixed(2)}`, { x: summaryX + 100, y: yPosition, size: 11, font });
//     yPosition -= 25;

//     page.drawText(`Total:`, { x: summaryX, y: yPosition, size: 14, font: boldFont });
//     page.drawText(`$${order.totalPrice.toFixed(2)}`, { x: summaryX + 100, y: yPosition, size: 14, font: boldFont });

//     // GENERATE PDF
//     const pdfBytes = await pdfDoc.save();

//     return new NextResponse(pdfBytes, {
//       headers: {
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': `inline; filename=order-${order.orderNumber}.pdf`,
//       },
//     });
//   } catch (error) {
//     console.error('PDF SLIP ERROR:', error);
//     return NextResponse.json({ error: 'Failed to generate order slip' }, { status: 500 });
//   }
// }
// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/db';
// import Order from '@/models/Order';
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// // Force Node.js runtime for pdf-lib
// export const runtime = 'nodejs';

// export async function GET(req, { params }) {
//   try {
//     const { orderId } = params;

//     console.log('API HIT for orderId:', orderId);

//     await dbConnect();

//     const order = await Order.findById(orderId).lean();
//     console.log('Found order:', order ? order._id : null);

//     if (!order) {
//       return NextResponse.json({ error: 'Order not found' }, { status: 404 });
//     }

//     // ===============================
//     // CREATE PDF
//     // ===============================
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage([595.28, 841.89]);
//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//     let y = page.getHeight() - 50;

//     // HEADER
//     page.drawText('Order Slip / Invoice', {
//       x: page.getWidth() / 2 - 100,
//       y,
//       size: 20,
//       font: boldFont,
//       color: rgb(0, 0, 0),
//     });
//     y -= 40;

//     // ORDER DETAILS
//     const details = [
//       `Order Number: ${order.orderNumber}`,
//       `Order ID: ${order._id}`,
//       `Email: ${order.email}`,
//       `Status: ${order.status.toUpperCase()}`,
//       `Payment Method: ${order.paymentMethod.toUpperCase()}`,
//       `Order Date: ${new Date(order.createdAt).toLocaleString()}`,
//     ];

//     details.forEach(d => {
//       page.drawText(d, { x: 50, y, size: 11, font, color: rgb(0, 0, 0) });
//       y -= 20;
//     });

//     y -= 10;

//     // SHIPPING ADDRESS
//     page.drawText('Shipping Address', { x: 50, y, size: 13, font: boldFont });
//     y -= 25;

//     const addr = order.shippingAddress;
//     const addrLines = [
//       addr.name,
//       addr.address,
//       `${addr.city}, ${addr.state} ${addr.postalCode}`,
//       addr.country,
//     ];

//     addrLines.forEach(line => {
//       page.drawText(line, { x: 50, y, size: 11, font, color: rgb(0, 0, 0) });
//       y -= 18;
//     });

//     y -= 15;

//     // ITEMS TABLE
//     page.drawText('Items', { x: 50, y, size: 13, font: boldFont });
//     y -= 25;

//     const itemX = 50, qtyX = 300, priceX = 360, totalX = 460;

//     page.drawText('Item Name', { x: itemX, y, size: 11, font: boldFont });
//     page.drawText('Qty', { x: qtyX, y, size: 11, font: boldFont });
//     page.drawText('Price', { x: priceX, y, size: 11, font: boldFont });
//     page.drawText('Total', { x: totalX, y, size: 11, font: boldFont });
//     y -= 5;

//     page.drawLine({
//       start: { x: itemX, y },
//       end: { x: totalX + 60, y },
//       thickness: 1,
//       color: rgb(0, 0, 0),
//     });
//     y -= 20;

//     order.items.forEach(item => {
//       const name = item.name.length > 30 ? item.name.slice(0, 30) + '...' : item.name;
//       page.drawText(name, { x: itemX, y, size: 10, font });
//       page.drawText(item.quantity.toString(), { x: qtyX, y, size: 10, font });
//       page.drawText(`$${item.price.toFixed(2)}`, { x: priceX, y, size: 10, font });
//       page.drawText(`$${(item.price * item.quantity).toFixed(2)}`, { x: totalX, y, size: 10, font });
//       y -= 20;
//     });

//     y -= 15;

//     const summaryX = 350;
//     page.drawText('Items Price:', { x: summaryX, y, size: 11, font });
//     page.drawText(`$${order.itemsPrice.toFixed(2)}`, { x: summaryX + 100, y, size: 11, font });
//     y -= 20;

//     page.drawText('Tax:', { x: summaryX, y, size: 11, font });
//     page.drawText(`$${order.taxPrice.toFixed(2)}`, { x: summaryX + 100, y, size: 11, font });
//     y -= 20;

//     page.drawText('Shipping:', { x: summaryX, y, size: 11, font });
//     page.drawText(`$${order.shippingPrice.toFixed(2)}`, { x: summaryX + 100, y, size: 11, font });
//     y -= 25;

//     page.drawText('Total:', { x: summaryX, y, size: 14, font: boldFont });
//     page.drawText(`$${order.totalPrice.toFixed(2)}`, { x: summaryX + 100, y, size: 14, font: boldFont });

//     const pdfBytes = await pdfDoc.save();

//     return new NextResponse(pdfBytes, {
//       headers: {
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': `inline; filename=order-${order.orderNumber}.pdf`,
//       },
//     });
//   } catch (err) {
//     console.error('PDF SLIP ERROR:', err);
//     return NextResponse.json({ error: 'Failed to generate order slip' }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

// No need for pdf-lib if React-PDF is used
export const runtime = 'nodejs';

export async function GET(req, { params }) {
  try {
    const { orderId } = params;

    console.log('API HIT for orderId:', orderId);

    await dbConnect();

    const order = await Order.findById(orderId).lean();
    console.log('Found order:', order ? order._id : null);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Return order JSON directly
    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error('ORDER FETCH ERROR:', err);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
