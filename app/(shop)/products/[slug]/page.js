'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiChevronRight, FiStar, FiHome, FiChevronLeft, FiChevronDown, FiUser } from 'react-icons/fi';
import { useCartStore, useWishlistStore, useProductStore } from '@/lib/store';
import { useSession } from "next-auth/react";

// Default products if store is empty
const DEFAULT_PRODUCTS = [
  {
    id: '1',
    name: 'Modern Cascade Fountain',
    slug: 'modern-cascade-fountain',
    price: 249.99,
    stockStatus: 'in-stock',
    image: 'https://images.unsplash.com/photo-1585150841312-c833091e593d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Indoor',
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Zen Garden Water Feature',
    slug: 'zen-garden-water-feature',
    price: 199.99,
    stockStatus: 'in-stock',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Outdoor',
    rating: 4.2,
  },
  {
    id: '3',
    name: 'Solar Powered Garden Fountain',
    slug: 'solar-powered-garden-fountain',
    price: 349.99,
    stockStatus: 'in-stock',
    image: 'https://images.unsplash.com/photo-1534857960998-63c4ea13a0a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Outdoor',
    rating: 4.6,
  },
  {
    id: '4',
    name: 'LED Illuminated Wall Fountain',
    slug: 'led-illuminated-wall-fountain',
    price: 599.99,
    stockStatus: 'out-of-stock',
    image: 'https://images.unsplash.com/photo-1611223235982-891064f27716?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Indoor',
    rating: 4.9,
  }
];

