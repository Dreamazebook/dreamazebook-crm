'use client';

import { FC, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import { API_ADMIN_COUPON_DETAIL, API_ADMIN_COUPON_DISABLE } from '@/constants/api';
import { ApiResponse } from '@/types/api';
import { CouponDetail } from '@/types/coupon';
import LoadingState from '../../orders/components/LoadingState';
import ErrorState from '../../orders/components/ErrorState';

const AdminCouponDetailPage: FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [coupon, setCoupon] = useState<CouponDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [disabling, setDisabling] = useState(false);

  const fetchDetail = async () => {
    try {
      const { success, data } = await api.get<ApiResponse<CouponDetail>>(API_ADMIN_COUPON_DETAIL(id));
      if (success && data) {
        setCoupon(data);
      } else {
        setError('Failed to fetch coupon details');
      }
    } catch (err) {
      console.error('Error fetching coupon detail:', err);
      setError('Failed to load coupon details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const handleDisable = async () => {
    if (!confirm('Are you sure you want to disable this coupon?')) return;
    setDisabling(true);
    try {
      await api.post(API_ADMIN_COUPON_DISABLE(id));
      fetchDetail();
    } catch (err) {
      console.error('Error disabling coupon:', err);
    } finally {
      setDisabling(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!coupon) return <ErrorState error="Coupon not found" />;

  const isActive = coupon.status === 'active';

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin/coupons')}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-medium text-gray-900">{coupon.code}</h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {coupon.status}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push(`/admin/coupons/${id}/edit`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Edit
            </button>
            {isActive && (
              <button
                onClick={handleDisable}
                disabled={disabling}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {disabling ? 'Disabling...' : 'Disable'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 max-w-7xl mx-auto space-y-6">
        {/* Coupon Config */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500">Code</label>
              <p className="mt-1 text-sm text-gray-900">{coupon.code}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Type</label>
              <p className="mt-1 text-sm text-gray-900">
                {coupon.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Value</label>
              <p className="mt-1 text-sm text-gray-900">
                {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value} ${coupon.currency_code}`}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Created For</label>
              <p className="mt-1 text-sm text-gray-900">{coupon.created_for || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Campaign</label>
              <p className="mt-1 text-sm text-gray-900">{coupon.campaign_name || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Currency</label>
              <p className="mt-1 text-sm text-gray-900">{coupon.currency_code}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Valid From</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(coupon.valid_from)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Valid Until</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(coupon.valid_until)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Max Uses</label>
              <p className="mt-1 text-sm text-gray-900">{coupon.max_uses ?? 'Unlimited'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Used Count</label>
              <p className="mt-1 text-sm text-gray-900">{coupon.used_count}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Per User Limit</label>
              <p className="mt-1 text-sm text-gray-900">{coupon.per_user_limit ?? 'Unlimited'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Min Subtotal</label>
              <p className="mt-1 text-sm text-gray-900">
                {coupon.min_subtotal_amount ? `$${coupon.min_subtotal_amount}` : '-'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Max Discount</label>
              <p className="mt-1 text-sm text-gray-900">
                {coupon.max_discount_amount ? `$${coupon.max_discount_amount}` : '-'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Stack with Promotions</label>
              <p className="mt-1 text-sm text-gray-900">{coupon.allow_stack_with_promotions ? 'Yes' : 'No'}</p>
            </div>
          </div>
          {coupon.description && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-500">Description</label>
              <p className="mt-1 text-sm text-gray-900">{coupon.description}</p>
            </div>
          )}
        </div>

        {/* Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500">Orders</label>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{coupon.performance.orders}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Revenue</label>
              <p className="mt-1 text-2xl font-semibold text-gray-900">${coupon.performance.revenue.toFixed(2)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">AOV</label>
              <p className="mt-1 text-2xl font-semibold text-gray-900">${coupon.performance.aov.toFixed(2)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Discount Given</label>
              <p className="mt-1 text-2xl font-semibold text-gray-900">${coupon.performance.discount_given.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
          {coupon.recent_orders.length === 0 ? (
            <p className="text-sm text-gray-500">No paid orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {coupon.recent_orders.map((order) => (
                    <tr key={order.order_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-blue-600">
                        <button onClick={() => router.push(`/admin/orders/${order.order_id}`)}>
                          #{order.order_number}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{order.customer_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">${order.total_amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">${order.revenue_amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-red-600">-${order.discount_amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(order.paid_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCouponDetailPage;
