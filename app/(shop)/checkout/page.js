// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { useRouter } from 'next/navigation';
// import { FiChevronRight, FiCreditCard, FiUser, FiTruck, FiCheck } from 'react-icons/fi';
// import { useCartStore } from '@/lib/store';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// // Initialize Stripe
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY );

// // Checkout form component
// function CheckoutForm() {
//   const router = useRouter();
//   const { items, totalPrice, clearCart } = useCartStore();
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     address: '',
//     city: '',
//     state: '',
//     zip: '',
//     country: 'United States',
//     shippingMethod: 'standard',
//   });
  
//   const stripe = useStripe();
//   const elements = useElements();
  
//   // Calculate order summary
//   const subtotal = totalPrice;
//   const shipping = formData.shippingMethod === 'express' ? 15 : 5;
//   const tax = subtotal * 0.07; // 7% tax
//   const total = subtotal + shipping + tax;
  
//   // Shipping methods
//   const shippingMethods = [
//     { id: 'standard', name: 'Standard Shipping', price: 5, days: '3-5' },
//     { id: 'express', name: 'Express Shipping', price: 15, days: '1-2' },
//   ];
  
//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };
  
//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (step < 3) {
//       setStep(step + 1);
//       return;
//     }
    
//     if (!stripe || !elements) {
//       return;
//     }
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       // Create payment intent on the server
//       const response = await fetch('/api/create-payment-intent', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           amount: Math.round(total * 100), // Convert to cents
//           items,
//           customer: {
//             name: formData.name,
//             email: formData.email,
//             address: {
//               line1: formData.address,
//               city: formData.city,
//               state: formData.state,
//               postal_code: formData.zip,
//               country: formData.country,
//             },
//           },
//           shipping: {
//             name: formData.name,
//             address: {
//               line1: formData.address,
//               city: formData.city,
//               state: formData.state,
//               postal_code: formData.zip,
//               country: formData.country,
//             },
//             method: formData.shippingMethod,
//           },
//         }),
//       });
      
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
      
//       const { clientSecret } = await response.json();
      
//       // Confirm card payment
//       const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//           billing_details: {
//             name: formData.name,
//             email: formData.email,
//             address: {
//               line1: formData.address,
//               city: formData.city,
//               state: formData.state,
//               postal_code: formData.zip,
//               country: formData.country,
//             },
//           },
//         },
//       });
      
//       if (stripeError) {
//         throw new Error(stripeError.message);
//       }
      
//       if (paymentIntent.status === 'succeeded') {
//         // Payment successful
//         setSuccess(true);
//         clearCart();
        
//         // Redirect to success page after a delay
//         setTimeout(() => {
//           router.push('/checkout/success');
//         }, 2000);
//       }
//     } catch (err) {
//       setError(err.message || 'Something went wrong. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };
  
//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: 'spring',
//         stiffness: 300,
//         damping: 24,
//       },
//     },
//   };
  
//   // If cart is empty, redirect to home
//   useEffect(() => {
//     if (items.length === 0 && !success) {
//       router.push('/');
//     }
//   }, [items, router, success]);
  
//   // Render steps
//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-4"
//           >
//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               />
//             </motion.div>
            
//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               />
//             </motion.div>
            
//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
//               <input
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               />
//             </motion.div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
//                 <input
//                   type="text"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </motion.div>
              
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
//                 <input
//                   type="text"
//                   name="state"
//                   value={formData.state}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </motion.div>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
//                 <input
//                   type="text"
//                   name="zip"
//                   value={formData.zip}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </motion.div>
              
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
//                 <select
//                   name="country"
//                   value={formData.country}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="United States">United States</option>
//                   <option value="Canada">Canada</option>
//                   <option value="United Kingdom">United Kingdom</option>
//                   <option value="Australia">Australia</option>
//                 </select>
//               </motion.div>
//             </div>
//           </motion.div>
//         );
      
//       case 2:
//         return (
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className="space-y-4">
//               <h3 className="text-lg font-medium">Shipping Method</h3>
              
//               {shippingMethods.map((method) => (
//                 <div
//                   key={method.id}
//                   className={`border rounded-lg p-4 cursor-pointer transition-colors ${
//                     formData.shippingMethod === method.id
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200 hover:border-blue-300'
//                   }`}
//                   onClick={() => setFormData({ ...formData, shippingMethod: method.id })}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="font-medium">{method.name}</div>
//                       <div className="text-sm text-gray-500">Delivery in {method.days} business days</div>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="font-medium mr-3">${method.price.toFixed(2)}</span>
//                       {formData.shippingMethod === method.id && (
//                         <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
//                           <FiCheck className="text-white w-3 h-3" />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </motion.div>
//           </motion.div>
//         );
      
//       case 3:
//         return (
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants}>
//               <h3 className="text-lg font-medium mb-4">Payment Information</h3>
//               <div className="border border-gray-300 rounded-md p-4 mb-4">
//                 <CardElement
//                   options={{
//                     style: {
//                       base: {
//                         fontSize: '16px',
//                         color: '#424770',
//                         '::placeholder': {
//                           color: '#aab7c4',
//                         },
//                       },
//                       invalid: {
//                         color: '#9e2146',
//                       },
//                     },
//                   }}
//                 />
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="border-t pt-4">
//               <h3 className="text-lg font-medium mb-4">Review Order</h3>
              
//               <div className="space-y-2 mb-4">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span>${subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Shipping</span>
//                   <span>${shipping.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Tax</span>
//                   <span>${tax.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between font-bold text-lg pt-2 border-t">
//                   <span>Total</span>
//                   <span>${total.toFixed(2)}</span>
//                 </div>
//               </div>
//             </motion.div>
            
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-red-50 text-red-700 p-3 rounded-md"
//               >
//                 {error}
//               </motion.div>
//             )}
//           </motion.div>
//         );
      
//       default:
//         return null;
//     }
//   };
  
//   return (
//     <form onSubmit={handleSubmit} className="w-full">
//       {/* Progress steps */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           {[
//             { icon: FiUser, label: 'Contact' },
//             { icon: FiTruck, label: 'Shipping' },
//             { icon: FiCreditCard, label: 'Payment' },
//           ].map((item, index) => (
//             <div key={index} className="flex flex-col items-center">
//               <div
//                 className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                   step > index + 1
//                     ? 'bg-green-500 text-white'
//                     : step === index + 1
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-200 text-gray-500'
//                 }`}
//               >
//                 {step > index + 1 ? <FiCheck /> : <item.icon />}
//               </div>
//               <span className="text-sm mt-2">{item.label}</span>
//             </div>
//           ))}
//         </div>
        
//         <div className="relative mt-2">
//           <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded-full" />
//           <div
//             className="absolute top-0 left-0 h-1 bg-blue-600 rounded-full transition-all duration-300"
//             style={{ width: `${((step - 1) / 2) * 100}%` }}
//           />
//         </div>
//       </div>
      
//       {/* Current step content */}
//       {renderStep()}
      
//       {/* Navigation buttons */}
//       <div className="mt-8 flex justify-between">
//         {step > 1 && (
//           <button
//             type="button"
//             onClick={() => setStep(step - 1)}
//             className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
//           >
//             Back
//           </button>
//         )}
        
