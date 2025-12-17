// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import { FiFilter, FiGrid, FiList, FiHeart, FiShoppingCart, FiRefreshCw, FiX, FiStar } from 'react-icons/fi';
// import { useCartStore, useWishlistStore } from '@/lib/store';
// import { message } from 'antd';
// import { useSearchParams } from 'next/navigation';
// export default function ProductsPage() {
//   const { data: session } = useSession();
//   const isAuthed = !!(session && session.user);
//   const router = useRouter();
// const searchParams = useSearchParams();
// const searchQuery = searchParams.get('search') || '';
//   const { addItem: addToCart } = useCartStore();
//  const { addItem: addToWishlist, removeItem: removeFromWishlist, items: wishlistItems } = useWishlistStore();


//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [viewMode, setViewMode] = useState('grid');
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [categories, setCategories] = useState(['All']);
//   const [isLoading, setIsLoading] = useState(true);
//   const [priceRange, setPriceRange] = useState([0, 1000]);
//   const [sortBy, setSortBy] = useState('featured');

//   const requireAuth = (onAuthed) => {
//     if (!isAuthed) {
//       message.info('Please sign in to continue');
//       router.push('/login');
//       return;
//     }
//     onAuthed();
//   };

//   const handleAddToCart = async (product) => {
//     requireAuth(() => {
//       const normalizedProduct = {
//         ...product,
//         id: product._id || product.id,
//         quantity: 1
//       };
//       addToCart(normalizedProduct);
//       message.success(`${product.name} added to cart!`);
//     });
//   };

//  const handleToggleWishlist = (product) => {
//   requireAuth(() => {
//     const productId = product._id || product.id;
//    const isInWishlist = wishlistItems.some(
//   (item) => (item._id || item.id) === (product._id || product.id)
// );


//     if (isInWishlist) {
//       removeFromWishlist(productId);
//       message.info(`${product.name} removed from wishlist`);

//       if (session?.user) {
//         fetch('/api/wishlist', {
//           method: 'DELETE',
//           headers: { 'Content-Type': 'application/json' },
//           credentials: 'include',
//           body: JSON.stringify({ productId })
//         }).catch(err => console.error('Failed to remove from wishlist:', err));
//       }
//     } else {
//       addToWishlist(product);
//       message.success(`${product.name} added to wishlist`);

//       if (session?.user) {
//         fetch('/api/wishlist', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           credentials: 'include',
//           body: JSON.stringify({ productId })
//         }).catch(err => console.error('Failed to add to wishlist:', err));
//       }
//     }
//   });
// };


//   const fetchProductsFromAPI = async () => {
//     setIsLoading(true);
//     try {
//       const timestamp = new Date().getTime();
//       const response = await fetch(`/api/products?t=${timestamp}`, {
//         method: 'GET',
//         headers: {
//           'Cache-Control': 'no-cache, no-store, must-revalidate',
//           'Pragma': 'no-cache',
//           'Expires': '0'
//         },
//         cache: 'no-store'
//       });
//       if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//       const data = await response.json();

//       if (data.success && Array.isArray(data.data)) {
//         const normalized = data.data.map((p) => ({
//           ...p,
//           price: typeof p.price === 'number' ? p.price : Number(p.price ?? 0),
//           quantity: typeof p.quantity === 'number'
//             ? p.quantity
//             : (typeof p.stock === 'number' ? p.stock : 0),
//         }));
//         return normalized;
//       } else {
//         console.error('❌ API returned success:false or invalid data format:', data);
//         return [];
//       }
//     } catch (error) {
//       console.error('❌ Error fetching products:', error);
//       message.error('Failed to load products');
//       return [];
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     let isMounted = true;
//     const loadProducts = async () => {
//       const productsData = await fetchProductsFromAPI();
//       if (isMounted) {
//         setProducts(productsData);
//         setFilteredProducts(productsData);
//         if (productsData.length > 0) {
//           const uniqueCategories = ['All', ...new Set(productsData.map(p => p.category).filter(Boolean))];
//           setCategories(uniqueCategories);
//         }
//       }
//     };
//     loadProducts();
//     return () => { isMounted = false; };
//   }, []);

//   useEffect(() => {
//     let result = [...products];
//     if (selectedCategory !== 'All') {
//       result = result.filter(product => product.category === selectedCategory);
//     }
//     result = result.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

//     switch (sortBy) {
//       case 'price-low-high': result.sort((a, b) => a.price - b.price); break;
//       case 'price-high-low': result.sort((a, b) => b.price - a.price); break;
//       case 'rating': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
//       default: break;
//     }

//     setFilteredProducts(result);
//   }, [products, selectedCategory, priceRange, sortBy]);
// useEffect(() => {
//   let result = [...products];

//   // Apply category filter
//   if (selectedCategory !== 'All') {
//     result = result.filter(product => product.category === selectedCategory);
//   }

//   // Apply price filter
//   result = result.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

//   // Apply search filter
//   if (searchQuery) {
//     const lowerQuery = searchQuery.toLowerCase();
//     result = result.filter(product =>
//       product.name.toLowerCase().includes(lowerQuery) ||
//       (product.description && product.description.toLowerCase().includes(lowerQuery))
//     );
//   }

//   // Apply sorting
//   switch (sortBy) {
//     case 'price-low-high': result.sort((a, b) => a.price - b.price); break;
//     case 'price-high-low': result.sort((a, b) => b.price - a.price); break;
//     case 'rating': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
//     default: break;
//   }

//   setFilteredProducts(result);
// }, [products, selectedCategory, priceRange, sortBy, searchQuery]);

//   const handleRefresh = async () => {
//     const refreshedProducts = await fetchProductsFromAPI();
//     setProducts(refreshedProducts);
//     setFilteredProducts(refreshedProducts);
//     if (refreshedProducts.length > 0) {
//       const uniqueCategories = ['All', ...new Set(refreshedProducts.map(p => p.category).filter(Boolean))];
//       setCategories(uniqueCategories);
//     }
//     message.success(`Loaded ${refreshedProducts.length} products`);
//   };

//   const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
//   const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

//   const safeWishlistItems = isAuthed ? wishlistItems : [];

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Hero Section - Organic Style */}
//       <div className="relative bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 py-16 md:py-24 overflow-hidden">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-10 left-10 w-32 h-32 bg-green-400 rounded-full blur-3xl"></div>
//           <div className="absolute top-40 right-20 w-40 h-40 bg-orange-400 rounded-full blur-3xl"></div>
//           <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-yellow-400 rounded-full blur-3xl"></div>
//         </div>

