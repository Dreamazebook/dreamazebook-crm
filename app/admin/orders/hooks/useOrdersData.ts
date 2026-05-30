'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { API_ADMIN_ORDERS } from '@/constants/api';
import { ApiResponse } from '@/types/api';
import { OrderDetail } from '@/types/order';

export const useOrdersData = (filters: any) => {
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function getOrdersAPI() {
    return `${API_ADMIN_ORDERS}?status=${filters.statusFilter}&payment_status=${filters.paymentStatus}&discount=${filters.discountFilter}&region=${filters.regionFilter}&date_from=${filters.dateRange.start}&date_to=${filters.dateRange.end}`;
  }

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data, code, success } = await api.get<ApiResponse>(getOrdersAPI());
        if (success) {
          setOrders(data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filters]);

  return { orders, loading, error, setOrders };
};