//         <button
//           type="submit"
//           disabled={loading || success}
//           className={`ml-auto px-6 py-2 rounded-md text-white flex items-center ${
//             loading || success
//               ? 'bg-gray-400 cursor-not-allowed'
//               : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//         >
//           {loading ? (
//             <>
//               <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Processing...
//             </>
//           ) : success ? (
//             <>
//               <FiCheck className="mr-2" />
//               Order Placed!
//             </>
//           ) : step < 3 ? (
//             <>
//               Continue <FiChevronRight className="ml-1" />
//             </>
//           ) : (
//             <>
//               Place Order <FiChevronRight className="ml-1" />
//             </>
//           )}
//         </button>
//       </div>
//     </form>
//   );
// }

// export default function CheckoutPage() {
//   return (
//     <div className="max-w-6xl mx-auto px-4 py-12">
//       <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <Elements stripe={stripePromise}>
//               <CheckoutForm />
//             </Elements>
//           </div>
//         </div>
        
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
//             <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//             <OrderSummary />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Order summary component
// function OrderSummary() {
//   const { items, totalPrice } = useCartStore();
  
//   // Calculate totals
//   const subtotal = totalPrice;
//   const shipping = 5; // Default shipping
//   const tax = subtotal * 0.07; // 7% tax
//   const total = subtotal + shipping + tax;
  
//   return (
//     <div>
//       <div className="max-h-80 overflow-y-auto mb-4">
//         {items.map((item) => (
//           <div key={item.id} className="flex py-3 border-b">
//             <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
//               <img
//                 src={item.image || item.images?.[0]}
//                 alt={item.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div className="ml-4 flex-1">
//               <h4 className="font-medium text-gray-900">{item.name}</h4>
//               <div className="flex justify-between mt-1">
//                 <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
//                 <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       <div className="space-y-2">
//         <div className="flex justify-between">
//           <span className="text-gray-600">Subtotal</span>
//           <span>${subtotal.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">Shipping</span>
//           <span>${shipping.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">Tax</span>
//           <span>${tax.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between font-bold text-lg pt-2 border-t">
//           <span>Total</span>
//           <span>${total.toFixed(2)}</span>
//         </div>
//       </div>
//     </div>
//   );
// }
// app/checkout/page.js
// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { useRouter } from 'next/navigation';
// import { FiChevronRight, FiCreditCard, FiUser, FiTruck, FiCheck } from 'react-icons/fi';
// import { useCartStore } from '@/lib/store';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// // Initialize Stripe
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// // Card element styling
// const CARD_ELEMENT_OPTIONS = {
//   style: {
//     base: {
//       fontSize: '16px',
//       color: '#424770',
//       fontFamily: '"Inter", "Helvetica Neue", Helvetica, sans-serif',
//       fontSmoothing: 'antialiased',
//       '::placeholder': {
//         color: '#aab7c4',
//       },
//     },
//     invalid: {
//       color: '#9e2146',
//       iconColor: '#fa755a',
//     },
//   },
//   hidePostalCode: true,
// };

// // Checkout form component
// function CheckoutForm() {
//   const router = useRouter();
//   const { items, totalPrice, clearCart } = useCartStore();
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [cardComplete, setCardComplete] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     address: '',
//     city: '',
//     state: '',
//     zip: '',
//     country: 'US',
//     shippingMethod: 'standard',
//   });
  
//   const stripe = useStripe();
//   const elements = useElements();
  
//   // Calculate order summary
//   const subtotal = totalPrice;
//   const shipping = formData.shippingMethod === 'express' ? 15 : 5;
//   const tax = subtotal * 0.07;
//   const total = subtotal ;
  
//   // Shipping methods
//   const shippingMethods = [
//     { id: 'standard', name: 'Standard Shipping', price: 5, days: '3-5' },
//     { id: 'express', name: 'Express Shipping', price: 15, days: '1-2' },
//   ];
  
//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setError(null);
//   };
  
//   // Validate current step
//   const validateStep = () => {
//     if (step === 1) {
//       if (!formData.name.trim()) {
//         setError('Please enter your full name');
//         return false;
//       }
//       if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//         setError('Please enter a valid email address');
//         return false;
//       }
//       if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zip.trim()) {
//         setError('Please fill in all address fields');
//         return false;
//       }
//     }
//     return true;
//   };
  
//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
    
//     // Validate current step
//     if (!validateStep()) {
//       return;
//     }
    
//     // Move to next step if not on payment step
//     if (step < 3) {
//       setStep(step + 1);
//       return;
//     }
    
//     // Payment step validation
//     if (!stripe || !elements) {
//       setError('Stripe has not loaded yet. Please wait and try again.');
//       return;
//     }
    
//     if (!cardComplete) {
//       setError('Please enter valid card details');
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       // Create payment intent
//       const response = await fetch('/api/create-payment-intent', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           amount: Math.round(total * 100),
//           items: items.map(item => ({
//             id: item.id,
//             name: item.name,
//             price: item.price,
//             quantity: item.quantity,
//           })),
//           customer: {
//             name: formData.name,
//             email: formData.email,
//             address: {
//               line1: formData.address,
//               city: formData.city,
//               state: formData.state,
//               postal_code: formData.zip,
//               country: formData.country,
//             },
//           },
//           shipping: {
//             name: formData.name,
//             address: {
//               line1: formData.address,
//               city: formData.city,
//               state: formData.state,
//               postal_code: formData.zip,
//               country: formData.country,
//             },
//             method: formData.shippingMethod,
//           },
//         }),
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to create payment intent');
//       }
      
//       const { clientSecret } = await response.json();
      
//       // Confirm card payment
//       const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
//         clientSecret,
//         {
//           payment_method: {
//             card: elements.getElement(CardElement),
//             billing_details: {
//               name: formData.name,
//               email: formData.email,
//               address: {
//                 line1: formData.address,
//                 city: formData.city,
//                 state: formData.state,
//                 postal_code: formData.zip,
//                 country: formData.country,
//               },
//             },
//           },
//         }
//       );
      
//       if (stripeError) {
//         throw new Error(stripeError.message);
//       }
      
//       if (paymentIntent.status === 'succeeded') {
//         setSuccess(true);
//         clearCart();
        
//         // Store order info in sessionStorage
//         sessionStorage.setItem('lastOrder', JSON.stringify({
//           orderNumber: paymentIntent.id,
//           date: new Date().toISOString(),
//           total: total.toFixed(2),
//         }));
        
//         // Redirect to success page
//         setTimeout(() => {
//           router.push('/checkout/success');
//         }, 1500);
//       }
//     } catch (err) {
//       console.error('Payment error:', err);
//       setError(err.message || 'Payment failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1 },
//     },
//   };
  
//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { type: 'spring', stiffness: 300, damping: 24 },
//     },
//   };
  
//   // Redirect if cart is empty
//   useEffect(() => {
//     if (items.length === 0 && !success) {
//       router.push('/');
//     }
//   }, [items, router, success]);
  
//   // Render steps
//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 placeholder="John Doe"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </motion.div>
            