//         <div className="container mx-auto px-4 relative z-10">
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }} 
//             animate={{ opacity: 1, y: 0 }} 
//             transition={{ duration: 0.6 }}
//             className="text-center max-w-3xl mx-auto">
//             <span className="text-orange-500 font-semibold text-lg mb-4 block">Fresh & Organic</span>
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
//               Our Products
//             </h1>
//             <p className="text-lg md:text-xl text-gray-600 mb-8">
//               Discover our collection of premium home decor items
//             </p>
//             <button
//               onClick={handleRefresh}
//               disabled={isLoading}
//               className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
//               <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
//               {isLoading ? 'Loading...' : 'Refresh Products'}
//             </button>
//           </motion.div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-12">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Sidebar Filters */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//             className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
//             <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
//               {/* Mobile Close Button */}
//               <div className="flex justify-between items-center mb-6 lg:hidden">
//                 <h3 className="text-xl font-bold text-gray-800">Filters</h3>
//                 <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full">
//                   <FiX className="w-5 h-5" />
//                 </button>
//               </div>

//               {/* Categories */}
//               <div className="mb-8">
//                 <h3 className="text-lg font-bold text-gray-800 mb-4">Categories</h3>
//                 <div className="space-y-2">
//                   {categories.map((category) => (
//                     <button
//                       key={category}
//                       onClick={() => setSelectedCategory(category)}
//                       className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${
//                         selectedCategory === category
//                           ? 'bg-green-500 text-white shadow-md'
//                           : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
//                       }`}>
//                       {category}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Price Range */}
//               <div className="mb-8">
//                 <h3 className="text-lg font-bold text-gray-800 mb-4">Price Range</h3>
//                 <div className="space-y-4">
//                   <div className="flex justify-between text-sm font-semibold text-gray-700">
//                     <span>${priceRange[0]}</span>
//                     <span>${priceRange[1]}</span>
//                   </div>
//                   <input
//                     type="range"
//                     min="0"
//                     max="1000"
//                     step="50"
//                     value={priceRange[0]}
//                     onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
//                     className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-500"
//                   />
//                   <input
//                     type="range"
//                     min="0"
//                     max="1000"
//                     step="50"
//                     value={priceRange[1]}
//                     onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
//                     className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-500"
//                   />
//                 </div>
//               </div>

//               {/* Sort By */}
//               <div>
//                 <h3 className="text-lg font-bold text-gray-800 mb-4">Sort By</h3>
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-gray-50 font-medium text-gray-700">
//                   <option value="featured">Featured</option>
//                   <option value="price-low-high">Price: Low to High</option>
//                   <option value="price-high-low">Price: High to Low</option>
//                   <option value="rating">Highest Rated</option>
//                 </select>
//               </div>
//             </div>
//           </motion.div>

//           {/* Products Grid */}
//           <div className="flex-1">
//             {/* Toolbar */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => setShowFilters(true)}
//                   className="lg:hidden flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border-2 border-gray-200 hover:border-green-500 transition-colors font-medium">
//                   <FiFilter className="w-4 h-4" />
//                   Filters
//                 </button>
//                 <p className="text-gray-600 font-medium">
//                   Showing <span className="text-green-600 font-bold">{filteredProducts.length}</span> of{' '}
//                   <span className="text-gray-800 font-bold">{products.length}</span> products
//                 </p>
//               </div>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2.5 rounded-xl transition-all ${
//                     viewMode === 'grid'
//                       ? 'bg-green-500 text-white shadow-md'
//                       : 'bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200'
//                   }`}>
//                   <FiGrid className="w-5 h-5" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2.5 rounded-xl transition-all ${
//                     viewMode === 'list'
//                       ? 'bg-green-500 text-white shadow-md'
//                       : 'bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200'
//                   }`}>
//                   <FiList className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             {/* Loading State */}
//             {isLoading && (
//               <div className="flex justify-center items-center h-96">
//                 <div className="text-center">
//                   <FiRefreshCw className="animate-spin h-16 w-16 text-green-500 mx-auto mb-4" />
//                   <p className="text-gray-600 font-medium text-lg">Loading fresh products...</p>
//                 </div>
//               </div>
//             )}

//             {/* Grid View */}
//             {!isLoading && viewMode === 'grid' && (
//               <motion.div
//                 variants={containerVariants}
//                 initial="hidden"
//                 animate="visible"
//                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredProducts.map((product) => {
//                   const stockQty = typeof product.quantity === 'number' ? product.quantity : 0;
//                   const isInWishlist = safeWishlistItems.some(
//                     (item) => (item._id || item.id) === (product._id || product.id)
//                   );

//                   return (
//                     <motion.div
//                       key={product._id || product.id}
//                       variants={itemVariants}
//                       whileHover={{ y: -8 }}
//                       transition={{ duration: 0.3 }}
//                       className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-green-400">
//                       {/* Image */}
//                       <div className="relative h-64 overflow-hidden bg-gray-100 group">
//                         <Link href={`/products/${product.slug}`}>
//                           <img
//                             src={product.images?.[0] || '/images/placeholder.jpg'}
//                             alt={product.name}
//                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                             onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
//                           />
//                         </Link>

//                         {/* Stock Badge */}
//                         <div className="absolute top-4 left-4">
//                           <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
//                             stockQty > 5
//                               ? 'bg-green-500 text-white'
//                               : stockQty > 0
//                               ? 'bg-yellow-400 text-gray-800'
//                               : 'bg-red-500 text-white'
//                           }`}>
//                             {stockQty > 5 ? 'In Stock' : stockQty > 0 ? 'Low Stock' : 'Out of Stock'}
//                           </span>
//                         </div>

//                        <button
//   onClick={() => handleToggleWishlist(product)}
//   className={`absolute top-4 right-4 p-2.5 bg-white rounded-full shadow-lg transition-colors ${
//     isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
//   }`}
// >
//   <FiHeart className={isInWishlist ? 'fill-current' : ''} />
// </button>

//                       </div>

//                       {/* Content */}
//                       <div className="p-5">
//                         <div className="mb-3">
//                           <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
//                             {product.category}
//                           </span>
//                         </div>

//                         <Link href={`/products/${product.slug}`}>
//                           <h3 className="text-lg font-bold text-gray-800 mb-2 hover:text-green-600 transition-colors line-clamp-1">
//                             {product.name}
//                           </h3>
//                         </Link>

//                         {/* Rating */}
//                         <div className="flex items-center gap-1 mb-4">
//                           {[...Array(5)].map((_, i) => (
//                             <FiStar
//                               key={i}
//                               className={`w-4 h-4 ${
//                                 i < Math.floor(product.rating || 0)
//                                   ? 'text-yellow-400 fill-current'
//                                   : 'text-gray-300'
//                               }`}
//                             />
//                           ))}
//                           <span className="text-xs text-gray-500 ml-1">({product.rating || 0})</span>
//                         </div>

