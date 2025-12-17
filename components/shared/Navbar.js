'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Heart, Menu, X, Search, ChevronDown } from 'lucide-react';
import { useUIStore, useCartStore, useWishlistStore } from '@/lib/store';
import Image from 'next/image';

export default function Navbar() {
  const { data: session } = useSession();
  const isAuthed = !!session?.user;
  const pathname = usePathname();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);

  const { toggleCart } = useUIStore();
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);

  const cartTotal = useMemo(() => {
    if (!isAuthed) return 0;
    return cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
  }, [isAuthed, cartItems]);

  /** Fetch categories from backend */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Failed to fetch categories", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  /** Scroll listener */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** Close mobile menu on route change */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
  };

  const handleCartClick = () => {
    if (!isAuthed) {
      router.push('/login');
      return;
    }
    toggleCart();
  };

  const handleWishlistClick = () => {
    if (!isAuthed) {
      router.push('/login');
      return;
    }
    router.push('/wishlist');
  };

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-white'
        } border-b border-gray-200`}
      >
        <div className="container mx-auto px-4">

          {/* NAV TOP ROW */}
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center z-50">
              <div className="relative h-10 w-32 lg:h-12 lg:w-40">
                <Image
                  src="/logoreal1.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center space-x-8">
              
              {/* NORMAL LINKS */}
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold uppercase tracking-wide transition-colors ${
                    pathname === link.href
                      ? 'text-black'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* ✅ SHOW CATEGORIES ONLY IF THEY EXIST */}
              {categories.length > 0 && (
                <div className="relative group">
                  <button className="text-sm font-semibold uppercase tracking-wide text-gray-600 hover:text-black transition-colors flex items-center gap-1">
                    Categories
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* DROPDOWN */}
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/category/${cat.slug}`}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors border-b border-gray-100 last:border-0"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </nav>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3 lg:gap-4">
              
              {/* DESKTOP SEARCH */}
              <div className="hidden lg:flex items-center border border-gray-300 overflow-hidden">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit(e);
                    }
                  }}
                  className="px-3 py-2 w-48 focus:outline-none text-sm"
                />
                <button
                  onClick={handleSearchSubmit}
                  className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-gray-900 transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>

              {/* WISHLIST - Desktop */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWishlistClick}
                className="hidden lg:flex relative w-10 h-10 items-center justify-center border-2 border-gray-300 hover:border-red-600 transition-colors"
              >
                <Heart className={`h-5 w-5 ${wishlistItems.length > 0 ? 'text-red-600 fill-current' : 'text-gray-700'}`} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </motion.button>

              {/* CART - Desktop & Mobile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCartClick}
                className="hidden lg:flex relative w-10 h-10 items-center justify-center bg-black text-white hover:bg-gray-900 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                    {cartItems.length}
                  </span>
                )}
              </motion.button>

              {/* USER ICON - Desktop */}
              {isAuthed ? (
                <div className="hidden lg:block relative group">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 hover:border-black transition-colors"
                  >
                    <User className="h-5 w-5 text-gray-700" />
                  </motion.button>

                  {/* USER DROPDOWN */}
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                      <p className="text-sm font-bold text-gray-900 truncate">{session.user?.name}</p>
                      <p className="text-xs text-gray-600 truncate">{session.user?.email}</p>
                    </div>

                    <Link href="/profile" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100">
                      My Profile
                    </Link>

                    <Link href="/orders" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100">
                      My Orders
                    </Link>

                    <Link href="/wishlist" className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex justify-between border-b border-gray-100">
                      Wishlist
                      {wishlistItems.length > 0 && (
                        <span className="bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                          {wishlistItems.length}
                        </span>
                      )}
                    </Link>

                    {session.user?.role === 'admin' && (
                      <Link href="/admin" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100">
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-semibold"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="hidden lg:block">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 border-2 border-gray-300 hover:border-black flex items-center justify-center transition-colors">
                    <User className="h-5 w-5 text-gray-700" />
                  </motion.button>
                </Link>
              )}

              {/* MOBILE ICONS - Cart, Wishlist, Profile */}
              <div className="flex lg:hidden items-center gap-2">
                {/* Mobile Wishlist */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleWishlistClick}
                  className="relative w-10 h-10 flex items-center justify-center border-2 border-gray-300"
                >
                  <Heart className={`h-5 w-5 ${wishlistItems.length > 0 ? 'text-red-600 fill-current' : 'text-gray-700'}`} />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </motion.button>

                {/* Mobile Cart */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCartClick}
                  className="relative w-10 h-10 flex items-center justify-center bg-black text-white"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                      {cartItems.length}
                    </span>
                  )}
                </motion.button>

                {/* Mobile Profile/Login */}
                {isAuthed ? (
                  <Link href="/profile">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 flex items-center justify-center border-2 border-gray-300"
                    >
                      <User className="h-5 w-5 text-gray-700" />
                    </motion.button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 flex items-center justify-center border-2 border-gray-300"
                    >
                      <User className="h-5 w-5 text-gray-700" />
                    </motion.button>
                  </Link>
                )}

                {/* MOBILE MENU TOGGLE */}
                <motion.button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="border-2 border-black text-black w-10 h-10 flex items-center justify-center z-50 relative"
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence mode="wait">
                    {mobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            />

            {/* Sliding Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 300,
              }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              {/* Menu Header */}
              <div className="bg-black p-6 pt-20">
                {isAuthed ? (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-12 h-12 bg-white/20 flex items-center justify-center border-2 border-white/50">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-base truncate max-w-[180px]">{session.user?.name}</p>
                      <p className="text-gray-300 text-xs truncate max-w-[180px]">{session.user?.email}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-white font-bold text-xl">Welcome!</h2>
                    <p className="text-gray-300 text-sm mt-1">Sign in to continue</p>
                  </motion.div>
                )}
              </div>

              {/* Menu Content */}
              <div className="p-6">
                {/* Mobile Search */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-6"
                >
                  <div className="flex items-center border border-gray-300">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearchSubmit(e);
                          setMobileMenuOpen(false);
                        }
                      }}
                      className="px-3 py-2 w-full focus:outline-none text-sm"
                    />
                    <button
                      onClick={(e) => {
                        handleSearchSubmit(e);
                        setMobileMenuOpen(false);
                      }}
                      className="w-10 h-10 bg-black text-white flex items-center justify-center"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>

                {/* Navigation Links */}
                <div className="space-y-1 mb-6">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={`block px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-all ${
                          pathname === link.href
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Categories Section */}
                {categories.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                  >
                    <button
                      onClick={() => setShowCategories(!showCategories)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold uppercase tracking-wide text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Categories
                      <ChevronDown className={`w-4 h-4 transition-transform ${showCategories ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {showCategories && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-gray-200">
                            {categories.map((cat, index) => (
                              <motion.div
                                key={cat._id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Link
                                  href={`/category/${cat.slug}`}
                                  className="block px-8 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                                >
                                  {cat.name}
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Account Section */}
                {isAuthed && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="border-t border-gray-200 pt-6"
                  >
                    <div className="space-y-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        My Profile
                      </Link>

                      <Link
                        href="/orders"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        My Orders
                      </Link>

                      <Link
                        href="/wishlist"
                        className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <span>Wishlist</span>
                        {wishlistItems.length > 0 && (
                          <span className="bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                            {wishlistItems.length}
                          </span>
                        )}
                      </Link>

                      {session.user?.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                    </div>

                    {/* Sign Out Button */}
                    <motion.div
                      className="mt-6"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={() => signOut()}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 font-semibold text-sm uppercase tracking-wide transition-colors"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  </motion.div>
                )}

                {!isAuthed && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="border-t border-gray-200 pt-6"
                  >
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        href="/login"
                        className="block w-full bg-black hover:bg-gray-900 text-white py-3 font-semibold text-sm uppercase tracking-wide transition-colors text-center"
                      >
                        Sign In
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}