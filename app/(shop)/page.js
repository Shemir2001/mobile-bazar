// 'use client';

// import { useEffect, useRef } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { motion, useScroll, useTransform, useInView } from 'framer-motion';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { useProductStore } from '@/lib/store';

// // Components
// import FeaturedProducts from '@/components/shared/FeaturedProducts';
// import NewsletterSection from '@/components/shared/NewsletterSection';

// export default function HomePage() {
//   // Fetch products from database
//   const fetchProducts = useProductStore((state) => state.fetchProducts);
  
//   useEffect(() => {
//     // Load products on page load
//     fetchProducts();
//   }, [fetchProducts]);
  
//   const heroRef = useRef(null);
//   const aboutRef = useRef(null);
//   const isAboutInView = useInView(aboutRef, { once: true, amount: 0.3 });
  
//   const { scrollYProgress } = useScroll({
//     target: heroRef,
//     offset: ['start start', 'end start'],
//   });
  
//   const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
//   const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
//   const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

//   useEffect(() => {
//     gsap.registerPlugin(ScrollTrigger);
    
//     // Water ripple effect on hero section
//     const rippleAnimation = () => {
//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: heroRef.current,
//           start: 'top top',
//           end: 'bottom top',
//           scrub: true,
//         },
//       });
      
//       tl.to('.water-ripple', {
//         scale: 1.2,
//         opacity: 0.7,
//         stagger: 0.2,
//         duration: 2,
//         ease: 'power2.out',
//         repeat: -1,
//         yoyo: true,
//       });
      
//       return tl;
//     };
    
//     const ctx = gsap.context(() => {
//       rippleAnimation();
//     });
    
//     return () => ctx.revert();
//   }, []);

//   return (
//     <main className="overflow-hidden">
//       {/* Hero Section */}
//       <motion.section
//         ref={heroRef}
//         className="relative h-screen flex items-center justify-center overflow-hidden"
//         style={{
//           opacity: heroOpacity,
//           scale: heroScale,
//           y: heroY,
//         }}
//       >
//         {/* Background with water effect */}
//         <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-blue-600/40 z-0">
//           {/* Water ripple circles */}
//           {[...Array(5)].map((_, i) => (
//             <div
//               key={i}
//               className="water-ripple absolute rounded-full border-2 border-blue-300/30 z-0"
//               style={{
//                 width: `${(i + 1) * 10}%`,
//                 height: `${(i + 1) * 10}%`,
//                 left: '50%',
//                 top: '50%',
//                 transform: 'translate(-50%, -50%)',
//                 opacity: 0.3 - i * 0.05,
//               }}
//             />
//           ))}
//         </div>
        
//         {/* Hero Content */}
//         <div className="container mx-auto px-4 z-10 text-center">
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
//           >
//             Elegant <span className="text-blue-300">Fountains</span> for Your Space
//           </motion.h1>
          
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//             className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
//           >
//             Transform your environment with our stunning collection of premium water fountains
//           </motion.p>
          
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.6 }}
//             className="flex flex-col sm:flex-row gap-4 justify-center"
//           >
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-medium text-lg shadow-lg"
//             >
//               <Link href="/products">
//                 Shop Collection
//               </Link>
//             </motion.button>
            
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-full font-medium text-lg"
//             >
//               <Link href="/about">
//                 Learn More
//               </Link>
//             </motion.button>
//           </motion.div>
//         </div>
        
//         {/* Scroll indicator */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1, duration: 1 }}
//           className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
//         >
//           <motion.div
//             animate={{ y: [0, 10, 0] }}
//             transition={{ repeat: Infinity, duration: 1.5 }}
//             className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
//           >
//             <motion.div
//               animate={{ y: [0, 15, 0] }}
//               transition={{ repeat: Infinity, duration: 1.5 }}
//               className="w-1.5 h-3 bg-white rounded-full mt-2"
//             />
//           </motion.div>
//         </motion.div>
//       </motion.section>
      
