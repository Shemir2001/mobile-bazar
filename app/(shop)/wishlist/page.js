'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiTrash2, FiArrowLeft, FiHeart, FiHome, FiChevronRight } from 'react-icons/fi';
import { useWishlistStore, useCartStore } from '@/lib/store';
import Image from 'next/image';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to remove from wishlist");

      console.log("✅ Removed from wishlist:", data.message);
      removeItem(productId);
    } catch (err) {
      console.error("❌ Failed to remove from wishlist:", err);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full animate-ping"></div>
                <div className="absolute inset-0 border-4 border-t-red-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 font-semibold text-lg">Loading your wishlist...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Breadcrumbs */}
      <div className="bg-white border-b-2 border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors font-medium">
              <FiHome className="w-4 h-4" />
              Home
            </Link>
            <FiChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/products" className="text-gray-600 hover:text-red-600 transition-colors font-medium">
              Products
            </Link>
            <FiChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-black font-bold">Wishlist</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-block mb-4">
                <div className="bg-red-600 text-white px-6 py-2 font-bold text-xs uppercase tracking-widest border-2 border-black">
                  YOUR COLLECTION
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight mb-2">
                MY <span className="text-red-600">WISHLIST</span>
              </h1>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-12 h-1 bg-red-600"></div>
                <p className="text-gray-600 font-medium">
                  {items.length} {items.length === 1 ? 'Item' : 'Items'} Saved
                </p>
              </div>
            </div>

            <Link 
              href="/products"
              className="group inline-flex items-center gap-3 bg-black hover:bg-red-600 text-white px-8 py-4 font-bold uppercase tracking-wider text-sm transition-all duration-300"
            >
              <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </Link>
          </div>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white border-2 border-gray-100"
          >
            <div className="text-center py-20 px-4">
              <div className="w-32 h-32 mx-auto bg-gray-100 mb-8 flex items-center justify-center relative">
                <FiHeart className="w-16 h-16 text-gray-300" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">0</span>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tight mb-4">
                Your Wishlist is Empty
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto font-medium">
                Save items you love for later by clicking the heart icon on product pages.
              </p>
              <Link href="/products">
                <button className="inline-flex items-center gap-3 bg-red-600 hover:bg-black text-white px-8 py-4 font-bold uppercase tracking-wider text-sm transition-all duration-300">
                  <FiShoppingCart className="w-5 h-5" />
                  Browse Products
                </button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group bg-white border-2 border-gray-100 hover:border-red-600 transition-all duration-300 relative overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative w-full h-64 bg-gray-200 overflow-hidden">
                  {item.images && item.images.length > 0 ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw,
                             (max-width: 1200px) 50vw,
                             33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase">
                      No Image
                    </div>
                  )}

                  {/* Delete Button - Positioned on Image */}
                  <button
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white hover:bg-red-600 text-gray-700 hover:text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
                    aria-label="Remove from wishlist"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>

                  {/* Wishlist Badge */}
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 border-white">
                    Saved
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-lg font-black text-black uppercase tracking-wide mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {item.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-0.5 bg-red-600"></div>
                    <p className="text-2xl font-black text-red-600">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-black hover:bg-red-600 text-white py-4 font-bold uppercase tracking-wider text-sm transition-all duration-300 flex items-center justify-center gap-3 group/btn"
                  >
                    <FiShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    Add to Cart
                  </button>
                </div>

                {/* Corner Accent */}
                <div className="absolute bottom-0 left-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 w-full h-full border-b-4 border-l-4 border-red-600"></div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom CTA Section - Only show when items exist */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 bg-black border-2 border-red-600 p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-2">
                  Ready to <span className="text-red-600">Purchase?</span>
                </h3>
                <p className="text-gray-400 font-medium">
                  Add your favorite items to cart and complete your order
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/cart"
                  className="inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-white hover:text-black text-white px-8 py-4 font-bold uppercase tracking-wider text-sm transition-all duration-300 border-2 border-red-600"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  View Cart
                </Link>
                <Link 
                  href="/products"
                  className="inline-flex items-center justify-center gap-3 bg-transparent hover:bg-white hover:text-black text-white px-8 py-4 font-bold uppercase tracking-wider text-sm transition-all duration-300 border-2 border-white"
                >
                  Add More Items
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}