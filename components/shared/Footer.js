'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiTwitter, FiFacebook, FiYoutube, FiLinkedin, FiMail, FiPhone, FiMapPin, FiArrowRight, FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Subscribe email:', email);
    setEmail('');
  };

  const socialLinks = [
    { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FiFacebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: FiYoutube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  const shopLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Condition', href: '/terms' },
    { label: 'Return Policy', href: '/return-policy' },
    { label: 'FAQs & Help', href: '/faqs' },
  ];

  const accountLinks = [
    { label: 'My Account', href: '/account' },
    { label: 'Shop Details', href: '/shop-details' },
    { label: 'Shopping Cart', href: '/cart' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Order History', href: '/order-history' },
    { label: 'International Orders', href: '/international-orders' },
  ];

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-1/4 w-96 h-96 border-4 border-white transform rotate-45"></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 border-4 border-red-600 transform -rotate-12"></div>
      </div>

      {/* Diagonal stripe overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, white 50px, white 51px)'
        }}
      ></div>

      {/* Newsletter Section */}
      <div className="relative border-b-2 border-white/10">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Logo and Tagline */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-start"
            >
              <div className="relative mb-4">
                <Image
                  src="/logoreal1.png"
                  alt="Mobile Accessories Logo"
                  width={200}
                  height={70}
                  className="brightness-0 invert"
                />
                {/* Red accent line under logo */}
                <div className="absolute -bottom-2 left-0 w-20 h-1 bg-red-600"></div>
              </div>
              <p className="text-red-600 text-lg font-bold uppercase tracking-wider">
                Affordable Prices
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Premium Quality • Fast Delivery
              </p>
            </motion.div>

            {/* Newsletter Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 max-w-2xl w-full"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">
                  SUBSCRIBE <span className="text-red-600">NEWSLETTER</span>
                </h3>
                <p className="text-gray-400 text-sm">
                  Get exclusive deals and updates directly to your inbox
                </p>
              </div>
              <div className="relative">
                <div className="flex items-center bg-white overflow-hidden border-2 border-transparent focus-within:border-red-600 transition-all duration-300">
                  <FiMail className="w-5 h-5 text-gray-400 ml-6" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-4 text-gray-700 outline-none text-base font-medium"
                  />
                  <button
                    onClick={handleSubscribe}
                    className="bg-red-600 hover:bg-black text-white font-bold px-8 py-4 transition-all duration-300 uppercase tracking-wider text-sm flex items-center gap-2 group border-2 border-red-600"
                  >
                    <span>Subscribe</span>
                    <FiSend className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Social Media Icons */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center lg:items-end"
            >
              <p className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                Follow Us
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/5 border-2 border-white/20 hover:border-red-600 hover:bg-red-600 flex items-center justify-center transition-all duration-300 group backdrop-blur-sm"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Why People Like us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-red-600"></div>
              <h3 className="text-white text-xl font-black uppercase tracking-wide">
                Why Choose Us
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 font-light">
              We provide high-quality mobile accessories at affordable prices. Our products are tested for durability and style, making them the first choice for smartphone users.
            </p>
            <Link href="/about">
              <button className="group inline-flex items-center gap-3 bg-transparent border-2 border-white hover:bg-red-600 hover:border-red-600 text-white px-6 py-3 font-bold uppercase tracking-wider text-sm transition-all duration-300">
                Read More
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

          {/* Shop Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-red-600"></div>
              <h3 className="text-white text-xl font-black uppercase tracking-wide">
                Shop Info
              </h3>
            </div>
            <ul className="space-y-3">
              {shopLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="group inline-flex items-center gap-2 text-gray-400 hover:text-red-600 transition-colors font-medium"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-red-600 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Account */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-red-600"></div>
              <h3 className="text-white text-xl font-black uppercase tracking-wide">
                Account
              </h3>
            </div>
            <ul className="space-y-3">
              {accountLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="group inline-flex items-center gap-2 text-gray-400 hover:text-red-600 transition-colors font-medium"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-red-600 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-red-600"></div>
              <h3 className="text-white text-xl font-black uppercase tracking-wide">
                Contact
              </h3>
            </div>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-white/5 border border-white/20 group-hover:border-red-600 group-hover:bg-red-600 flex items-center justify-center flex-shrink-0 transition-all duration-300">
                  <FiMapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm uppercase tracking-wide mb-1">Address</p>
                  <p className="text-sm">1429 Netus Rd, NY 48247</p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-white/5 border border-white/20 group-hover:border-red-600 group-hover:bg-red-600 flex items-center justify-center flex-shrink-0 transition-all duration-300">
                  <FiMail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm uppercase tracking-wide mb-1">Email</p>
                  <p className="text-sm">Example@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-white/5 border border-white/20 group-hover:border-red-600 group-hover:bg-red-600 flex items-center justify-center flex-shrink-0 transition-all duration-300">
                  <FiPhone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm uppercase tracking-wide mb-1">Phone</p>
                  <p className="text-sm">+0123 4567 8910</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="font-bold text-white text-sm uppercase tracking-wide mb-3">
                  Payment Accepted
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="w-12 h-8 bg-white/5 border border-white/20 flex items-center justify-center text-[10px] font-bold">
                    VISA
                  </div>
                  <div className="w-12 h-8 bg-white/5 border border-white/20 flex items-center justify-center text-[10px] font-bold">
                    MC
                  </div>
                  <div className="w-12 h-8 bg-white/5 border border-white/20 flex items-center justify-center text-[10px] font-bold">
                    PP
                  </div>
                  <div className="w-12 h-8 bg-white/5 border border-white/20 flex items-center justify-center text-[10px] font-bold">
                    AE
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="relative border-t-2 border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-400 font-medium">
              © 2024 <Link href="/" className="text-red-600 hover:text-white transition-colors font-bold">Mobile Phone Store</Link>. All rights reserved.
            </p>

            {/* Additional Links */}
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-red-600 transition-colors font-medium">
                Privacy
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/terms" className="text-gray-400 hover:text-red-600 transition-colors font-medium">
                Terms
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/sitemap" className="text-gray-400 hover:text-red-600 transition-colors font-medium">
                Sitemap
              </Link>
            </div>

            {/* Back to top indicator */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hidden md:flex items-center gap-2 text-gray-400 hover:text-red-600 transition-colors text-sm font-medium group"
            >
              <span>Back to Top</span>
              <div className="w-8 h-8 border-2 border-white/20 group-hover:border-red-600 flex items-center justify-center">
                <span className="text-xl">↑</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Corner accent decoration */}
      <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10">
        <div className="absolute bottom-0 left-0 w-full h-full border-b-4 border-l-4 border-red-600"></div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="absolute top-0 right-0 w-full h-full border-t-4 border-r-4 border-white"></div>
      </div>
    </footer>
  );
}