//                         {/* Price & Button */}
//                         <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
//                           <p className="text-2xl font-bold text-gray-800">
//                             ${Number(product.price).toFixed(2)}
//                           </p>
//                           <button
//                             onClick={() => handleAddToCart(product)}
//                             disabled={stockQty === 0}
//                             className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-xl transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
//                             <FiShoppingCart className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             )}

//             {/* List View */}
//             {!isLoading && viewMode === 'list' && (
//               <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
//                 {filteredProducts.map((product) => {
//                   const stockQty = typeof product.quantity === 'number' ? product.quantity : 0;
//                   const isInWishlist = safeWishlistItems.some(
//                     (item) => (item._id || item.id) === (product._id || product.id)
//                   );

//                   return (
//                     <motion.div
//                       key={product._id || product.id}
//                       variants={itemVariants}
//                       className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-green-400 flex flex-col md:flex-row">
//                       {/* Image */}
//                       <div className="relative h-64 md:h-auto md:w-80 overflow-hidden bg-gray-100 group">
//                         <Link href={`/products/${product.slug}`}>
//                           <img
//                             src={product.images?.[0] || '/images/placeholder.jpg'}
//                             alt={product.name}
//                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                             onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
//                           />
//                         </Link>

//                         <button
//                           onClick={() => handleAddToWishlist(product)}
//                           className={`absolute top-4 right-4 p-2.5 bg-white rounded-full shadow-lg transition-colors ${
//                             isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
//                           }`}>
//                           <FiHeart className={isInWishlist ? 'fill-current' : ''} />
//                         </button>
//                       </div>

//                       {/* Content */}
//                       <div className="p-6 flex-1 flex flex-col">
//                         <div className="flex justify-between items-start mb-4">
//                           <div>
//                             <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2 block">
//                               {product.category}
//                             </span>
//                             <Link href={`/products/${product.slug}`}>
//                               <h3 className="text-2xl font-bold text-gray-800 hover:text-green-600 transition-colors">
//                                 {product.name}
//                               </h3>
//                             </Link>
//                           </div>
//                           <p className="text-3xl font-bold text-gray-800">${Number(product.price).toFixed(2)}</p>
//                         </div>

//                         <p className="text-gray-600 mb-4 line-clamp-2">
//                           {product.description || 'Premium quality product for your home.'}
//                         </p>

//                         <div className="flex items-center gap-4 mb-4">
//                           <div className="flex items-center gap-1">
//                             {[...Array(5)].map((_, i) => (
//                               <FiStar
//                                 key={i}
//                                 className={`w-4 h-4 ${
//                                   i < Math.floor(product.rating || 0)
//                                     ? 'text-yellow-400 fill-current'
//                                     : 'text-gray-300'
//                                 }`}
//                               />
//                             ))}
//                             <span className="text-sm text-gray-500 ml-1">({product.rating || 0})</span>
//                           </div>

//                           <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                             stockQty > 5
//                               ? 'bg-green-100 text-green-700'
//                               : stockQty > 0
//                               ? 'bg-yellow-100 text-yellow-700'
//                               : 'bg-red-100 text-red-700'
//                           }`}>
//                             {stockQty > 5 ? 'In Stock' : stockQty > 0 ? 'Low Stock' : 'Out of Stock'}
//                           </span>
//                         </div>

//                         <div className="flex gap-3 mt-auto">
//                           <button
//                             onClick={() => handleAddToCart(product)}
//                             disabled={stockQty === 0}
//                             className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed">
//                             <FiShoppingCart />
//                             {stockQty === 0 ? 'Out of Stock' : 'Add to Cart'}
//                           </button>
//                           <Link
//                             href={`/products/${product.slug}`}
//                             className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:border-green-500 hover:text-green-600 transition-colors font-semibold">
//                             View Details
//                           </Link>
//                         </div>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             )}

//             {/* Empty State */}
//             {!isLoading && filteredProducts.length === 0 && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="bg-white rounded-2xl shadow-sm p-12 text-center">
//                 <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <FiShoppingCart className="w-10 h-10 text-gray-400" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
//                 <p className="text-gray-600 mb-8">
//                   {products.length === 0
//                     ? 'No products available yet. Please check back later.'
//                     : 'Try adjusting your filters to find what you\'re looking for.'}
//                 </p>
//                 {products.length > 0 && (
//                   <button
//                     onClick={() => {
//                       setSelectedCategory('All');
//                       setPriceRange([0, 1000]);
//                       setSortBy('featured');
//                     }}
//                     className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
//                     Reset Filters
//                   </button>
//                 )}
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import { useState, useEffect, Suspense } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import { FiFilter, FiGrid, FiList, FiHeart, FiShoppingCart, FiX, FiStar, FiChevronRight, FiHome } from 'react-icons/fi';
// import { useCartStore, useWishlistStore } from '@/lib/store';
// import { message } from 'antd';
// import { useSearchParams } from 'next/navigation';

// // Separate component that uses useSearchParams
// function ProductsContent() {
//   const { data: session } = useSession();
//   const isAuthed = !!(session && session.user);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const searchQuery = searchParams.get('search') || '';
  
//   const { addItem: addToCart } = useCartStore();
//   const { addItem: addToWishlist, removeItem: removeFromWishlist, items: wishlistItems } = useWishlistStore();
  
//   const [productReviews, setProductReviews] = useState({});
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [viewMode, setViewMode] = useState('grid');
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [categories, setCategories] = useState(['All']);
//   const [isLoading, setIsLoading] = useState(true);
//   const [priceRange, setPriceRange] = useState([0, 10000]);
//   const [sortBy, setSortBy] = useState('featured');

//   const requireAuth = (onAuthed) => {
//     if (!isAuthed) {
//       message.info('Please sign in to continue');
//       router.push('/login');
//       return;
//     }
//     onAuthed();
//   };

//   // Fetch review counts and average ratings
//   useEffect(() => {
//     const fetchReviewCounts = async () => {
//       if (products.length === 0) return;
      
//       const reviewData = {};
      
//       for (const product of products) {
//         try {
//           const res = await fetch(`/api/reviews?productId=${product._id || product.id}`);
//           if (res.ok) {
//             const data = await res.json();
//             const reviews = data.reviews || [];
            
//             // Calculate average rating from reviews
//             let averageRating = 0;
//             if (reviews.length > 0) {
//               const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//               averageRating = totalRating / reviews.length;
//             }
            
