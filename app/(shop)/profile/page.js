'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiShoppingBag, FiHeart, FiSettings, FiLogOut, FiShoppingCart, FiTrash2, FiEdit2, FiSave, FiX, FiHome, FiChevronRight, FiPackage, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useWishlistStore, useCartStore } from '@/lib/store';
import { message } from 'antd';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    }
  });

  const wishlistItems = useWishlistStore(state => state.items);
  const { addItem: addToCart } = useCartStore();
  const { removeItem: removeFromWishlist } = useWishlistStore();

  const mockOrders = [
    { id: '1001', date: '2023-05-15', total: 249.99, status: 'Delivered', items: 3 },
    { id: '1002', date: '2023-06-22', total: 129.99, status: 'Processing', items: 2 },
    { id: '1003', date: '2023-07-10', total: 349.99, status: 'Shipped', items: 4 },
  ];

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      message.success('Signed out successfully');
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      message.error('Failed to sign out');
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      const userId = session?.user?.id || session?.user?.email || 'guest';
      const savedUserData = localStorage.getItem(`userData-${userId}`);
      
      const fetchProfile = async () => {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const user = await res.json();
          setUserData({
            name: user.name || "",
            email: user.email || "",
            address: user.address || {
              street: "",
              city: "",
              state: "",
              zip: "",
              country: ""
            },
          });
        }
      };

      fetchProfile();
      setIsLoading(false);
    }
  }, [status, router, session]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-48 bg-gray-200 rounded-lg"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
                <div className="md:col-span-3 h-96 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'orders', label: 'Orders', icon: FiShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'Processing':
        return <FiClock className="w-4 h-4" />;
      case 'Shipped':
        return <FiPackage className="w-4 h-4" />;
      default:
        return null;
    }
  };

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
            <span className="text-black font-bold">My Account</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative bg-black rounded-none mb-8 overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <div className="absolute top-10 right-10 w-32 h-32 border-4 border-white transform rotate-45"></div>
              <div className="absolute top-20 right-20 w-24 h-24 border-4 border-red-600 transform -rotate-12"></div>
            </div>

            <div className="relative p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-none overflow-hidden bg-white border-4 border-red-600 shadow-2xl">
                    <img
                      src={session?.user?.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(session?.user?.name || 'User') + '&background=dc2626&color=fff&bold=true'}
                      alt={session?.user?.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase border-2 border-white">
                    PRO
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block mb-2">
                    <div className="bg-red-600 text-white px-4 py-1 text-xs font-bold uppercase tracking-widest border-2 border-white">
                      MEMBER ACCOUNT
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tight">
                    {session?.user?.name || 'User'}
                  </h1>
                  <p className="text-gray-300 text-lg mb-4">{session?.user?.email || 'user@example.com'}</p>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-600 flex items-center justify-center">
                        <FiShoppingBag className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{mockOrders.length}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Orders</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white flex items-center justify-center">
                        <FiHeart className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{wishlistItems.length}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Wishlist</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-white border-2 border-gray-100 sticky top-24">
                <div className="p-4 bg-black border-b-2 border-red-600">
                  <h3 className="text-white font-black uppercase tracking-wide text-sm">Navigation</h3>
                </div>
                <nav className="p-2">
                  <ul className="space-y-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <li key={tab.id}>
                          <button
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 p-4 font-bold uppercase tracking-wide text-sm transition-all duration-300 ${
                              activeTab === tab.id
                                ? 'bg-red-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            {tab.label}
                          </button>
                        </li>
                      );
                    })}
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 p-4 font-bold uppercase tracking-wide text-sm text-red-600 hover:bg-red-50 transition-all duration-300"
                      >
                        <FiLogOut className="w-5 h-5" />
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="bg-white border-2 border-gray-100">
                {/* Content Header */}
                <div className="p-6 border-b-2 border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-red-600"></div>
                    <h2 className="text-2xl font-black text-black uppercase tracking-tight">
                      {tabs.find(t => t.id === activeTab)?.label}
                    </h2>
                  </div>
                  {activeTab === 'profile' && !isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-black hover:bg-red-600 text-white px-6 py-3 font-bold uppercase tracking-wide text-sm transition-all duration-300"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>

                <div className="p-6">
                  {activeTab === 'profile' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={userData.name}
                            onChange={(e) => isEditing && setUserData({...userData, name: e.target.value})}
                            readOnly={!isEditing}
                            className={`w-full p-4 border-2 font-medium ${
                              isEditing 
                                ? 'border-red-600 bg-white focus:outline-none focus:ring-2 focus:ring-red-600' 
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={userData.email}
                            onChange={(e) => isEditing && setUserData({...userData, email: e.target.value})}
                            readOnly={!isEditing}
                            className={`w-full p-4 border-2 font-medium ${
                              isEditing 
                                ? 'border-red-600 bg-white focus:outline-none focus:ring-2 focus:ring-red-600' 
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          />
                        </div>
                      </div>

                      {isEditing && (
                        <div className="pt-6 border-t-2 border-gray-100">
                          <h3 className="text-lg font-black mb-4 uppercase tracking-wide">Shipping Address</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                Street Address
                              </label>
                              <input
                                type="text"
                                value={userData.address.street}
                                onChange={(e) => setUserData({
                                  ...userData, 
                                  address: {...userData.address, street: e.target.value}
                                })}
                                className="w-full p-4 border-2 border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                City
                              </label>
                              <input
                                type="text"
                                value={userData.address.city}
                                onChange={(e) => setUserData({
                                  ...userData, 
                                  address: {...userData.address, city: e.target.value}
                                })}
                                className="w-full p-4 border-2 border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                State/Province
                              </label>
                              <input
                                type="text"
                                value={userData.address.state}
                                onChange={(e) => setUserData({
                                  ...userData, 
                                  address: {...userData.address, state: e.target.value}
                                })}
                                className="w-full p-4 border-2 border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                ZIP/Postal Code
                              </label>
                              <input
                                type="text"
                                value={userData.address.zip}
                                onChange={(e) => setUserData({
                                  ...userData, 
                                  address: {...userData.address, zip: e.target.value}
                                })}
                                className="w-full p-4 border-2 border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {isEditing && (
                        <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
                          <button 
                            onClick={async () => {
                              setIsEditing(false);
                              try {
                                const res = await fetch("/api/user/profile", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify(userData),
                                });

                                const result = await res.json();
                                if (result.success) {
                                  message.success("Profile updated successfully!");
                                  setUserData(result.user);
                                } else {
                                  message.error("Failed to update profile");
                                }
                              } catch (error) {
                                console.error(error);
                                message.error("Something went wrong");
                              }
                            }}
                            className="flex items-center gap-2 bg-red-600 hover:bg-black text-white px-8 py-4 font-bold uppercase tracking-wide text-sm transition-all duration-300"
                          >
                            <FiSave className="w-4 h-4" />
                            Save Changes
                          </button>
                          <button 
                            onClick={() => {
                              setIsEditing(false);
                              message.info('Edits cancelled');
                            }}
                            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-black px-8 py-4 font-bold uppercase tracking-wide text-sm transition-all duration-300"
                          >
                            <FiX className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'orders' && (
                    <div>
                      {mockOrders.length > 0 ? (
                        <div className="space-y-4">
                          {mockOrders.map((order) => (
                            <div key={order.id} className="border-2 border-gray-100 hover:border-red-600 transition-all duration-300">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-16 h-16 bg-black flex items-center justify-center">
                                    <FiShoppingBag className="w-8 h-8 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-black text-lg uppercase">Order #{order.id}</p>
                                    <p className="text-sm text-gray-600 font-medium">{order.date} • {order.items} items</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <p className="font-black text-xl text-red-600">${order.total.toFixed(2)}</p>
                                  </div>
                                  <span className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <div className="w-24 h-24 bg-gray-100 mx-auto mb-6 flex items-center justify-center">
                            <FiShoppingBag className="w-12 h-12 text-gray-300" />
                          </div>
                          <p className="text-gray-500 mb-6 font-medium text-lg">
                            You haven't placed any orders yet.
                          </p>
                          <Link 
                            href="/products"
                            className="inline-block bg-red-600 hover:bg-black text-white px-8 py-4 font-bold uppercase tracking-wide text-sm transition-all duration-300"
                          >
                            Start Shopping
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'wishlist' && (
                    <div>
                      {wishlistItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {wishlistItems.map((item) => (
                            <div key={item._id || item.id} className="border-2 border-gray-100 hover:border-red-600 transition-all duration-300 group">
                              <div className="relative h-48 bg-gray-100 overflow-hidden">
                                {(item.images?.[0] || item.image) && (
                                  <img 
                                    src={item.images?.[0] || item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                )}
                                <button 
                                  onClick={() => {
                                    removeFromWishlist(item._id || item.id);
                                    message.success(`${item.name} removed from wishlist`);
                                  }}
                                  className="absolute top-2 right-2 w-10 h-10 bg-white hover:bg-red-600 text-gray-700 hover:text-white flex items-center justify-center transition-all duration-300"
                                >
                                  <FiTrash2 className="w-5 h-5" />
                                </button>
                              </div>
                              <div className="p-4">
                                <h3 className="font-bold text-black mb-2 uppercase tracking-wide text-sm">{item.name}</h3>
                                <p className="text-red-600 font-black text-xl mb-4">${item.price?.toFixed(2) || '0.00'}</p>
                                <button 
                                  onClick={() => {
                                    addToCart(item);
                                    message.success(`${item.name} added to cart!`);
                                  }}
                                  className="w-full flex items-center justify-center gap-2 bg-black hover:bg-red-600 text-white px-4 py-3 font-bold uppercase tracking-wide text-sm transition-all duration-300"
                                >
                                  <FiShoppingCart className="w-4 h-4" />
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <div className="w-24 h-24 bg-gray-100 mx-auto mb-6 flex items-center justify-center">
                            <FiHeart className="w-12 h-12 text-gray-300" />
                          </div>
                          <p className="text-gray-500 mb-6 font-medium text-lg">
                            You don't have any items in your wishlist yet.
                          </p>
                          <Link 
                            href="/products"
                            className="inline-block bg-red-600 hover:bg-black text-white px-8 py-4 font-bold uppercase tracking-wide text-sm transition-all duration-300"
                          >
                            Browse Products
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-black mb-6 uppercase tracking-wide flex items-center gap-3">
                          <div className="w-1 h-6 bg-red-600"></div>
                          Change Password
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                              Current Password
                            </label>
                            <input
                              type="password"
                              className="w-full p-4 border-2 border-gray-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
                              placeholder="Enter current password"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                              New Password
                            </label>
                            <input
                              type="password"
                              className="w-full p-4 border-2 border-gray-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
                              placeholder="Enter new password"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              className="w-full p-4 border-2 border-gray-200 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
                              placeholder="Confirm new password"
                            />
                          </div>
                          <button 
                            onClick={() => message.info('Password change functionality will be implemented soon')}
                            className="bg-red-600 hover:bg-black text-white px-8 py-4 font-bold uppercase tracking-wide text-sm transition-all duration-300"
                          >
                            Update Password
                          </button>
                        </div>
                      </div>

                      <div className="pt-8 border-t-2 border-gray-100">
                        <h3 className="text-lg font-black mb-6 uppercase tracking-wide flex items-center gap-3">
                          <div className="w-1 h-6 bg-red-600"></div>
                          Danger Zone
                        </h3>
                        <div className="border-2 border-red-600 p-6">
                          <p className="text-gray-700 mb-4 font-medium">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <button 
                            onClick={() => message.warning('Account deletion is not available in demo mode')}
                            className="bg-red-600 hover:bg-black text-white px-6 py-3 font-bold uppercase tracking-wide text-sm transition-all duration-300"
                          >
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}