//       {/* About Section */}
//       <section ref={aboutRef} className="py-20 bg-white dark:bg-gray-900">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
//             transition={{ duration: 0.8 }}
//             className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
//           >
//             <div>
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
//                 Crafting Serenity Through Water
//               </h2>
//               <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
//                 At FountainFlow, we believe in the transformative power of water. Our artisanal fountains are designed to bring tranquility, beauty, and a touch of luxury to any space.
//               </p>
//               <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
//                 Each fountain is meticulously crafted using premium materials and innovative design techniques to create a perfect harmony of form and function.
//               </p>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
//               >
//                 <Link href="/about">
//                   Our Story
//                 </Link>
//               </motion.button>
//             </div>
//             <div className="relative">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={isAboutInView ? { opacity: 1, scale: 1 } : {}}
//                 transition={{ duration: 0.8, delay: 0.2 }}
//                 className="rounded-lg overflow-hidden shadow-2xl"
//               >
//                 <div className="aspect-w-4 aspect-h-3 relative">
//                   <div className="w-full h-full bg-blue-200 flex items-center justify-center">
//                     <div className="text-blue-500 text-lg">Fountain Image Placeholder</div>
//                   </div>
//                 </div>
//               </motion.div>
//               <motion.div
//                 initial={{ opacity: 0, x: 50 }}
//                 animate={isAboutInView ? { opacity: 1, x: 0 } : {}}
//                 transition={{ duration: 0.8, delay: 0.4 }}
//                 className="absolute -bottom-6 -right-6 bg-blue-100 dark:bg-blue-900 p-6 rounded-lg shadow-lg"
//               >
//                 <div className="flex items-center gap-2 mb-2">
//                   <div className="text-blue-600 dark:text-blue-400">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                   <span className="text-gray-800 dark:text-gray-200 font-medium">Handcrafted Quality</span>
//                 </div>
//                 <div className="flex items-center gap-2 mb-2">
//                   <div className="text-blue-600 dark:text-blue-400">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                   <span className="text-gray-800 dark:text-gray-200 font-medium">Premium Materials</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="text-blue-600 dark:text-blue-400">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                   <span className="text-gray-800 dark:text-gray-200 font-medium">2-Year Warranty</span>
//                 </div>
//               </motion.div>
//             </div>
//           </motion.div>
//         </div>
//       </section>
      
//       {/* Featured Products Section */}
//       <FeaturedProducts />
      
//       {/* Newsletter Section */}
//       <NewsletterSection />
//     </main>
//   );
// }
// 'use client';

// import { useEffect, useRef } from 'react';
// import Link from 'next/link';
// import { motion, useScroll, useTransform, useInView } from 'framer-motion';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { useProductStore } from '@/lib/store';

// import FeaturedProducts from '@/components/shared/FeaturedProducts';
// import NewsletterSection from '@/components/shared/NewsletterSection';

// export default function HomePage() {
//   const fetchProducts = useProductStore((state) => state.fetchProducts);

//   // Fetch all products once when the home page loads
//   useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   const heroRef = useRef(null);
//   const aboutRef = useRef(null);
//   const isAboutInView = useInView(aboutRef, { once: true, amount: 0.3 });

//   const { scrollYProgress } = useScroll({
//     target: heroRef,
//     offset: ['start start', 'end start'],
//   });

//   const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
//   const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
//   const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

//   useEffect(() => {
//     gsap.registerPlugin(ScrollTrigger);

//     const rippleAnimation = () => {
//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: heroRef.current,
//           start: 'top top',
//           end: 'bottom top',
//           scrub: true,
//         },
//       });

//       tl.to('.water-ripple', {
//         scale: 1.2,
//         opacity: 0.7,
//         stagger: 0.2,
//         duration: 2,
//         ease: 'power2.out',
//         repeat: -1,
//         yoyo: true,
//       });

//       return tl;
//     };

//     const ctx = gsap.context(() => {
//       rippleAnimation();
//     });

//     return () => ctx.revert();
//   }, []);

