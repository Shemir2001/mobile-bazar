'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { FiShoppingCart, FiPackage, FiHeart, FiStar, FiChevronRight, FiHome } from 'react-icons/fi';
import { useCartStore, useWishlistStore } from '@/lib/store';

export default function CategoryPage({ params }) {
  const { data: session } = useSession();
  const isAuthed = !!(session && session.user);
  const router = useRouter();
  const sectionRef = useRef(null);

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, items: wishlistItems } = useWishlistStore();

  // Fetch category and products by slug
  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/category/${params.slug}`);
        if (!res.ok) throw new Error('Failed to fetch category');
        const data = await res.json();
        setCategory(data.category);
        setProducts(data.products || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategoryAndProducts();
  }, [params.slug]);

  // Add to Cart
  const handleAddToCart = async (product) => {
    if (!isAuthed) {
      router.push('/login');
      return;
    }

    addToCart({
      ...product,
      id: product._id || product.id,
      quantity: 1,
    });

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add to cart');
      message.success(`${product.name} added to cart`);
    } catch (error) {
      console.error('Cart API error:', error);
      message.error('Failed to save cart');
    }
  };

  // Toggle Wishlist
  const handleToggleWishlist = (product) => {
    if (!isAuthed) {
      router.push('/login');
      return;
    }

    const productId = product._id || product.id;
    const isInWishlist = wishlistItems.some(
      (item) => (item._id || item.id) === (product._id || product.id)
    );

    if (isInWishlist) {
      removeFromWishlist(productId);
      message.info(`${product.name} removed from wishlist`);

      fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId })
      }).catch(err => console.error('Failed to remove from wishlist:', err));
    } else {
      addToWishlist(product);
      message.success(`${product.name} added to wishlist`);

      fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId })
      }).catch(err => console.error('Failed to add to wishlist:', err));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const safeWishlistItems = isAuthed ? wishlistItems : [];

  // Empty State Component
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="col-span-full bg-gray-50 border-2 border-dashed border-gray-300 p-16 text-center">
      <div className="w-32 h-32 bg-gray-200 flex items-center justify-center mx-auto mb-8 border-4 border-gray-300">
        <FiPackage className="w-16 h-16 text-gray-500" />
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-4 uppercase">No Products Found</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        There are no products under this category yet. Try checking other categories.
      </p>
      <Link href="/products">
        <button className="bg-black hover:bg-gray-900 text-white px-10 py-4 font-bold uppercase tracking-wider transition-all text-sm">
          Browse All Products
        </button>
      </Link>
    </motion.div>
  );

  return (
    <div ref={sectionRef} className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-red-600 transition-colors">
              HOME
            </Link>
            <FiChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/products" className="text-gray-600 hover:text-red-600 transition-colors">
              PRODUCTS
            </Link>
            <FiChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium uppercase">
              {isLoading ? 'Loading...' : category?.name || 'Category'}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-black text-white overflow-hidden">
        {/* Diagonal stripe pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, white 50px, white 51px)'
        }}></div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 border-4 border-white transform rotate-12"></div>
          <div className="absolute top-40 right-40 w-64 h-64 border-4 border-red-600 transform -rotate-12"></div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="max-w-4xl">
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6">
              <div className="bg-red-600 text-white px-6 py-2 font-bold text-sm uppercase tracking-widest border-2 border-white">
                CATEGORY
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-none uppercase">
              {isLoading ? (
                <span className="inline-block h-20 w-96 bg-white/10 animate-pulse"></span>
              ) : (
                <>
                  <span className="text-white">{category?.name || 'Category'}</span>
                  <br />
                  <span className="text-red-600">COLLECTION</span>
                </>
              )}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
              {isLoading ? (
                <span className="inline-block h-6 w-full bg-white/10 animate-pulse"></span>
              ) : (
                category?.description || 'Discover our amazing selection of premium products'
              )}
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-8 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-600 flex items-center justify-center">
                  <FiPackage className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{products.length}</div>
                  <div className="text-gray-400 text-sm uppercase tracking-wide">Products</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white flex items-center justify-center">
                  <FiStar className="w-6 h-6 text-black" />
                </div>
                <div>
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-gray-400 text-sm uppercase tracking-wide">Authentic</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full animate-ping"></div>
                <div className="absolute inset-0 border-4 border-t-red-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 font-semibold text-lg">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Products Count Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10">
              <div className="bg-gray-100 px-6 py-4 border-l-4 border-red-600 inline-block">
                <p className="text-gray-700 font-semibold uppercase tracking-wide">
                  Showing <span className="text-red-600 font-bold text-xl">{products.length}</span> {products.length === 1 ? 'Product' : 'Products'}
                </p>
              </div>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const isOutOfStock = product.stockStatus === 'out-of-stock';
                const isInWishlist = safeWishlistItems.some(
                  (item) => (item._id || item.id) === (product._id || product.id)
                );

                return (
                  <motion.div
                    key={product._id}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    className="bg-white group">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden bg-gray-100 mb-3">
                      <Link href={`/products/${product.slug}`}>
                        <Image
                          src={product.images?.[0] || '/images/placeholder.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        />
                      </Link>

                      {/* Stock Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-4 py-2 text-xs font-bold ${
                          isOutOfStock
                            ? 'bg-red-600 text-white'
                            : 'bg-green-500 text-white'
                        }`}>
                          {isOutOfStock ? '✗ OUT OF STOCK' : '✓ IN STOCK'}
                        </span>
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => handleToggleWishlist(product)}
                        className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center shadow-xl border-2 transition-all z-10 ${
                          isInWishlist 
                            ? 'bg-red-600 text-white border-red-600' 
                            : 'bg-white text-gray-800 border-gray-200 hover:bg-red-600 hover:text-white hover:border-red-600'
                        }`}>
                        <FiHeart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="px-2 pb-2">
                      <div className="mb-2">
                        <span className="text-xs text-red-600 font-bold uppercase tracking-wider bg-red-50 px-3 py-1">
                          {product.category || category?.name}
                        </span>
                      </div>

                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-sm font-medium text-gray-900 mb-2 hover:text-red-600 transition-colors line-clamp-2 min-h-[2.5rem] cursor-pointer">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating || 0)
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">({product.rating || 0})</span>
                      </div>

                      {/* Price */}
                      <div className="mb-2">
                        <span className="text-lg font-bold text-red-600">
                          PKR {typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                        </span>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={isOutOfStock}
                        className="w-full bg-black text-white py-2 text-sm font-bold hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-600 uppercase tracking-wide">
                        {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}