'use client';

import { FC, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import { API_ADMIN_COUPON_DETAIL } from '@/constants/api';
import { ApiResponse } from '@/types/api';
import { CouponDetail, CouponFormData } from '@/types/coupon';
import LoadingState from '../../../orders/components/LoadingState';
import ErrorState from '../../../orders/components/ErrorState';

const AdminCouponEditPage: FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [form, setForm] = useState<CouponFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const { success, data } = await api.get<ApiResponse<CouponDetail>>(API_ADMIN_COUPON_DETAIL(id));
        if (success && data) {
          setForm({
            code: data.code,
            campaign_name: data.campaign_name || '',
            created_for: data.created_for || '',
            description: data.description || '',
            status: data.status,
            type: data.type,
            value: data.value,
            currency_code: data.currency_code,
            valid_from: data.valid_from ? data.valid_from.split('T')[0] : '',
            valid_until: data.valid_until ? data.valid_until.split('T')[0] : '',
            max_uses: data.max_uses,
            per_user_limit: data.per_user_limit,
            min_subtotal_amount: data.min_subtotal_amount,
            max_discount_amount: data.max_discount_amount,
            allow_stack_with_promotions: data.allow_stack_with_promotions,
            metadata: data.metadata,
          });
        } else {
          setFetchError('Failed to fetch coupon');
        }
      } catch (err) {
        setFetchError('Failed to load coupon');
      } finally {
        setLoading(false);
      }
    };
    fetchCoupon();
  }, [id]);

  const updateField = <K extends keyof CouponFormData>(key: K, value: CouponFormData[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setError(null);
    setSaving(true);

    try {
      const payload = {
        ...form,
        code: form.code.toUpperCase(),
        valid_from: form.valid_from ? `${form.valid_from} 00:00:00` : null,
        valid_until: form.valid_until ? `${form.valid_until} 23:59:59` : null,
      };

      await api.put(API_ADMIN_COUPON_DETAIL(id), payload);
      router.push(`/admin/coupons/${id}`);
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to update coupon');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;
  if (fetchError) return <ErrorState error={fetchError} />;
  if (!form) return <ErrorState error="Coupon not found" />;

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.push(`/admin/coupons/${id}`)} className="text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-medium text-gray-900">Edit Coupon: {form.code}</h1>
        </div>
      </div>

      <div className="px-6 py-6 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Code *</label>
                <input type="text" maxLength={50} required value={form.code} onChange={(e) => updateField('code', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Status *</label>
                <select value={form.status} onChange={(e) => updateField('status', e.target.value as 'active' | 'inactive')} className={inputClass}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Campaign Name</label>
                <input type="text" value={form.campaign_name} onChange={(e) => updateField('campaign_name', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Created For</label>
                <input type="text" value={form.created_for} onChange={(e) => updateField('created_for', e.target.value)} className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea maxLength={500} rows={3} value={form.description} onChange={(e) => updateField('description', e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Discount */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Discount</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Type *</label>
                <select value={form.type} onChange={(e) => updateField('type', e.target.value as 'percentage' | 'fixed_amount')} className={inputClass}>
                  <option value="percentage">Percentage</option>
                  <option value="fixed_amount">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Value *</label>
                <input type="number" required min={0} step={0.01} value={form.value} onChange={(e) => updateField('value', parseFloat(e.target.value) || 0)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Currency</label>
                <input type="text" maxLength={3} value={form.currency_code} onChange={(e) => updateField('currency_code', e.target.value.toUpperCase())} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Validity */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Validity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Valid From</label>
                <input type="date" value={form.valid_from} onChange={(e) => updateField('valid_from', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Valid Until</label>
                <input type="date" value={form.valid_until} onChange={(e) => updateField('valid_until', e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Limits */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Usage Limits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Max Uses</label>
                <input type="number" min={0} value={form.max_uses ?? ''} onChange={(e) => updateField('max_uses', e.target.value ? parseInt(e.target.value) : null)} className={inputClass} placeholder="Unlimited" />
              </div>
              <div>
                <label className={labelClass}>Per User Limit</label>
                <input type="number" min={0} value={form.per_user_limit ?? ''} onChange={(e) => updateField('per_user_limit', e.target.value ? parseInt(e.target.value) : null)} className={inputClass} placeholder="Unlimited" />
              </div>
              <div>
                <label className={labelClass}>Min Subtotal Amount</label>
                <input type="number" min={0} step={0.01} value={form.min_subtotal_amount ?? ''} onChange={(e) => updateField('min_subtotal_amount', e.target.value ? parseFloat(e.target.value) : null)} className={inputClass} placeholder="No minimum" />
              </div>
              <div>
                <label className={labelClass}>Max Discount Amount</label>
                <input type="number" min={0} step={0.01} value={form.max_discount_amount ?? ''} onChange={(e) => updateField('max_discount_amount', e.target.value ? parseFloat(e.target.value) : null)} className={inputClass} placeholder="No cap" />
              </div>
            </div>
          </div>

          {/* Options */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Options</h2>
            <label className="flex items-center space-x-3">
              <input type="checkbox" checked={form.allow_stack_with_promotions} onChange={(e) => updateField('allow_stack_with_promotions', e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <span className="text-sm text-gray-700">Allow stacking with promotions</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => router.push(`/admin/coupons/${id}`)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCouponEditPage;