//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 placeholder="john@example.com"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </motion.div>
            
//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
//               <input
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 required
//                 placeholder="123 Main St"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </motion.div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
//                 <input
//                   type="text"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   required
//                   placeholder="New York"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </motion.div>
              
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
//                 <input
//                   type="text"
//                   name="state"
//                   value={formData.state}
//                   onChange={handleChange}
//                   required
//                   placeholder="NY"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </motion.div>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
//                 <input
//                   type="text"
//                   name="zip"
//                   value={formData.zip}
//                   onChange={handleChange}
//                   required
//                   placeholder="10001"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </motion.div>
              
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
//                 <select
//                   name="country"
//                   value={formData.country}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="US">United States</option>
//                   <option value="CA">Canada</option>
//                   <option value="GB">United Kingdom</option>
//                   <option value="AU">Australia</option>
//                    <option value="PK">Pakistan</option>
//                 </select>
//               </motion.div>
//             </div>
//           </motion.div>
//         );
      
//       case 2:
//         return (
//           <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
//             <motion.div variants={itemVariants} className="space-y-4">
//               <h3 className="text-lg font-medium">Select Shipping Method</h3>
              
//               {shippingMethods.map((method) => (
//                 <div
//                   key={method.id}
//                   className={`border rounded-lg p-4 cursor-pointer transition-all ${
//                     formData.shippingMethod === method.id
//                       ? 'border-blue-500 bg-blue-50 shadow-sm'
//                       : 'border-gray-200 hover:border-blue-300'
//                   }`}
//                   onClick={() => setFormData({ ...formData, shippingMethod: method.id })}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="font-medium">{method.name}</div>
//                       <div className="text-sm text-gray-500">Delivery in {method.days} business days</div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <span className="font-medium">${method.price.toFixed(2)}</span>
//                       {formData.shippingMethod === method.id && (
//                         <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
//                           <FiCheck className="text-white w-3 h-3" />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </motion.div>
//           </motion.div>
//         );
      
//       case 3:
//         return (
//           <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
//             <motion.div variants={itemVariants}>
//               <h3 className="text-lg font-medium mb-4">Payment Information</h3>
//               <div className="border border-gray-300 rounded-lg p-4 bg-white">
//                 <CardElement
//                   options={CARD_ELEMENT_OPTIONS}
//                   onChange={(e) => setCardComplete(e.complete)}
//                 />
//               </div>
//               <p className="text-xs text-gray-500 mt-2">
//                 Your payment information is encrypted and secure.
//               </p>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="border-t pt-4">
//               <h3 className="text-lg font-medium mb-4">Order Summary</h3>
              
//               <div className="space-y-2 mb-4">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Subtotal ({items.length} items)</span>
//                   <span>${subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Shipping</span>
//                   <span>${shipping.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Tax (7%)</span>
//                   <span>${tax.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between font-bold text-lg pt-2 border-t">
//                   <span>Total</span>
//                   <span>${total.toFixed(2)}</span>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         );
      
//       default:
//         return null;
//     }
//   };
  
//   return (
//     <form onSubmit={handleSubmit} className="w-full">
//       {/* Progress steps */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           {[
//             { icon: FiUser, label: 'Contact' },
//             { icon: FiTruck, label: 'Shipping' },
//             { icon: FiCreditCard, label: 'Payment' },
//           ].map((item, index) => (
//             <div key={index} className="flex flex-col items-center">
//               <div
//                 className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
//                   step > index + 1
//                     ? 'bg-green-500 text-white'
//                     : step === index + 1
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-200 text-gray-500'
//                 }`}
//               >
//                 {step > index + 1 ? <FiCheck /> : <item.icon />}
//               </div>
//               <span className="text-sm mt-2 font-medium">{item.label}</span>
//             </div>
//           ))}
//         </div>
        
//         <div className="relative mt-4">
//           <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded-full" />
//           <div
//             className="absolute top-0 left-0 h-1 bg-blue-600 rounded-full transition-all duration-300"
//             style={{ width: `${((step - 1) / 2) * 100}%` }}
//           />
//         </div>
//       </div>
      
//       {/* Error message */}
//       {error && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-start"
//         >
//           <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//           </svg>
//           <span>{error}</span>
//         </motion.div>
//       )}
      
//       {/* Success message */}
//       {success && (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6 flex items-center justify-center"
//         >
//           <FiCheck className="w-5 h-5 mr-2" />
//           <span className="font-medium">Payment successful! Redirecting...</span>
//         </motion.div>
//       )}
      
//       {/* Current step content */}
//       {renderStep()}
      
//       {/* Navigation buttons */}
//       <div className="mt-8 flex justify-between">
//         {step > 1 && (
//           <button
//             type="button"
//             onClick={() => {
//               setStep(step - 1);
//               setError(null);
//             }}
//             disabled={loading || success}
//             className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Back
//           </button>
//         )}
        
//         <button
//           type="submit"
//           disabled={loading || success || (step === 3 && !stripe)}
//           className={`ml-auto px-6 py-3 rounded-md text-white flex items-center font-medium transition-colors ${
//             loading || success || (step === 3 && !stripe)
//               ? 'bg-gray-400 cursor-not-allowed'
//               : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
//           }`}
//         >
//           {loading ? (
//             <>
//               <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Processing...
//             </>
//           ) : success ? (
//             <>
//               <FiCheck className="mr-2" />
//               Order Placed!
//             </>
//           ) : step < 3 ? (
//             <>
//               Continue <FiChevronRight className="ml-1" />
//             </>
//           ) : (
//             <>
//               Pay ${total.toFixed(2)} <FiChevronRight className="ml-1" />
//             </>
//           )}
//         </button>
//       </div>
//     </form>
//   );
// }

// export default function CheckoutPage() {
//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-6xl mx-auto px-4">
//         <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <Elements stripe={stripePromise}>
//                 <CheckoutForm />
//               </Elements>
//             </div>
//           </div>
          
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
//               <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//               <OrderSummary />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Order summary component
// function OrderSummary() {
//   const { items, totalPrice } = useCartStore();
  
//   const subtotal = totalPrice;
//   const shipping = 5;
//   const tax = subtotal * 0.07;
//   const total = subtotal ;
  
//   return (
//     <div>
//       <div className="max-h-80 overflow-y-auto mb-4 space-y-3">
//         {items.map((item) => (
//           <div key={item.id} className="flex py-3 border-b last:border-0">
//             <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
//               <img
//                 src={item.image || item.images?.[0]}
//                 alt={item.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div className="ml-4 flex-1">
//               <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
//               <div className="flex justify-between mt-1">
//                 <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
//                 <span className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       <div className="space-y-2 pt-4 border-t">
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">Subtotal</span>
//           <span className="font-medium">${subtotal.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">Shipping</span>
//           <span className="font-medium">${shipping.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">Tax</span>
//           <span className="font-medium">${tax.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between font-bold text-lg pt-3 border-t">
//           <span>Total</span>
//           <span className="text-blue-600">${total.toFixed(2)}</span>
//         </div>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { useRouter } from 'next/navigation';
// import { FiChevronRight, FiCreditCard, FiUser, FiCheck } from 'react-icons/fi';
// import { useCartStore } from '@/lib/store';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// const CARD_ELEMENT_OPTIONS = {
//   style: {
//     base: {
//       fontSize: '16px',
//       color: '#424770',
//       fontFamily: '"Inter", "Helvetica Neue", Helvetica, sans-serif',
//       fontSmoothing: 'antialiased',
//       '::placeholder': { color: '#aab7c4' },
//     },
//     invalid: { color: '#9e2146', iconColor: '#fa755a' },
//   },
//   hidePostalCode: true,
// };

