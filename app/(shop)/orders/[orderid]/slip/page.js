'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiDownload, FiHome, FiPackage, FiCheck, FiPrinter, FiEye } from 'react-icons/fi';

export default function OrderSlipPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        console.log('=== ORDER SLIP PAGE DEBUG ===');
        console.log('Raw params:', params);
        
        // FIXED: Check for lowercase 'orderid' first (matches your folder name)
        let orderId = params.orderid || params.orderId || params.id;
        
        console.log('Extracted orderId:', orderId);

        // First, try to get from sessionStorage
        const lastOrder = sessionStorage.getItem('lastOrder');
        
        if (lastOrder) {
          const orderData = JSON.parse(lastOrder);
          console.log('📦 Order data from sessionStorage:', orderData);
          
          // If params orderId is undefined, use the one from sessionStorage
          if (!orderId && orderData.orderId) {
            orderId = orderData.orderId;
            console.log('🔧 Using orderId from sessionStorage:', orderId);
          }
          
          setOrder(orderData);
          setLoading(false);
          return;
        }

        // If not in sessionStorage, fetch from API
        console.log('⚠️ No order in sessionStorage');

        if (!orderId || orderId === 'undefined') {
          throw new Error('Order ID is missing. Please try placing your order again.');
        }

        console.log('🌐 Fetching from API with orderId:', orderId);

        const response = await fetch(`/api/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error('Order not found');
        }

        const data = await response.json();
        console.log('API response:', data);
        
        const orderData = {
          orderId: data.order._id || data.order.id || orderId,
          orderNumber: data.order.orderNumber,
          date: data.order.createdAt,
          total: data.order.totalPrice.toFixed(2),
          paymentMethod: data.order.paymentMethod,
        };

        setOrder(orderData);
      } catch (err) {
        console.error('❌ Error loading order:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [params]);

  const handleViewSlip = () => {
    console.log('=== VIEW SLIP CLICKED ===');
    console.log('params:', params);
    console.log('order:', order);
    
    // FIXED: Check lowercase 'orderid' first
    let orderId = params.orderid || params.orderId || params.id || order?.orderId;
    
    console.log('Using orderId:', orderId);
    
    if (!orderId || orderId === 'undefined') {
      alert('Order ID is missing. Please try placing your order again.');
      return;
    }
    
    const slipUrl = `/api/orders/${orderId}/slip`;
    console.log('Opening slip URL:', slipUrl);
    window.open(slipUrl, '_blank');
  };

  const handlePrintSlip = () => {
    console.log('=== PRINT SLIP CLICKED ===');
    
    // FIXED: Check lowercase 'orderid' first
    let orderId = params.orderid || params.orderId || params.id || order?.orderId;
    
    console.log('Using orderId:', orderId);

    if (!orderId || orderId === 'undefined') {
      alert('Order ID is missing. Please try placing your order again.');
      return;
    }

    const slipUrl = `/api/orders/${orderId}/slip`;
    console.log('Opening slip URL for print:', slipUrl);
    
    const printWindow = window.open(slipUrl, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 10 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheck className="w-10 h-10 text-green-600" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-center text-gray-900 mb-2"
          >
            Order Placed Successfully!
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-gray-600 mb-8"
          >
            Your order has been received and is being processed.
          </motion.p>

          {/* Order Number Box */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-center"
            >
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-2xl font-bold text-blue-600">{order.orderNumber}</p>
              <p className="text-sm text-gray-500 mt-2">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
              </p>
            </motion.div>
          )}

          {/* Order Slip Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="border-t border-b py-6 mb-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Your Order Slip
            </h2>
            <p className="text-center text-gray-600 mb-6">
              View, print, or save your order slip for your records. You'll need this when your order
              is delivered.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleViewSlip}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                <FiEye className="mr-2" />
                View Order Slip
              </button>

              <button
                onClick={handlePrintSlip}
                className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                <FiPrinter className="mr-2" />
                Print Slip
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
              💡 Tip: Use your browser's "Save as PDF" option when printing to save a copy
            </p>
          </motion.div>

          {/* Payment Info for COD */}
          {order && order.paymentMethod === 'cod' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6"
            >
              <div className="flex">
                <svg
                  className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="font-medium text-amber-900 mb-1">Cash Payment Required</h3>
                  <p className="text-sm text-amber-800">
                    Please keep <strong>${order.total}</strong> ready in cash. Payment will be
                    collected when your order is delivered.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Order Confirmation Email</h3>
                  <p className="text-sm text-gray-600">
                    Check your email for order confirmation and tracking details.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <FiPackage className="w-4 h-4 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Order Processing</h3>
                  <p className="text-sm text-gray-600">
                    We're preparing your items for shipment. You'll receive tracking info soon.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Delivery</h3>
                  <p className="text-sm text-gray-600">
                    Estimated delivery: 3-5 business days. Keep your order slip handy!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => router.push('/orders')}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
            >
              <FiPackage className="mr-2" />
              View My Orders
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
            >
              <FiHome className="mr-2" />
              Back to Home
            </button>
          </motion.div>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-center text-sm text-gray-500 mt-6"
          >
            Need help? Contact us at{' '}
            <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
              support@example.com
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}