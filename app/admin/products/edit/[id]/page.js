'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiSave, FiX } from 'react-icons/fi';
import { message } from 'antd';
import Image from 'next/image';

import FileUpload from '@/components/ui/FileUpload';
import { useProductStore } from '../../../../../lib/store';

export default function EditProduct({ params }) {
  const router = useRouter();
  const { id } = params;

  const updateProduct = useProductStore((state) => state.updateProduct);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stockStatus: 'in-stock',
    description: '',
    featured: false,
    images: [],
  });

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (!res.ok || !data?.data) throw new Error();

        const p = data.data;

        setFormData({
          name: p.name,
          category: p.category,
          price: p.price,
          stockStatus: p.stockStatus || 'in-stock',
          description: p.description || '',
          featured: !!p.featured,
          images: p.images || [],
        });

        setLoading(false);
      } catch {
        message.error('Product not found');
        router.push('/admin/products');
      }
    };

    fetchProduct();
  }, [id, router]);

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch {
        message.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.images.length) {
        message.error('At least one image is required');
        return;
      }

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        image: formData.images[0],
        currency: 'PKR',
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result?.message);

      updateProduct(id, payload);
      message.success('Product updated successfully');
      router.push('/admin/products');
    } catch (err) {
      message.error(err.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pt-12">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <button onClick={() => router.push('/admin/products')}>
          <FiX />
        </button>
      </div>

      <motion.div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* NAME */}
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Product name"
            required
          />

          {/* CATEGORY */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          {/* PRICE */}
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Price (PKR)"
            required
          />

          {/* STOCK */}
          <select
            name="stockStatus"
            value={formData.stockStatus}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border p-2 rounded"
            required
          />

          {/* FEATURED */}
          <label className="flex gap-2 items-center">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
            Featured Product
          </label>

          {/* IMAGES */}
          <FileUpload
            maxCount={5}
            accept="image/*"
            onUploadComplete={(url) =>
              setFormData(prev => ({ ...prev, images: [...prev.images, url] }))
            }
          />

          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {formData.images.map((img, i) => (
                <div key={i} className="relative">
                  <Image src={img} alt="" width={120} height={120} className="rounded object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData(prev => ({
                        ...prev,
                        images: prev.images.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
