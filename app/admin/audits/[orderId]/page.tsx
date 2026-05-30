'use client';

import { FC, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import api from '@/utils/api';
import { API_ADMIN_ORDERS } from '@/constants/api';
import { ApiResponse, OrderPreviewResponse } from '@/types/api';
import LoadingState from '../../orders/components/LoadingState';
import ErrorState from '../../orders/components/ErrorState';
import OrderPreviewHeader from './components/OrderPreviewHeader';
import OrderPreviewInfo from './components/OrderPreviewInfo';
import OrderPreviewItems from './components/OrderPreviewItems';
import OrderPreviewSummary from './components/OrderPreviewSummary';

const AdminAuditDetailPage: FC = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const previewId = searchParams.get('previewId');
  
  const [orderPreview, setOrderPreview] = useState<OrderPreviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderPreview = async () => {
      try {
        const { data, success, message } = await api.get<ApiResponse<OrderPreviewResponse>>(`${API_ADMIN_ORDERS}/${orderId}/preview`);
        if (success && data) {
          setOrderPreview(data);
        } else {
          setError(message || 'Failed to fetch order preview');
        }
      } catch (err) {
        console.error('Error fetching order preview:', err);
        setError('Failed to load order preview');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderPreview();
    }
  }, [orderId]);

  const handleApprove = async (itemId: number) => {
    try {
      // API call to approve the item
      const { success } = await api.post<ApiResponse>(`${API_ADMIN_ORDERS}/${orderId}/items/${itemId}/approve`);
      if (success) {
        // Refresh the data
        window.location.reload();
      }
    } catch (err) {
      console.error('Error approving item:', err);
    }
  };

  const handleReject = async (itemId: number, reason: string) => {
    try {
      // API call to reject the item
      const { success } = await api.post<ApiResponse>(`${API_ADMIN_ORDERS}/${orderId}/items/${itemId}/reject`, {
        reason
      });
      if (success) {
        // Refresh the data
        window.location.reload();
      }
    } catch (err) {
      console.error('Error rejecting item:', err);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!orderPreview) return <ErrorState error="Order preview not found" />;

  return (
    <div className="bg-gray-50 min-h-screen">
      <OrderPreviewHeader 
        orderPreview={orderPreview}
        onBack={() => router.push('/admin/audits')}
      />

      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <OrderPreviewInfo orderPreview={orderPreview} />
          
          <OrderPreviewItems 
            items={orderPreview.items}
            previewId={previewId}
            onApprove={handleApprove}
            onReject={handleReject}
          />
          
          <OrderPreviewSummary orderPreview={orderPreview} />
        </div>
      </div>
    </div>
  );
};

export default AdminAuditDetailPage;