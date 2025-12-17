// app/api/orders/[orderId]/slip/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function GET(request, { params }) {
  try {
    const { orderId } = params;

    await dbConnect();

    // Fetch order from database
    const order = await Order.findById(orderId).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Generate HTML content for PDF
    const htmlContent = generateOrderSlipHTML(order);

    // Return HTML with print-friendly styles
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (err) {
    console.error('Error generating order slip:', err);
    return NextResponse.json(
      { error: 'Failed to generate order slip', details: err.message },
      { status: 500 }
    );
  }
}

function generateOrderSlipHTML(order) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Order Slip - ${order.orderNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
    }
    
    .header {
      background: #2563eb;
      color: white;
      padding: 30px;
      margin-bottom: 30px;
    }
    
    .company-name {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .company-info {
      font-size: 12px;
      opacity: 0.9;
    }
    
    .title {
      font-size: 24px;
      font-weight: bold;
      margin: 20px 0;
      color: #111827;
    }
    
    .order-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 30px;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
    }
    
    .detail-item {
      display: flex;
      gap: 10px;
    }
    
    .detail-label {
      font-weight: bold;
      color: #374151;
    }
    
    .detail-value {
      color: #6b7280;
    }
    
    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #6b7280;
      margin: 30px 0 15px 0;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .customer-info {
      margin-bottom: 30px;
      line-height: 1.8;
      color: #374151;
    }
    
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    
    .items-table thead {
      background: #2563eb;
      color: white;
    }
    
    .items-table th,
    .items-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .items-table th {
      font-weight: bold;
      font-size: 12px;
      text-transform: uppercase;
    }
    
    .items-table td {
      font-size: 14px;
      color: #374151;
    }
    
    .items-table .text-right {
      text-align: right;
    }
    
    .totals {
      margin-left: auto;
      width: 300px;
      margin-top: 20px;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      color: #374151;
    }
    
    .total-row.grand-total {
      border-top: 2px solid #2563eb;
      margin-top: 10px;
      padding-top: 15px;
      font-size: 18px;
      font-weight: bold;
      color: #2563eb;
    }
    
    .cod-notice {
      background: #fef3c7;
      border: 2px solid #f59e0b;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
    }
    
    .cod-notice .cod-title {
      font-size: 16px;
      font-weight: bold;
      color: #92400e;
      margin-bottom: 10px;
    }
    
    .cod-notice .cod-text {
      color: #78350f;
      line-height: 1.6;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #2563eb;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .print-button:hover {
      background: #1d4ed8;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .print-button {
        display: none;
      }
      
      .header {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .items-table thead {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .cod-notice {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <button class="print-button" onclick="window.print()">🖨️ Print / Save as PDF</button>
  
  <div class="header">
    <div class="company-name">YOUR COMPANY NAME</div>
    <div class="company-info">
      123 Business Street, City, State 12345<br>
      Phone: (555) 123-4567 | Email: info@company.com
    </div>
  </div>
  
  <div class="title">ORDER SLIP</div>
  
  <div class="order-details">
    <div class="detail-item">
      <span class="detail-label">Order Number:</span>
      <span class="detail-value">${order.orderNumber || 'N/A'}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Order Date:</span>
      <span class="detail-value">${orderDate}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Payment Method:</span>
      <span class="detail-value">${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Status:</span>
      <span class="detail-value">${order.status.toUpperCase()}</span>
    </div>
  </div>
  
  <div class="section-title">CUSTOMER INFORMATION</div>
  <div class="customer-info">
    <strong>Name:</strong> ${order.shippingAddress.name}<br>
    <strong>Email:</strong> ${order.email}<br>
    <strong>Address:</strong> ${order.shippingAddress.address}<br>
    <strong>City:</strong> ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
    <strong>Country:</strong> ${order.shippingAddress.country}
  </div>
  
  <div class="section-title">ORDER ITEMS</div>
  <table class="items-table">
    <thead>
      <tr>
        <th>Item</th>
        <th class="text-right">Qty</th>
        <th class="text-right">Price</th>
        <th class="text-right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${order.items.map(item => `
        <tr>
          <td>${item.name}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">$${item.price.toFixed(2)}</td>
          <td class="text-right">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <div class="totals">
    <div class="total-row">
      <span>Subtotal:</span>
      <span>$${order.itemsPrice.toFixed(2)}</span>
    </div>
    <div class="total-row">
      <span>Tax:</span>
      <span>$${(order.taxPrice || 0).toFixed(2)}</span>
    </div>
    <div class="total-row">
      <span>Shipping:</span>
      <span>$${(order.shippingPrice || 0).toFixed(2)}</span>
    </div>
    <div class="total-row grand-total">
      <span>TOTAL:</span>
      <span>$${order.totalPrice.toFixed(2)}</span>
    </div>
  </div>
  
  ${order.paymentMethod === 'cod' ? `
    <div class="cod-notice">
      <div class="cod-title">⚠️ CASH ON DELIVERY</div>
      <div class="cod-text">
        Please keep <strong>$${order.totalPrice.toFixed(2)}</strong> ready in cash for payment upon delivery.
      </div>
    </div>
  ` : ''}
  
  <div class="footer">
    Thank you for your order! For any questions, please contact our support team.
  </div>
  
  <script>
    // Auto-trigger print dialog on load (optional)
    // window.onload = function() { window.print(); };
  </script>
</body>
</html>
  `;
}