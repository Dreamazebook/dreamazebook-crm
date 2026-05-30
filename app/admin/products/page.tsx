'use client';

import { FC, useEffect, useState } from 'react';
import { API_PRODUCTS } from '@/constants/api';
import api from '@/utils/api';
import { ApiResponse } from '@/types/api';
import { Product } from '@/types/product';

const ProductsPage: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<ApiResponse<Product[]>>(API_PRODUCTS);
        setProducts(response.data || []);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your store's products, pricing, and availability.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
            New Product
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              {products.length === 0 ? (
                <div className="text-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
                  <div className="mx-auto h-24 w-24 text-gray-400">
                    <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No products yet</h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                    Get started by creating your first product. You can add details, set pricing, and manage inventory.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                      </svg>
                      Create First Product
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white">
                  <ul role="list" className="divide-y divide-gray-100">
                    {products.map((product) => (
                      <li key={product.spu_code} className="group hover:bg-gray-50">
                        <div className="flex items-center justify-between gap-x-6 p-5">
                          <div className="flex min-w-0 gap-x-4">
                            <div className="h-12 w-12 flex-none rounded-lg bg-gray-50 flex items-center justify-center">
                              {product.primary_image ? (
                                <img
                                  src={product.primary_image}
                                  alt={product.name}
                                  className="h-full w-full rounded-lg object-cover"
                                />
                              ) : (
                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              )}
                            </div>
                            <div className="min-w-0 flex-auto">
                              <p className="text-sm font-semibold leading-6 text-gray-900">
                                {product.name}
                                <span className="ml-2 inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                  #{product.spu_code}
                                </span>
                              </p>
                              <div className="mt-1 flex items-center gap-x-3 text-xs leading-5 text-gray-500">
                                <p className="truncate">{product.description}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-none items-center gap-x-4">
                            <div className="hidden sm:flex sm:flex-col sm:items-end">
                              <p className="text-sm leading-6 text-gray-900">
                                ${product.base_price}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-gray-500">
                                
                              </p>
                            </div>
                            <div className="flex items-center gap-x-2">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                  product.is_on_sale
                                    ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                                    : 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20'
                                }`}
                              >
                                {product.is_on_sale ? (
                                  <svg className="mr-1 h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
                                    <circle cx={3} cy={3} r={3} />
                                  </svg>
                                ) : (
                                  <svg className="mr-1 h-1.5 w-1.5 fill-yellow-500" viewBox="0 0 6 6" aria-hidden="true">
                                    <circle cx={3} cy={3} r={3} />
                                  </svg>
                                )}
                              </span>
                              <div className="flex gap-x-2">
                                <button
                                  type="button"
                                  className="hidden group-hover:inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="hidden group-hover:inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;