//             reviewData[product._id || product.id] = {
//               count: reviews.length,
//               averageRating: averageRating
//             };
//           }
//         } catch (error) {
//           console.error('Failed to fetch reviews:', error);
//         }
//       }
      
//       setProductReviews(reviewData);
//     };
    
//     fetchReviewCounts();
//   }, [products]);

//   const handleAddToCart = async (product) => {
//     requireAuth(async () => {
//       const productId = product._id || product.id;

//       addToCart({
//         ...product,
//         id: productId,
//         quantity: 1,
//       });

//       try {
//         const res = await fetch("/api/cart", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             productId,
//             quantity: 1,
//           }),
//         });

//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error(data.message || "Failed to add to cart");
//         }

//         message.success(`${product.name} added to cart`);
//       } catch (error) {
//         console.error("❌ Cart API error:", error);
//         message.error("Failed to save cart");
//       }
//     });
//   };

//   const handleToggleWishlist = (product) => {
//     requireAuth(() => {
//       const productId = product._id || product.id;
//       const isInWishlist = wishlistItems.some(
//         (item) => (item._id || item.id) === (product._id || product.id)
//       );

//       if (isInWishlist) {
//         removeFromWishlist(productId);
//         message.info(`${product.name} removed from wishlist`);

//         if (session?.user) {
//           fetch('/api/wishlist', {
//             method: 'DELETE',
//             headers: { 'Content-Type': 'application/json' },
//             credentials: 'include',
//             body: JSON.stringify({ productId })
//           }).catch(err => console.error('Failed to remove from wishlist:', err));
//         }
//       } else {
//         addToWishlist(product);
//         message.success(`${product.name} added to wishlist`);

//         if (session?.user) {
//           fetch('/api/wishlist', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             credentials: 'include',
//             body: JSON.stringify({ productId })
//           }).catch(err => console.error('Failed to add to wishlist:', err));
//         }
//       }
//     });
//   };

//   const fetchProductsFromAPI = async () => {
//     setIsLoading(true);
//     try {
//       const timestamp = new Date().getTime();
//       const response = await fetch(`/api/products?t=${timestamp}`, {
//         method: 'GET',
//         headers: {
//           'Cache-Control': 'no-cache, no-store, must-revalidate',
//           'Pragma': 'no-cache',
//           'Expires': '0'
//         },
//         cache: 'no-store'
//       });
//       if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//       const data = await response.json();

//       if (data.success && Array.isArray(data.data)) {
//         const normalized = data.data.map((p) => ({
//           ...p,
//           price: typeof p.price === 'number' ? p.price : Number(p.price ?? 0),
//           quantity: typeof p.quantity === 'number'
//             ? p.quantity
//             : (typeof p.stock === 'number' ? p.stock : 0),
//         }));
//         return normalized;
//       } else {
//         console.error('❌ API returned success:false or invalid data format:', data);
//         return [];
//       }
//     } catch (error) {
//       console.error('❌ Error fetching products:', error);
//       message.error('Failed to load products');
//       return [];
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     let isMounted = true;
//     const loadProducts = async () => {
//       const productsData = await fetchProductsFromAPI();
//       if (isMounted) {
//         setProducts(productsData);
//         setFilteredProducts(productsData);
//         if (productsData.length > 0) {
//           const uniqueCategories = ['All', ...new Set(productsData.map(p => p.category).filter(Boolean))];
//           setCategories(uniqueCategories);
//         }
//       }
//     };
//     loadProducts();
//     return () => { isMounted = false; };
//   }, []);

//   useEffect(() => {
//     let result = [...products];

//     if (selectedCategory !== 'All') {
//       result = result.filter(product => product.category === selectedCategory);
//     }

//     result = result.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

//     if (searchQuery) {
//       const lowerQuery = searchQuery.toLowerCase();
//       result = result.filter(product =>
//         product.name.toLowerCase().includes(lowerQuery) ||
//         (product.description && product.description.toLowerCase().includes(lowerQuery))
//       );
//     }

//     switch (sortBy) {
//       case 'price-low-high': result.sort((a, b) => a.price - b.price); break;
//       case 'price-high-low': result.sort((a, b) => b.price - a.price); break;
//       case 'rating': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
//       default: break;
//     }

//     setFilteredProducts(result);
//   }, [products, selectedCategory, priceRange, sortBy, searchQuery]);

//   const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
//   const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

//   const safeWishlistItems = isAuthed ? wishlistItems : [];

//   return (
//     <div className="bg-white min-h-screen">
//       {/* Breadcrumbs */}
//       <div className="bg-gray-50 border-b border-gray-200">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center gap-2 text-sm">
//             <Link href="/" className="text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1">
//               <FiHome className="w-4 h-4" />
//               Home
//             </Link>
//             <FiChevronRight className="w-4 h-4 text-gray-400" />
//             <span className="text-gray-900 font-medium">Products</span>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Sidebar Filters */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//             className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
//             <div className="bg-white border border-gray-200 sticky top-4">
//               {/* Mobile Close Button */}
//               <div className="flex justify-between items-center p-4 border-b border-gray-200 lg:hidden">
//                 <h3 className="text-lg font-bold text-gray-900">SHOPPING OPTIONS</h3>
//                 <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 transition-colors">
//                   <FiX className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="hidden lg:block p-4 border-b border-gray-200">
//                 <h3 className="text-lg font-bold text-gray-900">SHOPPING OPTIONS</h3>
//               </div>

//               {/* Categories */}
//               <div className="p-4 border-b border-gray-200">
//                 <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">CATEGORY</h4>
//                 <div className="space-y-1">
//                   {categories.map((category) => (
//                     <button
//                       key={category}
//                       onClick={() => setSelectedCategory(category)}
//                       className={`w-full text-left px-3 py-2 text-sm transition-colors ${
//                         selectedCategory === category
//                           ? 'text-red-600 font-semibold'
//                           : 'text-gray-700 hover:text-red-600'
//                       }`}>
//                       {category}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Price Range */}
//               <div className="p-4 border-b border-gray-200">
//                 <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">PRICE</h4>
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="font-medium text-gray-700">PKR {priceRange[0]}</span>
//                     <span className="text-gray-400">-</span>
//                     <span className="font-medium text-gray-700">PKR {priceRange[1]}</span>
//                   </div>
//                   <div className="space-y-2">
//                     <input
//                       type="range"
//                       min="0"
//                       max="1000"
//                       step="50"
//                       value={priceRange[0]}
//                       onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
//                       className="w-full h-1 bg-gray-200 appearance-none cursor-pointer accent-red-600"
//                     />
//                     <input
//                       type="range"
//                       min="0"
//                       max="10000"
//                       step="50"
//                       value={priceRange[1]}
//                       onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
//                       className="w-full h-1 bg-gray-200 appearance-none cursor-pointer accent-red-600"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Sort By */}
//               <div className="p-4">
//                 <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">SORT BY</h4>
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-red-600 bg-white text-gray-700 cursor-pointer">
//                   <option value="featured">Featured</option>
//                   <option value="price-low-high">Price: Low to High</option>
//                   <option value="price-high-low">Price: High to Low</option>
//                   <option value="rating">Highest Rated</option>
//                 </select>
//               </div>
//             </div>
//           </motion.div>

