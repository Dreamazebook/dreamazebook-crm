'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { API_ADMIN_COUPONS } from '@/constants/api';
import { CouponListItem, CouponsListResponse } from '@/types/coupon';

export const useCouponsData = () => {
  const [coupons, setCoupons] = useState<CouponListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ total: 0, per_page: 20, current_page: 1, last_page: 1 });

  const fetchCoupons = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get<CouponsListResponse>(`${API_ADMIN_COUPONS}?page=${page}`);
      if (response.success) {
        setCoupons(response.data);
        setMeta(response.meta);
      } else {
        setError('Failed to fetch coupons');
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return { coupons, loading, error, meta, fetchCoupons, setCoupons };
};