// function CheckoutForm() {
//   const router = useRouter();
//   const { items, totalPrice, clearCart } = useCartStore();

//   // 1: Contact, 2: Payment
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [cardComplete, setCardComplete] = useState(false);

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     address: '',
//     city: '',
//     state: '',
//     zip: '',
//     country: 'US',
//   });

//   const stripe = useStripe();
//   const elements = useElements();

//   // Totals (NO tax, NO shipping)
//   const subtotal = totalPrice;
//   const total = subtotal;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setError(null);
//   };

//   const validateStep = () => {
//     if (step === 1) {
//       if (!formData.name.trim()) return setError('Please enter your full name'), false;
//       if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
//         return setError('Please enter a valid email address'), false;
//       if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zip.trim())
//         return setError('Please fill in all address fields'), false;
//     }
//     return true;
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError(null);

//   if (!validateStep()) return;

//   // Move to payment step
//   if (step < 2) {
//     setStep(2);
//     return;
//   }

//   // =====================
//   // CASH ON DELIVERY FLOW
//   // =====================
//   if (paymentMethod === 'cod') {
//     setLoading(true);

//     try {
//       const res = await fetch('/api/orders', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           items: items.map((item) => ({
//             name: item.name,
//             price: item.price,
//             quantity: item.quantity,
//             image: item.image,
//           })),
//           email: formData.email,
//           shippingAddress: {
//             name: formData.name,
//             address: formData.address,
//             city: formData.city,
//             state: formData.state,
//             postalCode: formData.zip,
//             country: formData.country,
//           },
//           paymentMethod: 'cod',
//           itemsPrice: total,
//           taxPrice: 0,
//           shippingPrice: 0,
//           totalPrice: total,
//         }),
//       });

//       if (!res.ok) throw new Error('Failed to place COD order');

//       clearCart();
//       setSuccess(true);

//       setTimeout(() => router.push('/checkout/success'), 1500);
//       return;
//     } catch (err) {
//       console.error(err);
//       setError('Failed to place Cash on Delivery order');
//     } finally {
//       setLoading(false);
//     }
//   }

//   // =====================
//   // STRIPE FLOW (UNCHANGED)
//   // =====================
//   if (!stripe || !elements) {
//     setError('Stripe has not loaded yet. Please wait and try again.');
//     return;
//   }

//   if (!cardComplete) {
//     setError('Please enter valid card details');
//     return;
//   }

//   setLoading(true);

//   try {
//     const response = await fetch('/api/create-payment-intent', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         items: items.map((item) => ({
//           id: item.id,
//           name: item.name,
//           price: item.price,
//           quantity: item.quantity,
//         })),
//         customer: {
//           name: formData.name,
//           email: formData.email,
//           address: {
//             line1: formData.address,
//             city: formData.city,
//             state: formData.state,
//             postal_code: formData.zip,
//             country: formData.country,
//           },
//         },
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || 'Failed to create payment intent');
//     }

//     const { clientSecret } = await response.json();

//     const { error: stripeError, paymentIntent } =
//       await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//           billing_details: {
//             name: formData.name,
//             email: formData.email,
//             address: {
//               line1: formData.address,
//               city: formData.city,
//               state: formData.state,
//               postal_code: formData.zip,
//               country: formData.country,
//             },
//           },
//         },
//       });

//     if (stripeError) throw new Error(stripeError.message);

//     if (paymentIntent.status === 'succeeded') {
//       setSuccess(true);
//       clearCart();

//       sessionStorage.setItem(
//         'lastOrder',
//         JSON.stringify({
//           orderNumber: paymentIntent.id,
//           date: new Date().toISOString(),
//           total: total.toFixed(2),
//         })
//       );

//       setTimeout(() => router.push('/checkout/success'), 1500);
//     }
//   } catch (err) {
//     console.error('Payment error:', err);
//     setError(err?.message || 'Payment failed. Please try again.');
//   } finally {
//     setLoading(false);
//   }
// };


//   const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
//   const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

//   useEffect(() => {
//     if (items.length === 0 && !success) router.push('/');
//   }, [items, router, success]);

//   const renderStep = () => {
//     switch (step) {
//       // Step 1: Contact & Address
//       case 1:
//         return (
//           <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
//               <input name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
//             </motion.div>
//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
//               <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
//             </motion.div>
//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
//               <input name="address" value={formData.address} onChange={handleChange} required placeholder="123 Main St" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
//             </motion.div>
//             <div className="grid grid-cols-2 gap-4">
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
//                 <input name="city" value={formData.city} onChange={handleChange} required placeholder="New York" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
//               </motion.div>
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
//                 <input name="state" value={formData.state} onChange={handleChange} required placeholder="NY" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
//               </motion.div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
//                 <input name="zip" value={formData.zip} onChange={handleChange} required placeholder="10001" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
//               </motion.div>
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
//                 <select name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
//                   <option value="US">United States</option>
//                   <option value="CA">Canada</option>
//                   <option value="GB">United Kingdom</option>
//                   <option value="AU">Australia</option>
//                   <option value="PK">Pakistan</option>
//                 </select>
//               </motion.div>
//             </div>
//           </motion.div>
//         );

//       // Step 2: Payment
//       case 2:
//         return (
//           <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
//             <motion.div variants={itemVariants}>
//               <h3 className="text-lg font-medium mb-4">Payment Information</h3>
//               <div className="border border-gray-300 rounded-lg p-4 bg-white">
//                 <CardElement options={CARD_ELEMENT_OPTIONS} onChange={(e) => setCardComplete(e.complete)} />
//               </div>
//               <p className="text-xs text-gray-500 mt-2">Your payment information is encrypted and secure.</p>
//             </motion.div>

//             <motion.div variants={itemVariants} className="border-t pt-4">
//               <h3 className="text-lg font-medium mb-4">Order Summary</h3>
//               <div className="space-y-2 mb-4">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Subtotal ({items.length} items)</span>
//                   <span>${subtotal.toFixed(2)}</span>
//                 </div>
//                 {/* No shipping, no tax */}
//                 <div className="flex justify-between font-bold text-lg pt-2 border-t">
//                   <span>Total</span>
//                   <span>${total.toFixed(2)}</span>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="w-full">
//       {/* Steps header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           {[
//             { icon: FiUser, label: 'Contact' },
//             { icon: FiCreditCard, label: 'Payment' },
//           ].map((item, index) => (
//             <div key={index} className="flex flex-col items-center">
//               <div
//                 className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
//                   step > index + 1
//                     ? 'bg-green-500 text-white'
//                     : step === index + 1
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-200 text-gray-500'
//                 }`}
//               >
//                 {step > index + 1 ? <FiCheck /> : <item.icon />}
//               </div>
//               <span className="text-sm mt-2 font-medium">{item.label}</span>
//             </div>
//           ))}
//         </div>