//           {/* Products Grid */}
//           <div className="flex-1">
//             {/* Toolbar */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
//               <div className="flex items-center gap-4 flex-wrap">
//                 <button
//                   onClick={() => setShowFilters(true)}
//                   className="lg:hidden flex items-center gap-2 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-900 transition-colors">
//                   <FiFilter className="w-4 h-4" />
//                   FILTER
//                 </button>
//                 <div className="text-sm text-gray-600">
//                   ITEMS <span className="font-semibold text-gray-900">1-{Math.min(36, filteredProducts.length)}</span> OF <span className="font-semibold text-gray-900">{filteredProducts.length}</span>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="text-sm text-gray-600">
//                   SORT BY
//                 </div>
//                 <div className="flex items-center gap-2 border border-gray-300">
//                   <button
//                     onClick={() => setViewMode('grid')}
//                     className={`p-2 transition-colors ${
//                       viewMode === 'grid'
//                         ? 'bg-black text-white'
//                         : 'bg-white text-gray-600 hover:bg-gray-100'
//                     }`}>
//                     <FiGrid className="w-4 h-4" />
//                   </button>
//                   <button
//                     onClick={() => setViewMode('list')}
//                     className={`p-2 transition-colors ${
//                       viewMode === 'list'
//                         ? 'bg-black text-white'
//                         : 'bg-white text-gray-600 hover:bg-gray-100'
//                     }`}>
//                     <FiList className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Loading State */}
//             {isLoading && (
//               <div className="flex justify-center items-center h-96">
//                 <div className="text-center">
//                   <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
//                   <p className="text-gray-600 font-medium">Loading products...</p>
//                 </div>
//               </div>
//             )}

//             {/* Grid View */}
//             {!isLoading && viewMode === 'grid' && (
//               <motion.div
//                 variants={containerVariants}
//                 initial="hidden"
//                 animate="visible"
//                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredProducts.map((product) => {
//                   const inStock = product.stockStatus === "in-stock";
//                   const isInWishlist = safeWishlistItems.some(
//                     (item) => (item._id || item.id) === (product._id || product.id)
//                   );
//                   const reviewData = productReviews[product._id || product.id] || { count: 0, averageRating: 0 };

//                   return (
//                     <motion.div
//                       key={product._id || product.id}
//                       variants={itemVariants}
//                       className="bg-white group">
//                       {/* Image */}
//                       <div className="relative h-64 overflow-hidden bg-gray-100 mb-3">
//                         <Link href={`/products/${product.slug}`}>
//                           <img
//                             src={product.images?.[0] || '/images/placeholder.jpg'}
//                             alt={product.name}
//                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                             onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
//                           />
//                         </Link>

//                         {/* Discount Badge */}
//                         {!inStock && (
//                           <div className="absolute top-3 left-3">
//                             <span className="bg-red-600 text-white text-xs font-bold px-3 py-1">
//                               OUT OF STOCK
//                             </span>
//                           </div>
//                         )}

//                         {/* Wishlist Button */}
//                         <button
//                           onClick={() => handleToggleWishlist(product)}
//                           className={`absolute top-3 right-3 w-10 h-10 flex items-center justify-center shadow-xl border-2 transition-all z-10 ${
//                             isInWishlist 
//                               ? 'bg-red-600 text-white border-red-600' 
//                               : 'bg-white text-gray-800 border-gray-200 hover:bg-red-600 hover:text-white hover:border-red-600'
//                           }`}>
//                           <FiHeart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
//                         </button>
//                       </div>

//                       {/* Product Info */}
//                       <div className="px-2 pb-2">
//                         <Link href={`/products/${product.slug}`}>
//                           <h3 className="text-sm font-medium text-gray-900 mb-1 hover:text-red-600 transition-colors line-clamp-2 min-h-[2.5rem]">
//                             {product.name}
//                           </h3>
//                         </Link>

//                         {/* Rating and Reviews */}
//                         <div className="flex items-center gap-2 mb-1">
//                           <div className="flex items-center gap-1">
//                             {[...Array(5)].map((_, i) => (
//                               <FiStar
//                                 key={i}
//                                 className={`w-3 h-3 ${
//                                   i < Math.floor(reviewData.averageRating)
//                                     ? 'text-yellow-500 fill-current'
//                                     : 'text-gray-300'
//                                 }`}
//                               />
//                             ))}
//                           </div>
//                           <span className="text-xs text-gray-500">
//                             ({reviewData.count})
//                           </span>
//                         </div>

//                         {/* Price */}
//                         <div className="mb-2">
//                           <span className="text-lg font-bold text-red-600">
//                             PKR {Number(product.price).toFixed(2)}
//                           </span>
//                         </div>

//                         {/* Add to Cart Button */}
//                         <button
//                           onClick={() => handleAddToCart(product)}
//                           disabled={!inStock}
//                           className="w-full bg-black text-white py-2 text-sm font-bold hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-600 uppercase tracking-wide">
//                           ADD TO BAG
//                         </button>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             )}

//             {/* List View */}
//             {!isLoading && viewMode === 'list' && (
//               <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
//                 {filteredProducts.map((product) => {
//                   const inStock = product.stockStatus === "in-stock";
//                   const isInWishlist = safeWishlistItems.some(
//                     (item) => (item._id || item.id) === (product._id || product.id)
//                   );
//                   const reviewData = productReviews[product._id || product.id] || { count: 0, averageRating: 0 };

//                   return (
//                     <motion.div
//                       key={product._id || product.id}
//                       variants={itemVariants}
//                       className="bg-white border border-gray-200 flex flex-col md:flex-row group hover:border-gray-400 transition-colors">
//                       {/* Image */}
//                       <div className="relative w-full md:w-80 aspect-[4/5] md:aspect-auto overflow-hidden bg-gray-100 flex-shrink-0">
//                         <Link href={`/products/${product.slug}`}>
//                           <img
//                             src={product.images?.[0] || '/images/placeholder.jpg'}
//                             alt={product.name}
//                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                             onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
//                           />
//                         </Link>