//   return (
//     <main className="overflow-hidden">
//       {/* Hero Section */}
//       <motion.section
//         ref={heroRef}
//         className="relative h-screen flex items-center justify-center overflow-hidden"
//         style={{
//           opacity: heroOpacity,
//           scale: heroScale,
//           y: heroY,
//         }}
//       >
//         {/* background and content ... exactly as you already had */}
//         {/* ... */}
//       </motion.section>

//       {/* About section ... (unchanged) */}
//       {/* ... */}

//       {/* Featured Products Section */}
//       <FeaturedProducts />

//       {/* Newsletter Section */}
//       <NewsletterSection />
//     </main>
//   );
// }
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useProductStore } from '@/lib/store';
import FeaturedProducts from '@/components/shared/FeaturedProducts';
import NewsletterSection from '@/components/shared/NewsletterSection';
import RecentProduct from '@/components/shared/recentProduct';
import HeroSlider from '@/components/shared/heroSection';
import SectionLast from '@/components/shared/sectionlast';
import SectionMid from '@/components/shared/sectionmid';
import { motion, AnimatePresence } from 'framer-motion';
import Typed from 'typed.js';
import { FiChevronLeft, FiChevronRight, FiShoppingBag, FiTrendingUp, FiAward } from 'react-icons/fi';
import UniqueHomepageSections from '@/components/shared/uniqueHome';