//         <div className="relative mt-4">
//           <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded-full" />
//           <div className="absolute top-0 left-0 h-1 bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${((step - 1) / 1) * 100}%` }} />
//         </div>
//       </div>

//       {/* Error */}
//       {error && (
//         <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-start">
//           <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//           </svg>
//           <span>{error}</span>
//         </motion.div>
//       )}

//       {/* Success */}
//       {success && (
//         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6 flex items-center justify-center">
//           <FiCheck className="w-5 h-5 mr-2" />
//           <span className="font-medium">Payment successful! Redirecting...</span>
//         </motion.div>
//       )}

//       {/* Step content */}
//       {renderStep()}

//       {/* Buttons */}
//       <div className="mt-8 flex justify-between">
//         {step > 1 && (
//           <button type="button" onClick={() => (setStep(step - 1), setError(null))} disabled={loading || success} className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
//             Back
//           </button>
//         )}

//         <button
//           type="submit"
//           disabled={loading || success || (step === 2 && !stripe)}
//           className={`ml-auto px-6 py-3 rounded-md text-white flex items-center font-medium transition-colors ${
//             loading || success || (step === 2 && !stripe) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
//           }`}
//         >
//           {loading ? (
//             <>
//               <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Processing...
//             </>
//           ) : success ? (
//             <>
//               <FiCheck className="mr-2" />
//               Order Placed!
//             </>
//           ) : step < 2 ? (
//             <>
//               Continue <FiChevronRight className="ml-1" />
//             </>
//           ) : (
//             <>
//               Pay ${total.toFixed(2)} <FiChevronRight className="ml-1" />
//             </>
//           )}
//         </button>
//       </div>
//     </form>
//   );
// }

// export default function CheckoutPage() {
//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-6xl mx-auto px-4">
//         <h1 className="text-3xl font-bold mb-8">Checkout</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <Elements stripe={stripePromise}>
//                 <CheckoutForm />
//               </Elements>
//             </div>
//           </div>

//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
//               <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//               <OrderSummary />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function OrderSummary() {
//   const { items, totalPrice } = useCartStore();
//   const subtotal = totalPrice; // no shipping/tax
//   const total = subtotal;

//   return (
//     <div>
//       <div className="max-h-80 overflow-y-auto mb-4 space-y-3">
//         {items.map((item) => (
//           <div key={item.id} className="flex py-3 border-b last:border-0">
//             <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
//               <img src={item.image || item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
//             </div>
//             <div className="ml-4 flex-1">
//               <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
//               <div className="flex justify-between mt-1">
//                 <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
//                 <span className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="space-y-2 pt-4 border-t">
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">Subtotal</span>
//           <span className="font-medium">${subtotal.toFixed(2)}</span>
//         </div>
//         {/* No shipping/tax lines */}
//         <div className="flex justify-between font-bold text-lg pt-3 border-t">
//           <span>Total</span>
//           <span className="text-blue-600">${total.toFixed(2)}</span>
//         </div>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { useRouter } from 'next/navigation';
// import { FiChevronRight, FiCreditCard, FiUser, FiCheck, FiDollarSign } from 'react-icons/fi';
// import { useCartStore } from '@/lib/store';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// const CARD_ELEMENT_OPTIONS = {
//   style: {
//     base: {
//       fontSize: '16px',
//       color: '#424770',
//       fontFamily: '"Inter", "Helvetica Neue", Helvetica, sans-serif',
//       fontSmoothing: 'antialiased',
//       '::placeholder': { color: '#aab7c4' },
//     },
//     invalid: { color: '#9e2146', iconColor: '#fa755a' },
//   },
//   hidePostalCode: true,
// };

// function CheckoutForm() {
//   const router = useRouter();
//   const { items, totalPrice, clearCart } = useCartStore();

//   // 1: Contact, 2: Payment
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [cardComplete, setCardComplete] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'cod'

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     address: '',
//     city: '',
//     state: '',
//     zip: '',
//     country: 'US',
//   });

//   const stripe = useStripe();
//   const elements = useElements();

//   // Totals (NO tax, NO shipping)
//   const subtotal = totalPrice;
//   const total = subtotal;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setError(null);
//   };

//   const validateStep = () => {
//     if (step === 1) {
//       if (!formData.name.trim()) return setError('Please enter your full name'), false;
//       if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
//         return setError('Please enter a valid email address'), false;
//       if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zip.trim())
//         return setError('Please fill in all address fields'), false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (!validateStep()) return;

//     // Move to payment step
//     if (step < 2) {
//       setStep(2);
//       return;
//     }

//     // =====================
//     // CASH ON DELIVERY FLOW
//     // =====================
//     if (paymentMethod === 'cod') {
//       setLoading(true);

//       try {
//         const res = await fetch('/api/orders', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             items: items.map((item) => ({
//               id: item.id,
//               name: item.name,
//               price: item.price,
//               quantity: item.quantity,
//               image: item.image || item.images?.[0],
//             })),
//             email: formData.email,
//             shippingAddress: {
//               name: formData.name,
//               address: formData.address,
//               city: formData.city,
//               state: formData.state,
//               postalCode: formData.zip,
//               country: formData.country,
//             },
//             paymentMethod: 'cod',
//             itemsPrice: total,
//             taxPrice: 0,
//             shippingPrice: 0,
//             totalPrice: total,
//           }),
//         });

//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error(data.error || 'Failed to place COD order');
//         }

//         // Store order info in session storage for success page
//         sessionStorage.setItem(
//           'lastOrder',
//           JSON.stringify({
//             orderNumber: data.order.orderNumber,
//             date: data.order.createdAt,
//             total: total.toFixed(2),
//             paymentMethod: 'cod',
//           })
//         );

//         clearCart();
//         setSuccess(true);

//         setTimeout(() => router.push('/checkout/success'), 1500);
//         return;
//       } catch (err) {
//         console.error('COD order error:', err);
//         setError(err.message || 'Failed to place Cash on Delivery order');
//       } finally {
//         setLoading(false);
//       }
//       return;
//     }

//     // =====================
//     // STRIPE CARD FLOW
//     // =====================
//     if (!stripe || !elements) {
//       setError('Stripe has not loaded yet. Please wait and try again.');
//       return;
//     }