//                         {!inStock && (
//                           <div className="absolute top-4 left-4">
//                             <span className="bg-red-600 text-white text-xs font-bold px-3 py-1">
//                               OUT OF STOCK
//                             </span>
//                           </div>
//                         )}

//                         {/* Wishlist Button */}
//                         <button
//                           onClick={() => handleToggleWishlist(product)}
//                           className={`absolute top-3 right-3 w-10 h-10 flex items-center justify-center shadow-xl border-2 transition-all z-10 ${
//                             isInWishlist 
//                               ? 'bg-red-600 text-white border-red-600' 
//                               : 'bg-white text-gray-800 border-gray-200 hover:bg-red-600 hover:text-white hover:border-red-600'
//                           }`}>
//                           <FiHeart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
//                         </button>
//                       </div>

//                       {/* Content */}
//                       <div className="p-6 flex-1 flex flex-col">
//                         <div className="flex justify-between items-start mb-4">
//                           <div className="flex-1">
//                             <Link href={`/products/${product.slug}`}>
//                               <h3 className="text-xl font-bold text-gray-900 hover:text-red-600 transition-colors mb-2">
//                                 {product.name}
//                               </h3>
//                             </Link>
//                             <div className="flex items-center gap-2 mb-3">
//                               <div className="flex items-center gap-1">
//                                 {[...Array(5)].map((_, i) => (
//                                   <FiStar
//                                     key={i}
//                                     className={`w-4 h-4 ${
//                                       i < Math.floor(reviewData.averageRating)
//                                         ? 'text-yellow-500 fill-current'
//                                         : 'text-gray-300'
//                                     }`}
//                                   />
//                                 ))}
//                               </div>
//                               <span className="text-sm text-gray-600">
//                                 ({reviewData.averageRating.toFixed(1)}/5)
//                               </span>
//                               <span className="text-sm text-gray-500">
//                                 • {reviewData.count} reviews
//                               </span>
//                             </div>
//                           </div>
//                         </div>

//                         <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
//                           {product.description || 'Premium quality mobile phone and accessories for your daily needs.'}
//                         </p>

//                         <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
//                           <div className="text-2xl font-bold text-red-600">
//                             PKR {Number(product.price).toFixed(2)}
//                           </div>
//                           <div className="flex gap-3">
//                             <button
//                               onClick={() => handleAddToCart(product)}
//                               disabled={!inStock}
//                               className="bg-black text-white px-8 py-3 font-medium hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 text-sm">
//                               ADD TO BAG
//                             </button>
//                             <button
//                               onClick={() => handleToggleWishlist(product)}
//                               className={`w-12 h-12 border-2 transition-colors flex items-center justify-center ${
//                                 isInWishlist
//                                   ? 'border-red-600 bg-red-600 text-white'
//                                   : 'border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600'
//                               }`}>
//                               <FiHeart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             )}

//             {/* Empty State */}
//             {!isLoading && filteredProducts.length === 0 && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="bg-gray-50 border-2 border-dashed border-gray-300 p-16 text-center">
//                 <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <FiShoppingCart className="w-12 h-12 text-gray-400" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
//                 <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                   {products.length === 0
//                     ? 'No products available yet. Please check back later.'
//                     : 'We couldn\'t find any products matching your filters. Try adjusting your search criteria.'}
//                 </p>
//                 {products.length > 0 && (
//                   <button
//                     onClick={() => {
//                       setSelectedCategory('All');
//                       setPriceRange([0, 1000]);
//                       setSortBy('featured');
//                     }}
//                     className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-900 transition-colors">
//                     RESET FILTERS
//                   </button>
//                 )}
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Main component with Suspense boundary
// export default function ProductsPage() {
//   return (
//     <Suspense fallback={
//       <div className="bg-white min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium text-lg">Loading products...</p>
//         </div>
//       </div>
//     }>
//       <ProductsContent />
//     </Suspense>
//   );
// }
'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiFilter, FiGrid, FiList, FiHeart, FiShoppingCart, FiX, FiStar, FiChevronRight, FiHome, FiTrendingUp, FiEye } from 'react-icons/fi';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { message } from 'antd';
import { useSearchParams } from 'next/navigation';