const heroSlides = [
  {
    id: 1,
    image: '/coverpic.jpg',
    title: 'EXPERIENCE CUTTING-EDGE',
    subtitle: 'MOBILE TECHNOLOGY',
    description: 'Explore the latest smartphones, premium cases, chargers, and accessories designed to keep you connected and stylish.',
 
  },
  {
    id: 2,
    image: '/coverpic2.jpg',
    title: 'UPGRADE YOUR',
    subtitle: 'MOBILE EXPERIENCE',
    description: 'From sleek phone cases to high-speed chargers and wireless earbuds, find everything to enhance your mobile experience.',
    
  },
  {
    id: 3,
    image: '/coverpic3.jpg',
    title: 'INNOVATIVE DEVICES',
    subtitle: 'FOR MODERN LIVING',
    description: 'Discover a curated collection of mobile phones and accessories built for performance, style, and convenience.',
    
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const typedTitleInstance = useRef(null);
  const typedSubtitleInstance = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Typing animation effect
  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return;

    // Destroy previous instances
    if (typedTitleInstance.current) {
      typedTitleInstance.current.destroy();
    }
    if (typedSubtitleInstance.current) {
      typedSubtitleInstance.current.destroy();
    }

    // Clear the content
    titleRef.current.textContent = '';
    subtitleRef.current.textContent = '';

    // Create new typed instances
    typedTitleInstance.current = new Typed(titleRef.current, {
      strings: [heroSlides[currentSlide].title],
      typeSpeed: 50,
      showCursor: false,
      loop: false,
      onComplete: () => {
        // Start subtitle typing after title is complete
        if (subtitleRef.current) {
          typedSubtitleInstance.current = new Typed(subtitleRef.current, {
            strings: [heroSlides[currentSlide].subtitle],
            typeSpeed: 50,
            showCursor: false,
            loop: false,
          });
        }
      }
    });

    return () => {
      if (typedTitleInstance.current) {
        typedTitleInstance.current.destroy();
      }
      if (typedSubtitleInstance.current) {
        typedSubtitleInstance.current.destroy();
      }
    };
  }, [currentSlide]);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="w-full">
      {/* ===== HERO SLIDER SECTION ===== */}
      <section className="relative h-screen min-h-[600px] max-h-[900px] w-full overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          {heroSlides.map(
            (slide, index) =>
              index === currentSlide && (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  {/* Background Image with Parallax Effect */}
                  <div className="absolute inset-0">
                    <motion.img
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 8, ease: 'linear' }}
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Gradient overlays for dramatic effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
                    
                    {/* Animated diagonal stripes overlay */}
                    <div className="absolute inset-0 opacity-5" style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, white 50px, white 51px)'
                    }}></div>
                  </div>

                  {/* Content Overlay */}
                  <div className="relative h-full flex items-center">
                    <div className="container mx-auto px-4 md:px-8 lg:px-16">
                      <div className="max-w-3xl">
                        {/* Badge */}
                        {/* <motion.div
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.6 }}
                          className="inline-block mb-6"
                        >
                          <div className="bg-red-600 text-white px-6 py-2 font-bold text-sm uppercase tracking-widest border-2 border-white shadow-lg">
                            {slide.badge}
                          </div>
                        </motion.div> */}

                        {/* Title with typing effect */}
                        <motion.h1
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.8 }}
                          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-2 tracking-tight"
                        >
                          <span ref={titleRef} className="inline-block min-h-[1.2em]"></span>
                        </motion.h1>

                        <motion.h2
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none mb-8"
                        >
                          <span ref={subtitleRef} className="text-white inline-block min-h-[1.2em]"></span>
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7, duration: 0.8 }}
                          className="text-base sm:text-lg md:text-xl text-white mb-10 leading-relaxed max-w-2xl font-light"
                        >
                          {slide.description}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9, duration: 0.8 }}
                          className="flex flex-wrap gap-4"
                        >
                          <Link
                            href="/products"
                            className="group inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 text-base uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                          >
                            <FiShoppingBag className="w-5 h-5" />
                            SHOP NOW
                            <motion.span
                              className="inline-block"
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              →
                            </motion.span>
                          </Link>
                          
                          {/* <Link
                            href="/products"
                            className="inline-flex items-center gap-3 bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold px-8 py-4 text-base uppercase tracking-wider transition-all duration-300"
                          >
                            EXPLORE MORE
                          </Link> */}
                        </motion.div>

                        {/* Stats/Features */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.1, duration: 0.8 }}
                          className="flex flex-wrap gap-8 mt-12"
                        >
                         

                          {/* <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white flex items-center justify-center">
                              <FiAward className="w-6 h-6 text-black" />
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-white">100%</div>
                              <div className="text-sm text-gray-400 uppercase tracking-wide">Authentic</div>
                            </div>
                          </div> */}
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
                    <div className="absolute top-20 right-20 w-96 h-96 border-4 border-white transform rotate-12"></div>
                    <div className="absolute top-40 right-40 w-64 h-64 border-4 border-red-600 transform -rotate-12"></div>
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-8 z-20 pointer-events-none">
          <button
            onClick={prevSlide}
            className="w-14 h-14 bg-white/10 hover:bg-white hover:text-black text-white backdrop-blur-sm border-2 border-white/50 hover:border-white flex items-center justify-center transition-all duration-300 pointer-events-auto group"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="w-7 h-7 group-hover:scale-125 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            className="w-14 h-14 bg-white/10 hover:bg-white hover:text-black text-white backdrop-blur-sm border-2 border-white/50 hover:border-white flex items-center justify-center transition-all duration-300 pointer-events-auto group"
            aria-label="Next slide"
          >
            <FiChevronRight className="w-7 h-7 group-hover:scale-125 transition-transform" />
          </button>
        </div>

        {/* Navigation Dots - Enhanced Design */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md px-6 py-3 border border-white/20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-12 h-1 bg-red-600'
                    : 'w-8 h-1 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Slide Counter */}
        <div className="absolute bottom-10 right-10 z-20 hidden md:block">
          <div className="bg-black/50 backdrop-blur-md border border-white/20 px-6 py-3">
            <div className="text-white font-bold text-lg">
              <span className="text-red-600 text-3xl">{String(currentSlide + 1).padStart(2, '0')}</span>
              <span className="text-white/50 mx-2">/</span>
              <span className="text-white/50">{String(heroSlides.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Vertical Text */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
          <div className="transform -rotate-90 origin-left">
            <div className="text-white/30 uppercase tracking-[0.5em] text-sm font-bold whitespace-nowrap">
              Premium Mobile Store 2024
            </div>
          </div>
        </div>
      </section>

      {/* ===== REST OF THE SECTIONS ===== */}
      <FeaturedProducts />
      {/* <SectionMid /> */}
      {/* <RecentProduct /> */}
      {/* <HeroSlider /> */}
    
      <UniqueHomepageSections />
        <SectionLast />
    </div>
  );
}