'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import { useCartStore, useUIStore } from '@/lib/store';
import { useSession } from 'next-auth/react';

export default function CartSidebar() {
  const { items, totalItems, totalPrice, removeItem, updateItemQuantity } = useCartStore();
  const { isCartOpen, toggleCart } = useUIStore();
  const { data: session } = useSession();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        toggleCart();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isCartOpen, toggleCart]);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  const sidebarVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      x: '100%', 
      opacity: 0,
      transition: { 
        ease: 'easeInOut',
        duration: 0.3
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: 100,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={toggleCart}
          />
          
          {/* Cart sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="bg-black p-6 text-white border-b-4 border-red-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 flex items-center justify-center border-2 border-white/20">
                    <FiShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-wide">Shopping Bag</h2>
                    <p className="text-sm text-gray-300">{totalItems} {totalItems === 1 ? 'Item' : 'Items'}</p>
                  </div>
                </div>
                <button
                  onClick={toggleCart}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center border border-white/20"
                  aria-label="Close cart"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-24 h-24 bg-gray-200 flex items-center justify-center mb-6 border-4 border-gray-300"
                  >
                    <FiShoppingBag className="w-12 h-12 text-gray-500" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 uppercase">Your Bag is Empty</h3>
                  <p className="text-gray-600 mb-8 max-w-xs text-sm">Start adding items to your bag and they'll appear here.</p>
                  <button
                    onClick={toggleCart}
                    className="bg-black hover:bg-gray-900 text-white px-8 py-3 font-semibold uppercase tracking-wider transition-all flex items-center gap-2 text-sm"
                  >
                    Continue Shopping
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="bg-white p-4 border border-gray-200 hover:border-gray-300 transition-all"
                      >
                        <div className="flex gap-4">
                          {/* Product image */}
                          <div className="w-24 h-24 flex-shrink-0 bg-gray-100 border border-gray-200">
                            <img
                              src={item.image || item.images?.[0]}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Product details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1 pr-2">
                                <h4 className="font-bold text-gray-900 text-sm line-clamp-2 uppercase">{item.name}</h4>
                                <p className="text-xs text-gray-500 uppercase mt-1">{item.category}</p>
                              </div>
                              <button
                                onClick={async () => {
                                  try {
                                    removeItem(item.id);
                                    if (session?.user) {
                                      const res = await fetch("/api/cart", {
                                        method: "DELETE",
                                        headers: { "Content-Type": "application/json" },
                                        credentials: "include",
                                        body: JSON.stringify({ productId: item._id || item.id }),
                                      });
                                      const data = await res.json();
                                      if (!res.ok) {
                                        console.error("Failed to remove from DB:", data.message);
                                      }
                                    }
                                  } catch (err) {
                                    console.error("Error deleting item:", err);
                                  }
                                }}
                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                aria-label="Remove item"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="flex justify-between items-center mt-3">
                              {/* Quantity controls */}
                              <div className="flex items-center border border-gray-300">
                                <button
                                  onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                                  className="w-8 h-8 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center border-r border-gray-300"
                                  aria-label="Decrease quantity"
                                >
                                  <FiMinus className="w-3 h-3" />
                                </button>
                                <span className="w-10 h-8 text-sm font-bold text-gray-900 flex items-center justify-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center border-l border-gray-300"
                                  aria-label="Increase quantity"
                                >
                                  <FiPlus className="w-3 h-3" />
                                </button>
                              </div>
                              
                              {/* Price */}
                              <p className="font-bold text-base text-red-600">
                                PKR {(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
            
            {/* Footer with totals and checkout button */}
            {items.length > 0 && (
              <div className="border-t-2 border-gray-300 bg-white p-6">
                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold uppercase text-sm">Subtotal</span>
                    <span className="font-bold text-gray-900">PKR {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-xs">
                    <span className="uppercase">Shipping</span>
                    <span className="text-gray-900 font-medium">Calculated at checkout</span>
                  </div>
                  <div className="h-px bg-gray-300"></div>
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span className="uppercase">Total</span>
                    <span className="text-red-600">PKR {totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    onClick={toggleCart}
                    className="w-full bg-black hover:bg-gray-900 text-white py-4 font-bold uppercase tracking-wider flex items-center justify-center transition-all gap-2 text-sm"
                  >
                    Proceed to Checkout
                    <FiArrowRight className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={toggleCart}
                    className="w-full border-2 border-gray-300 bg-white hover:bg-gray-100 text-gray-900 py-3 font-semibold uppercase tracking-wide transition-all text-sm"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Trust badges */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-center gap-6 text-xs text-gray-600">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    SECURE PAYMENT
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    FREE SHIPPING
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}