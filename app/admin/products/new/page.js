// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { FiSave, FiX } from 'react-icons/fi';
// import { useProductStore } from '../../../../lib/store';
// import { message } from 'antd';
// import FileUpload from '@/components/ui/FileUpload';

// export default function NewProduct() {
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const addProduct = useProductStore((state) => state.addProduct);

//   const [formData, setFormData] = useState({
//     name: '',
//     category: '',
//     price: 0,
//     quantity: 0,
//     description: '',
//     featured: false,
//     images: []
//   });

//   const [categories, setCategories] = useState([]);

//   // Fetch categories from API
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch('/api/categories');
//         const data = await res.json();
//         setCategories(data);
//       } catch (err) {
//         console.error('Failed to fetch categories:', err);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (name === 'price' || name === 'quantity') {
//       setFormData({
//         ...formData,
//         [name]: type === 'checkbox' ? checked : value === '' ? 0 : Number(value)
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [name]: type === 'checkbox' ? checked : value
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const productData = {
//         ...formData,
//         price: parseFloat(formData.price),
//         quantity: parseInt(formData.quantity),
//         slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
//         image: formData.images.length > 0 ? formData.images[0] : '/images/placeholder.jpg',
//         createdAt: new Date().toISOString(),
//         featured: formData.featured || false,
//       };

//       const response = await fetch('/api/products', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(productData),
//       });

//       const result = await response.json();

//       if (result.success) {
//         addProduct(result.data);
//         message.success('Product added successfully!');
//         router.push('/admin/products');
//       } else {
//         throw new Error(result.message || 'Failed to save product');
//       }
//     } catch (error) {
//       console.error('Error adding product:', error);
//       message.error('Failed to add product. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto pt-12">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
//         <button
//           type="button"
//           onClick={() => router.push('/admin/products')}
//           className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//         >
//           <FiX className="mr-2 -ml-1 h-5 w-5" />
//           Cancel
//         </button>
//       </div>

//       <motion.div
//         className="bg-white rounded-lg shadow overflow-hidden"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//       >
//         <form onSubmit={handleSubmit}>
//           <div className="p-6 space-y-6">
//             {/* Basic Information */}
//             <div>
//               <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
//               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                     Product Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     id="name"
//                     required
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="category" className="block text-sm font-medium text-gray-700">
//                     Category *
//                   </label>
//                   <select
//                     id="category"
//                     name="category"
//                     required
//                     value={formData.category}
//                     onChange={handleChange}
//                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md"
//                   >
//                     <option value="">Select a category</option>
//                     {categories.length > 0 &&
//                       categories.map((cat) => (
//                         <option key={cat._id} value={cat.name}>
//                           {cat.name}
//                         </option>
//                       ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label htmlFor="price" className="block text-sm font-medium text-gray-700">
//                     Price ($) *
//                   </label>
//                   <input
//                     type="number"
//                     name="price"
//                     id="price"
//                     required
//                     min="0"
//                     step="0.01"
//                     value={formData.price}
//                     onChange={handleChange}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
//                     Stock Quantity *
//                   </label>
//                   <input
//                     type="number"
//                     name="quantity"
//                     id="quantity"
//                     required
//                     min="0"
//                     value={formData.quantity}
//                     onChange={handleChange}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Description */}
//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                 Description *
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 rows="4"
//                 required
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
//               />
//             </div>

//             {/* Featured */}
//             <div>
//               <h2 className="text-lg font-medium text-gray-900 mb-4">Product Options</h2>
//               <div className="flex items-center">
//                 <input
//                   id="featured"
//                   name="featured"
//                   type="checkbox"
//                   className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                   checked={formData.featured || false}
//                   onChange={handleChange}
//                 />
//                 <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
//                   Featured product (will appear on homepage)
//                 </label>
//               </div>
//             </div>

//             {/* Images */}
//             <div>
//               <h2 className="text-lg font-medium text-gray-900 mb-4">Product Images</h2>
//               <div className="mt-1 px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//                 <FileUpload
//                   maxCount={5}
//                   accept="image/*"
//                   onUploadComplete={(filePath) => {
//                     if (filePath) {
//                       setFormData({
//                         ...formData,
//                         images: [...formData.images, filePath],
//                       });
//                     }
//                   }}
//                 />

//                 {formData.images.length > 0 && (
//                   <div className="mt-4">
//                     <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</h3>
//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                       {formData.images.map((image, index) => (
//                         <div key={index} className="relative group">
//                           <img
//                             src={image}
//                             alt={`Product image ${index + 1}`}
//                             className="h-24 w-24 object-cover rounded-md"
//                           />
//                           <button
//                             type="button"
//                             className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
//                             onClick={() => {
//                               const newImages = [...formData.images];
//                               newImages.splice(index, 1);
//                               setFormData({ ...formData, images: newImages });
//                             }}
//                           >
//                             <FiX className="h-4 w-4" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? 'Saving...' : 'Save Product'}
//             </button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiSave, FiX } from 'react-icons/fi';
import { useProductStore } from '../../../../lib/store';
import { message } from 'antd';
import FileUpload from '@/components/ui/FileUpload';

export default function NewProduct() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addProduct = useProductStore((state) => state.addProduct);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stockStatus: 'in-stock', // <-- NEW
    description: '',
    featured: false,
    images: []
  });

  const [categories, setCategories] = useState([]);

  // SLUGIFY
  const slugify = (text) => {
    return String(text || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        message.error('Could not load categories');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name.trim()) {
        message.error('Product name is required.');
        setIsSubmitting(false);
        return;
      }

      if (!formData.category) {
        message.error('Please select a category.');
        setIsSubmitting(false);
        return;
      }

      if (formData.images.length === 0) {
        message.error('Please upload at least one image.');
        setIsSubmitting(false);
        return;
      }

      if (formData.price === '' || isNaN(Number(formData.price))) {
        message.error('Please enter a valid price in PKR.');
        setIsSubmitting(false);
        return;
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        currency: 'PKR',
        stockStatus: formData.stockStatus, // <-- SAVED HERE
        slug: slugify(formData.name),
        images: formData.images,
        image: formData.images[0],
        featured: !!formData.featured,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (response.ok && result?.success) {
        addProduct(result.data || productData);
        message.success('Product added successfully!');
        router.push('/admin/products');
      } else {
        throw new Error(result?.message || 'Failed to save product');
      }
    } catch (error) {
      message.error(error.message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white shadow-sm"
        >
          <FiX className="mr-2" />
          Cancel
        </button>
      </div>

      <motion.div
        className="bg-white rounded-lg shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* BASIC INFO */}
            <div>
              <h2 className="text-lg font-medium mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                
                {/* NAME */}
                <div>
                  <label className="block text-sm font-medium">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-md py-2 px-3"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Slug preview: <b>{slugify(formData.name)}</b>
                  </p>
                </div>

                {/* CATEGORY */}
                <div>
                  <label className="block text-sm font-medium">Category *</label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-md py-2 px-3"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* PRICE */}
                <div>
                  <label className="block text-sm font-medium">Price (PKR) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-md py-2 px-3"
                  />
                </div>

                {/* STOCK STATUS */}
                <div>
                  <label className="block text-sm font-medium">Stock Status *</label>
                  <select
                    name="stockStatus"
                    value={formData.stockStatus}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-md py-2 px-3"
                  >
                    <option value="in-stock">In Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium">Description *</label>
              <textarea
                name="description"
                required
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md py-2 px-3"
              />
            </div>

            {/* FEATURED */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                Featured Product
              </label>
            </div>

            {/* IMAGES */}
            <div>
              <h2 className="text-lg font-medium mb-4">Images</h2>
              <div className="border-2 border-dashed rounded-md p-6">
                <FileUpload
                  maxCount={5}
                  accept="image/*"
                  onUploadComplete={(url) => {
                    setFormData((prev) => ({
                      ...prev,
                      images: [...prev.images, url],
                    }));
                  }}
                />

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img} className="h-24 w-24 object-cover rounded-md" />
                        <button
                          type="button"
                          onClick={() => {
                            const imgs = [...formData.images];
                            imgs.splice(i, 1);
                            setFormData({ ...formData, images: imgs });
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <div className="p-4 bg-gray-50 text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

