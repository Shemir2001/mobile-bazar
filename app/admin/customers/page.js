'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiSearch,
  FiDownload,
  FiMail,
  FiTrash2,
} from 'react-icons/fi';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/admin/customers');

        if (!res.ok) {
          throw new Error('Failed to fetch customers');
        }

        const data = await res.json();
        setCustomers(data.customers || []);
      } catch (err) {
        console.error('CUSTOMER FETCH ERROR:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Search filter
  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(search.toLowerCase()) ||
    customer.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-sm text-gray-500">
            All customers who placed at least one order
          </p>
        </div>

        <button className="mt-4 md:mt-0 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          <FiDownload />
          Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-4 bg-white p-3 rounded-lg shadow-sm border">
        <FiSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search customers..."
          className="w-full outline-none text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">
            Loading customers...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No customers found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center">Orders</th>
                <th className="p-3 text-right">Total Spent</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FiUsers className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {customer.name || 'Guest User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Joined {customer.createdAt}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3 text-gray-600">
                    {customer.email}
                  </td>

                  <td className="p-3 text-center">
                    {customer.orders}
                  </td>

                  <td className="p-3 text-right font-medium">
                    ${Number(customer.totalSpent || 0).toFixed(2)}
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        title="Send Email"
                        className="p-2 rounded hover:bg-gray-100 text-indigo-600"
                      >
                        <FiMail />
                      </button>

                      <button
                        title="Delete (UI only)"
                        className="p-2 rounded hover:bg-gray-100 text-red-500"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