// Recommended Products Component
const RecommendedProducts = ({ currentProducts }) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const isAuthed = !!(session && session.user);
  const router = useRouter();
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, items: wishlistItems } = useWishlistStore();

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        // Fetch products sorted by views and purchases
        const response = await fetch('/api/products/recommended?limit=4');
        const data = await response.json();
        
        if (data.success && data.data) {
          // Filter out products that are already displayed on the page
          const currentProductIds = currentProducts.map(p => p._id || p.id);
          const filtered = data.data.filter(p => !currentProductIds.includes(p._id || p.id));
          setRecommendedProducts(filtered.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching recommended products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentProducts.length > 0) {
      fetchRecommendedProducts();
    }
  }, [currentProducts]);

  const requireAuth = (onAuthed) => {
    if (!isAuthed) {
      message.info('Please sign in to continue');
      router.push('/login');
      return;
    }
    onAuthed();
  };

  const handleAddToCart = async (product) => {
    requireAuth(() => {
      const normalizedProduct = {
        ...product,
        id: product._id || product.id,
        quantity: 1
      };
      addToCart(normalizedProduct);
      message.success(`${product.name} added to cart!`);
    });
  };

  const handleToggleWishlist = (product) => {
    requireAuth(() => {
      const productId = product._id || product.id;
      const isInWishlist = wishlistItems.some(
        (item) => (item._id || item.id) === (product._id || product.id)
      );

      if (isInWishlist) {
        removeFromWishlist(productId);
        message.info(`${product.name} removed from wishlist`);

        if (session?.user) {
          fetch('/api/wishlist', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ productId })
          }).catch(err => console.error('Failed to remove from wishlist:', err));
        }
      } else {
        addToWishlist(product);
        message.success(`${product.name} added to wishlist`);

        if (session?.user) {
          fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ productId })
          }).catch(err => console.error('Failed to add to wishlist:', err));
        }
      }
    });
  };

  if (loading || recommendedProducts.length === 0) {
    return null;
  }

  const safeWishlistItems = isAuthed ? wishlistItems : [];

  return (
    <section className="py-12 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2">
              <FiTrendingUp className="w-4 h-4" />
              RECOMMENDED FOR YOU
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tight mb-2">
            Most Viewed & Purchased
          </h2>
          <p className="text-gray-600 text-sm uppercase tracking-wide">
            Products other customers are buying right now
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recommendedProducts.map((product, index) => {
            const inStock = product.stockStatus === "in-stock";
            const isInWishlist = safeWishlistItems.some(
              (item) => (item._id || item.id) === (product._id || product.id)
            );

            return (
              <motion.div
                key={product._id || product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-300 group hover:border-gray-400 transition-colors"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <Link href={`/products/${product.slug}`}>
                    <img
                      src={product.images?.[0] || '/images/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                    />
                  </Link>

                  {/* View Count Badge */}
                  {product.viewCount && product.viewCount > 0 && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-black text-white text-xs font-bold px-2 py-1 uppercase tracking-wider flex items-center gap-1">
                        <FiEye className="w-3 h-3" />
                        {product.viewCount} VIEWS
                      </span>
                    </div>
                  )}

                  {!inStock && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-red-600 text-white text-xs font-bold px-3 py-1">
                        OUT OF STOCK
                      </span>
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={() => handleToggleWishlist(product)}
                    className={`absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center shadow-xl border-2 transition-all z-10 ${
                      isInWishlist 
                        ? 'bg-red-600 text-white border-red-600' 
                        : 'bg-white text-gray-800 border-gray-200 hover:bg-red-600 hover:text-white hover:border-red-600'
                    }`}>
                    <FiHeart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4 border-t border-gray-200">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 hover:text-red-600 transition-colors line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="mb-3">
                    <span className="text-lg font-bold text-red-600">
                      PKR {Number(product.price).toFixed(2)}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!inStock}
                    className="w-full bg-black text-white py-2 text-sm font-bold hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-600 uppercase tracking-wide">
                    ADD TO BAG
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Separate component that uses useSearchParams
function ProductsContent() {
  const { data: session } = useSession();
  const isAuthed = !!(session && session.user);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, items: wishlistItems } = useWishlistStore();
  
  const [productReviews, setProductReviews] = useState({});
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('featured');

  const requireAuth = (onAuthed) => {
    if (!isAuthed) {
      message.info('Please sign in to continue');
      router.push('/login');
      return;
    }
    onAuthed();
  };

  // Track product views
  const trackProductView = async (productId) => {
    try {
      await fetch('/api/products/track-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  };

  // Fetch review counts and average ratings
  useEffect(() => {
    const fetchReviewCounts = async () => {
      if (products.length === 0) return;
      
      const reviewData = {};
      
      for (const product of products) {
        try {
          const res = await fetch(`/api/reviews?productId=${product._id || product.id}`);
          if (res.ok) {
            const data = await res.json();
            const reviews = data.reviews || [];
            
            // Calculate average rating from reviews
            let averageRating = 0;
            if (reviews.length > 0) {
              const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
              averageRating = totalRating / reviews.length;
            }
            
            reviewData[product._id || product.id] = {
              count: reviews.length,
              averageRating: averageRating
            };
          }
        } catch (error) {
          console.error('Failed to fetch reviews:', error);
        }
      }
      
      setProductReviews(reviewData);
    };
    
    fetchReviewCounts();
  }, [products]);

  const handleAddToCart = async (product) => {
    requireAuth(async () => {
      const productId = product._id || product.id;

      addToCart({
        ...product,
        id: productId,
        quantity: 1,
      });

      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            productId,
            quantity: 1,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to add to cart");
        }

        message.success(`${product.name} added to cart`);
      } catch (error) {
        console.error("❌ Cart API error:", error);
        message.error("Failed to save cart");
      }
    });
  };

  const handleToggleWishlist = (product) => {
    requireAuth(() => {
      const productId = product._id || product.id;
      const isInWishlist = wishlistItems.some(
        (item) => (item._id || item.id) === (product._id || product.id)
      );

      if (isInWishlist) {
        removeFromWishlist(productId);
        message.info(`${product.name} removed from wishlist`);

        if (session?.user) {
          fetch('/api/wishlist', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ productId })
          }).catch(err => console.error('Failed to remove from wishlist:', err));
        }
      } else {
        addToWishlist(product);
        message.success(`${product.name} added to wishlist`);

        if (session?.user) {
          fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ productId })
          }).catch(err => console.error('Failed to add to wishlist:', err));
        }
      }
    });
  };

  const fetchProductsFromAPI = async () => {
    setIsLoading(true);
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/products?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        const normalized = data.data.map((p) => ({
          ...p,
          price: typeof p.price === 'number' ? p.price : Number(p.price ?? 0),
          quantity: typeof p.quantity === 'number'
            ? p.quantity
            : (typeof p.stock === 'number' ? p.stock : 0),
        }));
        return normalized;
      } else {
        console.error('❌ API returned success:false or invalid data format:', data);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      message.error('Failed to load products');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      const productsData = await fetchProductsFromAPI();
      if (isMounted) {
        setProducts(productsData);
        setFilteredProducts(productsData);
        if (productsData.length > 0) {
          const uniqueCategories = ['All', ...new Set(productsData.map(p => p.category).filter(Boolean))];
          setCategories(uniqueCategories);
        }
      }
    };
    loadProducts();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory);
    }

    result = result.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        (product.description && product.description.toLowerCase().includes(lowerQuery))
      );
    }

    switch (sortBy) {
      case 'price-low-high': result.sort((a, b) => a.price - b.price); break;
      case 'price-high-low': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case 'most-viewed': result.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)); break;
      default: break;
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, priceRange, sortBy, searchQuery]);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  const safeWishlistItems = isAuthed ? wishlistItems : [];

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1">
              <FiHome className="w-4 h-4" />
              Home
            </Link>
            <FiChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">Products</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white border border-gray-200 sticky top-4">
              {/* Mobile Close Button */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200 lg:hidden">
                <h3 className="text-lg font-bold text-gray-900">SHOPPING OPTIONS</h3>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="hidden lg:block p-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">SHOPPING OPTIONS</h3>
              </div>

              {/* Categories */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">CATEGORY</h4>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        selectedCategory === category
                          ? 'text-red-600 font-semibold'
                          : 'text-gray-700 hover:text-red-600'
                      }`}>
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">PRICE</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700">PKR {priceRange[0]}</span>
                    <span className="text-gray-400">-</span>
                    <span className="font-medium text-gray-700">PKR {priceRange[1]}</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="50"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full h-1 bg-gray-200 appearance-none cursor-pointer accent-red-600"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="50"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-1 bg-gray-200 appearance-none cursor-pointer accent-red-600"
                    />
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div className="p-4">
                <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">SORT BY</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-red-600 bg-white text-gray-700 cursor-pointer">
                  <option value="featured">Featured</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="most-viewed">Most Viewed</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-900 transition-colors">
                  <FiFilter className="w-4 h-4" />
                  FILTER
                </button>
                <div className="text-sm text-gray-600">
                  ITEMS <span className="font-semibold text-gray-900">1-{Math.min(36, filteredProducts.length)}</span> OF <span className="font-semibold text-gray-900">{filteredProducts.length}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  SORT BY
                </div>
                <div className="flex items-center gap-2 border border-gray-300">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}>
                    <FiGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}>
                    <FiList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center h-96">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading products...</p>
                </div>
              </div>
            )}

            {/* Grid View */}
            {!isLoading && viewMode === 'grid' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const inStock = product.stockStatus === "in-stock";
                  const isInWishlist = safeWishlistItems.some(
                    (item) => (item._id || item.id) === (product._id || product.id)
                  );
                  const reviewData = productReviews[product._id || product.id] || { count: 0, averageRating: 0 };

                  return (
                    <motion.div
                      key={product._id || product.id}
                      variants={itemVariants}
                      className="bg-white group">
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden bg-gray-100 mb-3">
                        <Link 
                          href={`/products/${product.slug}`}
                          onClick={() => trackProductView(product._id || product.id)}
                        >
                          <img
                            src={product.images?.[0] || '/images/placeholder.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                          />
                        </Link>

                        {/* View Count Badge */}
                        {product.viewCount && product.viewCount > 0 && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-black text-white text-xs font-bold px-2 py-1 uppercase tracking-wider flex items-center gap-1">
                              <FiEye className="w-3 h-3" />
                              {product.viewCount}
                            </span>
                          </div>
                        )}

                        {/* Stock Badge */}
                        {!inStock && (
                          <div className="absolute top-3 right-3">
                            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1">
                              OUT OF STOCK
                            </span>
                          </div>
                        )}

                        {/* Wishlist Button */}
                        <button
                          onClick={() => handleToggleWishlist(product)}
                          className={`absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center shadow-xl border-2 transition-all z-10 ${
                            isInWishlist 
                              ? 'bg-red-600 text-white border-red-600' 
                              : 'bg-white text-gray-800 border-gray-200 hover:bg-red-600 hover:text-white hover:border-red-600'
                          }`}>
                          <FiHeart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="px-2 pb-2">
                        <Link 
                          href={`/products/${product.slug}`}
                          onClick={() => trackProductView(product._id || product.id)}
                        >
                          <h3 className="text-sm font-medium text-gray-900 mb-1 hover:text-red-600 transition-colors line-clamp-2 min-h-[2.5rem]">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Rating and Reviews */}
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(reviewData.averageRating)
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            ({reviewData.count})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="mb-2">
                          <span className="text-lg font-bold text-red-600">
                            PKR {Number(product.price).toFixed(2)}
                          </span>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!inStock}
                          className="w-full bg-black text-white py-2 text-sm font-bold hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-600 uppercase tracking-wide">
                          ADD TO BAG
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* List View */}
            {!isLoading && viewMode === 'list' && (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                {filteredProducts.map((product) => {
                  const inStock = product.stockStatus === "in-stock";
                  const isInWishlist = safeWishlistItems.some(
                    (item) => (item._id || item.id) === (product._id || product.id)
                  );
                  const reviewData = productReviews[product._id || product.id] || { count: 0, averageRating: 0 };

                  return (
                    <motion.div
                      key={product._id || product.id}
                      variants={itemVariants}
                      className="bg-white border border-gray-200 flex flex-col md:flex-row group hover:border-gray-400 transition-colors">
                      {/* Image */}
                      <div className="relative w-full md:w-80 aspect-[4/5] md:aspect-auto overflow-hidden bg-gray-100 flex-shrink-0">
                        <Link 
                          href={`/products/${product.slug}`}
                          onClick={() => trackProductView(product._id || product.id)}
                        >
                          <img
                            src={product.images?.[0] || '/images/placeholder.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                          />
                        </Link>

                        {/* View Count Badge */}
                        {product.viewCount && product.viewCount > 0 && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-black text-white text-xs font-bold px-2 py-1 uppercase tracking-wider flex items-center gap-1">
                              <FiEye className="w-3 h-3" />
                              {product.viewCount} VIEWS
                            </span>
                          </div>
                        )}

                        {!inStock && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1">
                              OUT OF STOCK
                            </span>
                          </div>
                        )}

                        {/* Wishlist Button */}
                        <button
                          onClick={() => handleToggleWishlist(product)}
                          className={`absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center shadow-xl border-2 transition-all z-10 ${
                            isInWishlist 
                              ? 'bg-red-600 text-white border-red-600' 
                              : 'bg-white text-gray-800 border-gray-200 hover:bg-red-600 hover:text-white hover:border-red-600'
                          }`}>
                          <FiHeart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <Link 
                              href={`/products/${product.slug}`}
                              onClick={() => trackProductView(product._id || product.id)}
                            >
                              <h3 className="text-xl font-bold text-gray-900 hover:text-red-600 transition-colors mb-2">
                                {product.name}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <FiStar
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(reviewData.averageRating)
                                        ? 'text-yellow-500 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">
                                ({reviewData.averageRating.toFixed(1)}/5)
                              </span>
                              <span className="text-sm text-gray-500">
                                • {reviewData.count} reviews
                              </span>
                              {product.viewCount && product.viewCount > 0 && (
                                <>
                                  <span className="text-sm text-gray-500">•</span>
                                  <span className="text-sm text-gray-600 flex items-center gap-1">
                                    <FiEye className="w-3 h-3" />
                                    {product.viewCount} views
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                          {product.description || 'Premium quality mobile phone and accessories for your daily needs.'}
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
                          <div className="text-2xl font-bold text-red-600">
                            PKR {Number(product.price).toFixed(2)}
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={!inStock}
                              className="bg-black text-white px-8 py-3 font-medium hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 text-sm">
                              ADD TO BAG
                            </button>
                            <button
                              onClick={() => handleToggleWishlist(product)}
                              className={`w-12 h-12 border-2 transition-colors flex items-center justify-center ${
                                isInWishlist
                                  ? 'border-red-600 bg-red-600 text-white'
                                  : 'border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600'
                              }`}>
                              <FiHeart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Empty State */}
            {!isLoading && filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-50 border-2 border-dashed border-gray-300 p-16 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiShoppingCart className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {products.length === 0
                    ? 'No products available yet. Please check back later.'
                    : 'We couldn\'t find any products matching your filters. Try adjusting your search criteria.'}
                </p>
                {products.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setPriceRange([0, 10000]);
                      setSortBy('featured');
                    }}
                    className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-900 transition-colors">
                    RESET FILTERS
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      {!isLoading && filteredProducts.length > 0 && (
        <RecommendedProducts currentProducts={filteredProducts} />
      )}
    </div>
  );
}

// Main component with Suspense boundary
export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}