//     if (!cardComplete) {
//       setError('Please enter valid card details');
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch('/api/create-payment-intent', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           items: items.map((item) => ({
//             id: item.id,
//             name: item.name,
//             price: item.price,
//             quantity: item.quantity,
//           })),
//           customer: {
//             name: formData.name,
//             email: formData.email,
//             address: {
//               line1: formData.address,
//               city: formData.city,
//               state: formData.state,
//               postal_code: formData.zip,
//               country: formData.country,
//             },
//           },
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to create payment intent');
//       }

//       const { clientSecret } = await response.json();

//       const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//           billing_details: {
//             name: formData.name,
//             email: formData.email,
//             address: {
//               line1: formData.address,
//               city: formData.city,
//               state: formData.state,
//               postal_code: formData.zip,
//               country: formData.country,
//             },
//           },
//         },
//       });

//       if (stripeError) throw new Error(stripeError.message);

//       if (paymentIntent.status === 'succeeded') {
//         // Create order in database with payment intent ID
//         const orderRes = await fetch('/api/orders', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             items: items.map((item) => ({
//               id: item.id,
//               name: item.name,
//               price: item.price,
//               quantity: item.quantity,
//               image: item.image || item.images?.[0],
//             })),
//             email: formData.email,
//             shippingAddress: {
//               name: formData.name,
//               address: formData.address,
//               city: formData.city,
//               state: formData.state,
//               postalCode: formData.zip,
//               country: formData.country,
//             },
//             paymentMethod: 'card',
//             paymentIntentId: paymentIntent.id,
//             itemsPrice: total,
//             taxPrice: 0,
//             shippingPrice: 0,
//             totalPrice: total,
//           }),
//         });

//         const orderData = await orderRes.json();

//         if (!orderRes.ok) {
//           throw new Error(orderData.error || 'Failed to save order');
//         }

//         setSuccess(true);
//         clearCart();

//         sessionStorage.setItem(
//           'lastOrder',
//           JSON.stringify({
//             orderNumber: orderData.order.orderNumber,
//             date: orderData.order.createdAt,
//             total: total.toFixed(2),
//             paymentMethod: 'card',
//           })
//         );

//         setTimeout(() => router.push('/checkout/success'), 1500);
//       }
//     } catch (err) {
//       console.error('Payment error:', err);
//       setError(err?.message || 'Payment failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
//   };
//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
//   };

//   useEffect(() => {
//     if (items.length === 0 && !success) router.push('/');
//   }, [items, router, success]);

//   const renderStep = () => {
//     switch (step) {
//       // Step 1: Contact & Address
//       case 1:
//         return (
//           <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
//               <input
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 placeholder="John Doe"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </motion.div>
//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
//               <input
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 placeholder="john@example.com"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </motion.div>
//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
//               <input
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 required
//                 placeholder="123 Main St"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </motion.div>
//             <div className="grid grid-cols-2 gap-4">
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
//                 <input
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   required
//                   placeholder="New York"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </motion.div>
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
//                 <input
//                   name="state"
//                   value={formData.state}
//                   onChange={handleChange}
//                   required
//                   placeholder="NY"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </motion.div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
//                 <input
//                   name="zip"
//                   value={formData.zip}
//                   onChange={handleChange}
//                   required
//                   placeholder="10001"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </motion.div>
//               <motion.div variants={itemVariants}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
//                 <select
//                   name="country"
//                   value={formData.country}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="US">United States</option>
//                   <option value="CA">Canada</option>
//                   <option value="GB">United Kingdom</option>
//                   <option value="AU">Australia</option>
//                   <option value="PK">Pakistan</option>
//                 </select>
//               </motion.div>
//             </div>
//           </motion.div>
//         );

//       // Step 2: Payment
//       case 2:
//         return (
//           <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
//             {/* Payment Method Selection */}
//             <motion.div variants={itemVariants}>
//               <h3 className="text-lg font-medium mb-4">Payment Method</h3>
//               <div className="space-y-3">
//                 {/* Card Payment Option */}
//                 <div
//                   onClick={() => setPaymentMethod('card')}
//                   className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                     paymentMethod === 'card'
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-300 hover:border-gray-400'
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       <FiCreditCard className="w-6 h-6 text-gray-700" />
//                       <div>
//                         <p className="font-medium text-gray-900">Credit/Debit Card</p>
//                         <p className="text-sm text-gray-500">Pay securely with Stripe</p>
//                       </div>
//                     </div>
//                     <div
//                       className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//                         paymentMethod === 'card' ? 'border-blue-500' : 'border-gray-300'
//                       }`}
//                     >
//                       {paymentMethod === 'card' && (
//                         <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Cash on Delivery Option */}
//                 <div
//                   onClick={() => setPaymentMethod('cod')}
//                   className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                     paymentMethod === 'cod'
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-300 hover:border-gray-400'
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       <FiDollarSign className="w-6 h-6 text-gray-700" />
//                       <div>
//                         <p className="font-medium text-gray-900">Cash on Delivery</p>
//                         <p className="text-sm text-gray-500">Pay when you receive your order</p>
//                       </div>
//                     </div>
//                     <div
//                       className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//                         paymentMethod === 'cod' ? 'border-blue-500' : 'border-gray-300'
//                       }`}
//                     >
//                       {paymentMethod === 'cod' && (
//                         <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Card Details (only show if card is selected) */}
//             {paymentMethod === 'card' && (
//               <motion.div
//                 variants={itemVariants}
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: 'auto' }}
//                 exit={{ opacity: 0, height: 0 }}
//               >
//                 <h3 className="text-lg font-medium mb-4">Card Information</h3>
//                 <div className="border border-gray-300 rounded-lg p-4 bg-white">
//                   <CardElement options={CARD_ELEMENT_OPTIONS} onChange={(e) => setCardComplete(e.complete)} />
//                 </div>
//                 <p className="text-xs text-gray-500 mt-2">
//                   Your payment information is encrypted and secure.
//                 </p>
//               </motion.div>
//             )}

//             {/* COD Information (only show if COD is selected) */}
//             {paymentMethod === 'cod' && (
//               <motion.div
//                 variants={itemVariants}
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: 'auto' }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="bg-amber-50 border border-amber-200 rounded-lg p-4"
//               >
//                 <div className="flex">
//                   <FiDollarSign className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
//                   <div>
//                     <h4 className="font-medium text-amber-900 mb-1">Cash on Delivery</h4>
//                     <p className="text-sm text-amber-800">
//                       You will pay <strong>${total.toFixed(2)}</strong> in cash when your order is
//                       delivered to your address. Please keep the exact amount ready.
//                     </p>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* Order Summary */}
//             <motion.div variants={itemVariants} className="border-t pt-4">
//               <h3 className="text-lg font-medium mb-4">Order Summary</h3>
//               <div className="space-y-2 mb-4">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Subtotal ({items.length} items)</span>
//                   <span>${subtotal.toFixed(2)}</span>
//                 </div>
//                 {/* No shipping, no tax */}
//                 <div className="flex justify-between font-bold text-lg pt-2 border-t">
//                   <span>Total</span>
//                   <span>${total.toFixed(2)}</span>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="w-full">
//       {/* Steps header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           {[
//             { icon: FiUser, label: 'Contact' },
//             { icon: FiCreditCard, label: 'Payment' },
//           ].map((item, index) => (
//             <div key={index} className="flex flex-col items-center">
//               <div
//                 className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
//                   step > index + 1
//                     ? 'bg-green-500 text-white'
//                     : step === index + 1
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-200 text-gray-500'
//                 }`}
//               >
//                 {step > index + 1 ? <FiCheck /> : <item.icon />}
//               </div>
//               <span className="text-sm mt-2 font-medium">{item.label}</span>
//             </div>
//           ))}
//         </div>

//         <div className="relative mt-4">
//           <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded-full" />
//           <div
//             className="absolute top-0 left-0 h-1 bg-blue-600 rounded-full transition-all duration-300"
//             style={{ width: `${((step - 1) / 1) * 100}%` }}
//           />
//         </div>
//       </div>

//       {/* Error */}
//       {error && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-start"
//         >
//           <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//             <path
//               fillRule="evenodd"
//               d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//               clipRule="evenodd"
//             />
//           </svg>
//           <span>{error}</span>
//         </motion.div>
//       )}

//       {/* Success */}
//       {success && (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6 flex items-center justify-center"
//         >
//           <FiCheck className="w-5 h-5 mr-2" />
//           <span className="font-medium">Order placed successfully! Redirecting...</span>
//         </motion.div>
//       )}

//       {/* Step content */}
//       {renderStep()}

//       {/* Buttons */}
//       <div className="mt-8 flex justify-between">
//         {step > 1 && (
//           <button
//             type="button"
//             onClick={() => (setStep(step - 1), setError(null))}
//             disabled={loading || success}
//             className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Back
//           </button>
//         )}

//         <button
//           type="submit"
//           disabled={loading || success || (step === 2 && paymentMethod === 'card' && !stripe)}
//           className={`ml-auto px-6 py-3 rounded-md text-white flex items-center font-medium transition-colors ${
//             loading || success || (step === 2 && paymentMethod === 'card' && !stripe)
//               ? 'bg-gray-400 cursor-not-allowed'
//               : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
//           }`}
//         >
//           {loading ? (
//             <>
//               <svg
//                 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>
//               Processing...
//             </>
//           ) : success ? (
//             <>
//               <FiCheck className="mr-2" />
//               Order Placed!
//             </>
//           ) : step < 2 ? (
//             <>
//               Continue <FiChevronRight className="ml-1" />
//             </>
//           ) : paymentMethod === 'cod' ? (
//             <>
//               Place Order <FiChevronRight className="ml-1" />
//             </>
//           ) : (
//             <>
//               Pay ${total.toFixed(2)} <FiChevronRight className="ml-1" />
//             </>
//           )}
//         </button>
//       </div>
//     </form>
//   );
// }

// export default function CheckoutPage() {
//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-6xl mx-auto px-4">
//         <h1 className="text-3xl font-bold mb-8">Checkout</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <Elements stripe={stripePromise}>
//                 <CheckoutForm />
//               </Elements>
//             </div>
//           </div>

//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
//               <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//               <OrderSummary />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function OrderSummary() {
//   const { items, totalPrice } = useCartStore();
//   const subtotal = totalPrice; // no shipping/tax
//   const total = subtotal;

//   return (
//     <div>
//       <div className="max-h-80 overflow-y-auto mb-4 space-y-3">
//         {items.map((item) => (
//           <div key={item.id} className="flex py-3 border-b last:border-0">
//             <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
//               <img
//                 src={item.image || item.images?.[0]}
//                 alt={item.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div className="ml-4 flex-1">
//               <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
//               <div className="flex justify-between mt-1">
//                 <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
//                 <span className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="space-y-2 pt-4 border-t">
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">Subtotal</span>
//           <span className="font-medium">${subtotal.toFixed(2)}</span>
//         </div>
//         {/* No shipping/tax lines */}
//         <div className="flex justify-between font-bold text-lg pt-3 border-t">
//           <span>Total</span>
//           <span className="text-blue-600">${total.toFixed(2)}</span>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiChevronRight, FiCreditCard, FiUser, FiCheck, FiDollarSign } from 'react-icons/fi';
import { useCartStore } from '@/lib/store';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      fontFamily: '"Inter", "Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': { color: '#aab7c4' },
    },
    invalid: { color: '#9e2146', iconColor: '#fa755a' },
  },
  hidePostalCode: true,
};

