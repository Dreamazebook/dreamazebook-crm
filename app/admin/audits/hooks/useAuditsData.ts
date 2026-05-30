'use client';

import { OrderDetail } from '@/types/order';
import { API_ADMIN_ORDERS } from '@/constants/api';
import { ApiResponse } from '@/types/api';
import api from '@/utils/api';
import { useState, useEffect } from 'react';

export const useAuditsData = () => {
  const [audits, setAudits] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const {success,data} = await api.get<ApiResponse>(`${API_ADMIN_ORDERS}?status=ai_completed`);
        if (success) {
          setAudits(data);
        }
      } catch (err) {
        console.error('Error fetching audits:', err);
        setError('Failed to load audits');
      } finally {
        setLoading(false);
      }
    };

    fetchAudits();
  }, []);

  return { audits, loading, error, setAudits };
};