export default function ProductDetail() {
  const params = useParams();
  const slug = params.slug;
  const { data: session } = useSession();
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, items: wishlist } = useWishlistStore();
  const { products: storeProducts, getProductBySlug } = useProductStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [selectedSize, setSelectedSize] = useState('12');

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    average: 0,
    total: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    if (!slug) return;
    
    const foundProduct = getProductBySlug(slug) || DEFAULT_PRODUCTS.find(p => p.slug === slug);

    if (foundProduct) {
      setProduct(foundProduct);
      setIsInWishlist(wishlist?.some(item => item.id === foundProduct.id));
      
      const productsSource = storeProducts.length > 0 ? storeProducts : DEFAULT_PRODUCTS;
      const related = productsSource
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4);
      setRelatedProducts(related);

      // Fetch reviews for this product
      fetchReviews(foundProduct._id || foundProduct.id);
    }

    setLoading(false);
  }, [slug, wishlist, getProductBySlug, storeProducts]);

  const fetchReviews = async (productId) => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        calculateReviewStats(data.reviews || []);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const calculateReviewStats = (reviewsList) => {
    if (reviewsList.length === 0) {
      setReviewStats({
        average: 0,
        total: 0,
        breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      });
      return;
    }

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;

    reviewsList.forEach(review => {
      breakdown[review.rating]++;
      totalRating += review.rating;
    });

    setReviewStats({
      average: (totalRating / reviewsList.length).toFixed(1),
      total: reviewsList.length,
      breakdown
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    setSubmittingReview(true);

    try {
      const productId = product._id || product.id;
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId,
          name: reviewForm.name,
          email: reviewForm.email,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      setReviewSuccess('Thank you for your review! It has been submitted successfully.');
      setReviewForm({ name: '', email: '', rating: 5, comment: '' });
      
      // Refresh reviews
      fetchReviews(productId);

      // Clear success message after 5 seconds
      setTimeout(() => setReviewSuccess(''), 5000);
    } catch (error) {
      setReviewError(error.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = async () => {
    if (product && product.stockStatus === 'in-stock') {
      addToCart(product, quantity);

      if (session?.user) {
        try {
          const productId = product._id || product.id;
          const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ productId, quantity }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Failed to sync cart");
        } catch (err) {
          console.error("Failed to sync cart:", err);
        }
      }
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    const productId = product._id || product.id;

    if (isInWishlist) {
      removeFromWishlist(productId);
      setIsInWishlist(false);
      if (session?.user) {
        try { await fetch("/api/wishlist", { method: "DELETE", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ productId }) }); } catch {}
      }
      return;
    }

    addToWishlist(product);
    setIsInWishlist(true);
    if (session?.user) {
      try { await fetch("/api/wishlist", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ productId }) }); } catch {}
    }
  };

  if (loading) return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
    </div>
  );
  
  if (!product) return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
        <Link href="/products" className="text-red-600 hover:text-red-700 mt-4 inline-block">Back to Products</Link>
      </div>
    </div>
  );

  const productImages = product.images?.length > 0 ? product.images : [product.image || '/flower.png'];

  return (
    <div className="bg-white min-h-screen">
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
            <span className="text-gray-900 font-medium uppercase">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left: Images */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }} 
            className="space-y-4">
            
            {/* Main Image */}
            <div className="relative bg-gray-100 overflow-hidden aspect-square">
              <Image 
                src={productImages[selectedImage]} 
                alt={product.name} 
                fill 
                className="object-cover" 
              />
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {productImages.slice(0, 2).map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImage(i)} 
                    className={`relative aspect-square overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                    }`}>
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }} 
            className="space-y-6">

            {/* Product Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
                {product.name}
              </h1>
              
              {/* Stock Status */}
              <p className="text-sm font-semibold mb-3">
                <span className={product.stockStatus === 'in-stock' ? 'text-green-600' : 'text-red-600'}>
                  {product.stockStatus === 'in-stock' ? 'IN STOCK' : 'OUT OF STOCK'}
                </span>
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(reviewStats.average || 0)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({reviewStats.average}/5 based on {reviewStats.total} {reviewStats.total === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 border-t border-gray-200 pt-6">
              <span className="text-3xl font-bold text-red-600">
                PKR {Number(product.price).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  PKR {Number(product.originalPrice).toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'This premium quality mobile phone comes with advanced features and elegant design, perfect for your daily needs. Crafted with attention to detail and built to last.'}
              </p>
            </div>

            {/* Add to Cart and Wishlist Buttons */}
            <div className="space-y-3 border-t border-gray-200 pt-6">
              <button 
                onClick={handleAddToCart}
                disabled={product.stockStatus !== 'in-stock'}
                className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                ADD TO BAG
              </button>
              
              <button 
                onClick={handleToggleWishlist}
                className={`w-full py-4 text-sm font-bold uppercase tracking-wider transition-colors border-2 flex items-center justify-center gap-2 ${
                  isInWishlist
                    ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                }`}>
                <FiHeart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                {isInWishlist ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.6 }} 
          className="mt-16 border-t border-gray-200 pt-16">
          
          <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wide mb-8">
            Customer Reviews
          </h2>

          {/* Review Stats */}
          <div className="bg-gray-50 border border-gray-200 p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left: Average Rating */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-6xl font-bold text-gray-900 mb-2">
                  {reviewStats.average}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(reviewStats.average)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Based on {reviewStats.total} {reviewStats.total === 1 ? 'review' : 'reviews'}
                </p>
              </div>

              {/* Right: Rating Breakdown */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviewStats.breakdown[star] || 0;
                  const percentage = reviewStats.total > 0 ? (count / reviewStats.total) * 100 : 0;
                  
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-20">
                        <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{star}</span>
                      </div>
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="bg-white border border-gray-200 p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase">Add a Review</h3>
            
            {reviewSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded">
                {reviewSuccess}
              </div>
            )}

            {reviewError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded">
                {reviewError}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={reviewForm.email}
                    onChange={(e) => setReviewForm({...reviewForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({...reviewForm, rating: star})}
                      className="transition-transform hover:scale-110">
                      <FiStar
                        className={`w-8 h-8 ${
                          star <= reviewForm.rating
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({reviewForm.rating}/5)
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  required
                  rows={5}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors resize-none"
                  placeholder="Share your experience with this product..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submittingReview}
                className="bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                {submittingReview ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 uppercase">
              {reviewStats.total} {reviewStats.total === 1 ? 'Review' : 'Reviews'} for {product.name}
            </h3>

            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 border border-gray-200">
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white border border-gray-200 p-6">
                    
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <FiUser className="w-8 h-8 text-gray-500" />
                      </div>

                      {/* Review Content */}
                      <div className="flex-1">
                        {/* Stars */}
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Name and Date */}
                        <div className="mb-3">
                          <h4 className="font-bold text-gray-900">{review.name || review.user?.name || 'Anonymous'}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>

                        {/* Comment */}
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.8 }} 
            className="mt-20">
            
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">RELATED PRODUCTS</h2>
            </div>

            {/* Related Products Carousel */}
            <div className="relative">
              {/* Navigation Arrows */}
              <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all z-10 shadow-lg">
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all z-10 shadow-lg">
                <FiChevronRight className="w-6 h-6" />
              </button>

              {/* Products Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-8">
                {relatedProducts.map(p => (
                  <Link 
                    key={p.id} 
                    href={`/products/${p.slug}`} 
                    className="bg-white group">
                    
                    {/* Image */}
                    <div className="relative h-80 overflow-hidden bg-gray-100 mb-3">
                      <Image 
                        src={p.images?.[0] || p.image || '/flower.png'} 
                        alt={p.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      
                      {/* Sale Badge */}
                      {p.originalPrice && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1">
                            50% OFF
                          </span>
                        </div>
                      )}
                      
                      {/* Wishlist Button */}
                      <button className="absolute top-3 right-3 w-10 h-10 bg-white border-2 border-gray-200 flex items-center justify-center shadow-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all opacity-0 group-hover:opacity-100">
                        <FiHeart className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="px-2">
                      <h3 className="text-sm font-medium text-gray-900 mb-2 hover:text-red-600 transition-colors uppercase text-center line-clamp-2 min-h-[2.5rem]">
                        {p.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-lg font-bold text-red-600">
                          PKR {Number(p.price).toFixed(2)}
                        </span>
                        {p.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            PKR {Number(p.originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};