function CheckoutForm() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });

  const stripe = useStripe();
  const elements = useElements();

  const subtotal = totalPrice;
  const total = subtotal;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name.trim()) return setError('Please enter your full name'), false;
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        return setError('Please enter a valid email address'), false;
      if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zip.trim())
        return setError('Please fill in all address fields'), false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateStep()) return;

    if (step < 2) {
      setStep(2);
      return;
    }

    // CASH ON DELIVERY FLOW
   // In your checkout page, replace the COD order creation section with this:

// COMPLETE COD FLOW WITH EXTENSIVE DEBUGGING
// Replace your entire COD section with this:

if (paymentMethod === 'cod') {
  setLoading(true);

  try {
    console.log('🚀 Starting COD order creation...');
    
    const requestBody = {
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || item.images?.[0],
      })),
      email: formData.email,
      shippingAddress: {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.zip,
        country: formData.country,
      },
      paymentMethod: 'cod',
      itemsPrice: total,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: total,
    };

    console.log('📦 Request body:', JSON.stringify(requestBody, null, 2));

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    console.log('📡 Response status:', res.status);
    console.log('📡 Response ok:', res.ok);

    // Get response text first
    const responseText = await res.text();
    console.log('📄 Raw response text:', responseText);

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ Parsed JSON:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError);
      throw new Error('Server returned invalid JSON');
    }

    if (!res.ok) {
      throw new Error(data.error || 'Failed to place COD order');
    }

    // DEBUG: Check entire response structure
    console.log('=== RESPONSE STRUCTURE ===');
    console.log('typeof data:', typeof data);
    console.log('data keys:', Object.keys(data));
    console.log('data.order exists?', !!data.order);
    
    if (data.order) {
      console.log('data.order keys:', Object.keys(data.order));
      console.log('data.order._id:', data.order._id);
      console.log('data.order.id:', data.order.id);
      console.log('typeof data.order._id:', typeof data.order._id);
      console.log('typeof data.order.id:', typeof data.order.id);
    }

    // Try to extract order ID
    let orderId = null;

    // Method 1: From data.order._id
    if (data?.order?._id) {
      orderId = String(data.order._id);
      console.log('✅ Got orderId from data.order._id:', orderId);
    }
    
    // Method 2: From data.order.id
    if (!orderId && data?.order?.id) {
      orderId = String(data.order.id);
      console.log('✅ Got orderId from data.order.id:', orderId);
    }

    // Method 3: From top level
    if (!orderId && data._id) {
      orderId = String(data._id);
      console.log('✅ Got orderId from data._id:', orderId);
    }

    if (!orderId && data.id) {
      orderId = String(data.id);
      console.log('✅ Got orderId from data.id:', orderId);
    }

    console.log('=== FINAL ORDER ID ===');
    console.log('orderId:', orderId);
    console.log('orderId type:', typeof orderId);
    console.log('orderId length:', orderId?.length);
    console.log('orderId is valid?', orderId && orderId !== 'undefined' && orderId !== 'null');

    if (!orderId || orderId === 'undefined' || orderId === 'null') {
      console.error('❌❌❌ NO VALID ORDER ID FOUND! ❌❌❌');
      console.error('Full response data:', JSON.stringify(data, null, 2));
      alert('DEBUG: Order ID is missing from server response. Check console for details.');
      throw new Error('Order created but ID is missing from server response.');
    }

    // Store order info
    const orderInfo = {
      orderId: orderId,
      orderNumber: data.order?.orderNumber || 'N/A',
      date: data.order?.createdAt || new Date().toISOString(),
      total: total.toFixed(2),
      paymentMethod: 'cod',
    };

    console.log('💾 Storing in sessionStorage:', orderInfo);
    sessionStorage.setItem('lastOrder', JSON.stringify(orderInfo));

    // Verify it was stored
    const stored = sessionStorage.getItem('lastOrder');
    console.log('✅ Verified storage:', stored);

    clearCart();
    setSuccess(true);

    // Build URL
    const slipUrl = `/orders/${orderId}/slip`;
    console.log('🔗 Redirect URL:', slipUrl);
    console.log('🔗 URL includes undefined?', slipUrl.includes('undefined'));

    // Alert before redirect so you can see it
    alert(`DEBUG: About to redirect to: ${slipUrl}\nOrder ID: ${orderId}`);
    
    setTimeout(() => {
      console.log('🚀 Redirecting now...');
      router.push(slipUrl);
    }, 2000);
    
    return;
  } catch (err) {
    console.error('❌ COD order error:', err);
    console.error('Error stack:', err.stack);
    setError(err.message || 'Failed to place Cash on Delivery order');
  } finally {
    setLoading(false);
  }
  return;
}
    // STRIPE CARD FLOW (similar pattern)
    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please wait and try again.');
      return;
    }

    if (!cardComplete) {
      setError('Please enter valid card details');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          customer: {
            name: formData.name,
            email: formData.email,
            address: {
              line1: formData.address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zip,
              country: formData.country,
            },
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: formData.name,
            email: formData.email,
            address: {
              line1: formData.address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zip,
              country: formData.country,
            },
          },
        },
      });

      if (stripeError) throw new Error(stripeError.message);

      if (paymentIntent.status === 'succeeded') {
        const orderRes = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image || item.images?.[0],
            })),
            email: formData.email,
            shippingAddress: {
              name: formData.name,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              postalCode: formData.zip,
              country: formData.country,
            },
            paymentMethod: 'card',
            paymentIntentId: paymentIntent.id,
            itemsPrice: total,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: total,
          }),
        });

        const orderData = await orderRes.json();

        console.log('Card Order Response:', orderData);

        if (!orderRes.ok) {
          throw new Error(orderData.error || 'Failed to save order');
        }

        const orderId = orderData?.order?._id || orderData?.order?.id;

        if (!orderId) {
          throw new Error('Order created but ID is missing. Please check your email for order confirmation.');
        }

        setSuccess(true);
        clearCart();

        sessionStorage.setItem(
          'lastOrder',
          JSON.stringify({
            orderId: orderId,
            orderNumber: orderData.order.orderNumber,
            date: orderData.order.createdAt,
            total: total.toFixed(2),
            paymentMethod: 'card',
          })
        );

        const slipUrl = `/orders/${encodeURIComponent(orderId)}/slip`;
        setTimeout(() => router.push(slipUrl), 1500);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  useEffect(() => {
    if (items.length === 0 && !success) router.push('/');
  }, [items, router, success]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
              <input name="address" value={formData.address} onChange={handleChange} required placeholder="123 Main St" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input name="city" value={formData.city} onChange={handleChange} required placeholder="New York" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input name="state" value={formData.state} onChange={handleChange} required placeholder="NY" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </motion.div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                <input name="zip" value={formData.zip} onChange={handleChange} required placeholder="10001" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="PK">Pakistan</option>
                </select>
              </motion.div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-medium mb-4">Payment Method</h3>
              <div className="space-y-3">
                <div onClick={() => setPaymentMethod('card')} className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FiCreditCard className="w-6 h-6 text-gray-700" />
                      <div>
                        <p className="font-medium text-gray-900">Credit/Debit Card</p>
                        <p className="text-sm text-gray-500">Pay securely with Stripe</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-blue-500' : 'border-gray-300'}`}>
                      {paymentMethod === 'card' && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                    </div>
                  </div>
                </div>

                <div onClick={() => setPaymentMethod('cod')} className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FiDollarSign className="w-6 h-6 text-gray-700" />
                      <div>
                        <p className="font-medium text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-blue-500' : 'border-gray-300'}`}>
                      {paymentMethod === 'cod' && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {paymentMethod === 'card' && (
              <motion.div variants={itemVariants} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <h3 className="text-lg font-medium mb-4">Card Information</h3>
                <div className="border border-gray-300 rounded-lg p-4 bg-white">
                  <CardElement options={CARD_ELEMENT_OPTIONS} onChange={(e) => setCardComplete(e.complete)} />
                </div>
                <p className="text-xs text-gray-500 mt-2">Your payment information is encrypted and secure.</p>
              </motion.div>
            )}

            {paymentMethod === 'cod' && (
              <motion.div variants={itemVariants} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex">
                  <FiDollarSign className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-900 mb-1">Cash on Delivery</h4>
                    <p className="text-sm text-amber-800">
                      You will pay <strong>${total.toFixed(2)}</strong> in cash when your order is delivered to your address. Please keep the exact amount ready.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[{ icon: FiUser, label: 'Contact' }, { icon: FiCreditCard, label: 'Payment' }].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${step > index + 1 ? 'bg-green-500 text-white' : step === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > index + 1 ? <FiCheck /> : <item.icon />}
              </div>
              <span className="text-sm mt-2 font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="relative mt-4">
          <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded-full" />
          <div className="absolute top-0 left-0 h-1 bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${((step - 1) / 1) * 100}%` }} />
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-start">
          <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6 flex items-center justify-center">
          <FiCheck className="w-5 h-5 mr-2" />
          <span className="font-medium">Order placed successfully! Generating your order slip...</span>
        </motion.div>
      )}

      {renderStep()}

      <div className="mt-8 flex justify-between">
        {step > 1 && (
          <button type="button" onClick={() => (setStep(step - 1), setError(null))} disabled={loading || success} className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Back
          </button>
        )}

        <button type="submit" disabled={loading || success || (step === 2 && paymentMethod === 'card' && !stripe)} className={`ml-auto px-6 py-3 rounded-md text-white flex items-center font-medium transition-colors ${loading || success || (step === 2 && paymentMethod === 'card' && !stripe) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}>
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : success ? (
            <>
              <FiCheck className="mr-2" />
              Order Placed!
            </>
          ) : step < 2 ? (
            <>
              Continue <FiChevronRight className="ml-1" />
            </>
          ) : paymentMethod === 'cod' ? (
            <>
              Place Order <FiChevronRight className="ml-1" />
            </>
          ) : (
            <>
              Pay ${total.toFixed(2)} <FiChevronRight className="ml-1" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Elements stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderSummary() {
  const { items, totalPrice } = useCartStore();
  const subtotal = totalPrice;
  const total = subtotal;

  return (
    <div>
      <div className="max-h-80 overflow-y-auto mb-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex py-3 border-b last:border-0">
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
              <img src={item.image || item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
              <div className="flex justify-between mt-1">
                <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                <span className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-4 border-t">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-3 border-t">
          <span>Total</span>
          <span className="text-blue-600">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}