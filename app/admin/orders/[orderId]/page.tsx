'use client';

import { FC, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { OrderDetail } from '@/types/order';
import api from '@/utils/api';
import { API_ADMIN_ORDER_DETAIL, API_ADMIN_ORDER_DETAIL_MANUAL_CONFIRM, API_ADMIN_ORDERS, API_ADMIN_ORDER_GENERATE_PDF, API_ADMIN_ORDER_PDF_URLS, API_ADMIN_ORDER_SEND_PREVIEW_PDF } from '@/constants/api';
import { ApiResponse } from '@/types/api';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import OrderDetailHeader from './components/OrderDetailHeader';
import OrderDetailTabs from './components/OrderDetailTabs';
import OrderOverview from './components/OrderOverview';
import OrderItems from './components/OrderItems';
import OrderCustomer from './components/OrderCustomer';
import OrderShipping from './components/OrderShipping';
import OrderPayment from './components/OrderPayment';
import OrderLogistics from './components/OrderLogistics';
import OrderTimeline from './components/OrderTimeline';
import OrderActions from './components/OrderActions';
import {
  statusColors,
  paymentStatusColors,
  statusLabels,
  paymentStatusLabels,
} from '../constants/orderConstants';
import { OrderDetailProvider } from './context/OrderDetailContext';

const AdminOrderDetailPage: FC = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Initialize active tab from URL search params
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const fetchOrderDetail = async (orderId:string|number) => {
    try {
      const { data, success, message } = await api.get<ApiResponse<OrderDetail>>(API_ADMIN_ORDER_DETAIL(orderId));
      if (success && data) {
        setOrder(data);
        if (selectedItem) {
          // Update the selectedItem with the refreshed data
          const refreshedItem = data.items.find(item => item.id === selectedItem.id);
          if (refreshedItem) {
            setSelectedItem(refreshedItem);
          }
        }
      } else {
        setError(message || 'Failed to fetch order details');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail(orderId);
    }
  }, [orderId]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return;
    
    try {
      const { success, data } = await api.put<ApiResponse<OrderDetail>>(`${API_ADMIN_ORDERS}/${orderId}`, {
        status: newStatus
      });
      
      if (success && data) {
        setOrder(data);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handlePaymentStatusUpdate = async (newPaymentStatus: string) => {
    if (!order) return;
    
    try {
      const { success, data } = await api.put<ApiResponse<OrderDetail>>(`${API_ADMIN_ORDERS}/${orderId}`, {
        payment_status: newPaymentStatus
      });
      
      if (success && data) {
        setOrder(data);
      }
    } catch (err) {
      console.error('Error updating payment status:', err);
    }
  };

  const handleManualConfirm = async (itemId: string) => {
    try {
      const { success, data } = await api.post<ApiResponse<OrderDetail>>(API_ADMIN_ORDER_DETAIL_MANUAL_CONFIRM(orderId, itemId), {
        item_id: itemId
      });
      if (success && data) {
        // 确认成功后关闭模态窗口
        setIsModalOpen(false);
        setSelectedItem(null);
        setOrder(data);
      }
    } catch (err:any) {
      console.error('Error confirming order:', err);
      alert('Failed to confirm order: ' + err?.response?.data?.message);
    }
  };

  const handleGeneratePdf = async () => {
    try {
      const { success, data } = await api.post<ApiResponse<OrderDetail>>(API_ADMIN_ORDER_GENERATE_PDF(orderId));
      if (success && data) {
        setOrder(data);
        alert('PDF generated successfully');
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF');
    }
  };

  const handleGetPdfUrls = async () => {
    try {
      const { success, data } = await api.get<any>(API_ADMIN_ORDER_PDF_URLS(orderId));
      if (success && data) {
        return data;
      } else {
        alert('No PDFs available');
        return null;
      }
    } catch (err) {
      console.error('Error fetching PDF URLs:', err);
      alert('Failed to fetch PDF URLs');
      return null;
    }
  };

  const handleSendPreviewPdf = async () => {
    try {
      const { success, message } = await api.post<ApiResponse>(API_ADMIN_ORDER_SEND_PREVIEW_PDF(orderId));
      if (success) {
        alert(message || 'Preview PDF sent successfully');
      }
    } catch (err) {
      console.error('Error sending preview PDF:', err);
      alert('Failed to send preview PDF');
    }
  };

  const openModal = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`?tab=${tab}`);
  };

  const renderTabContent = () => {
    if (!order) return null;

    switch (activeTab) {
      case 'overview':
        return <OrderOverview order={order} />;
      case 'items':
        return <OrderItems order={order} />;
      case 'customer':
        return <OrderCustomer order={order} />;
      case 'shipping':
        return <OrderShipping order={order} />;
      case 'payment':
        return <OrderPayment order={order} />;
      case 'logistics':
        return <OrderLogistics order={order} />;
      case 'timeline':
        return <OrderTimeline order={order} />;
      default:
        return <OrderOverview order={order} />;
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!order) return <ErrorState error="Order not found" />;

  return (
    <OrderDetailProvider
      order={order}
      fetchOrderDetail={fetchOrderDetail}
      handleManualConfirm={handleManualConfirm}
      isModalOpen={isModalOpen}
      selectedItem={selectedItem}
      openModal={openModal}
      closeModal={closeModal}
      handleGeneratePdf={handleGeneratePdf}
      handleGetPdfUrls={handleGetPdfUrls}
      handleSendPreviewPdf={handleSendPreviewPdf}
    >
      <div className="bg-gray-50 min-h-screen">
        <OrderDetailHeader 
          order={order}
          onBack={() => router.push('/admin/orders')}
          statusColors={statusColors}
          paymentStatusColors={paymentStatusColors}
          statusLabels={statusLabels}
          paymentStatusLabels={paymentStatusLabels}
          onStatusUpdate={handleStatusUpdate}
          onPaymentStatusUpdate={handlePaymentStatusUpdate}
        />

        <div className="px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <OrderDetailTabs 
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
            
            <div className="mt-6">
              {renderTabContent()}
            </div>

            <OrderActions
              order={order}
              onRefresh={() => fetchOrderDetail(orderId)}
              handleGeneratePdf={handleGeneratePdf}
              handleGetPdfUrls={handleGetPdfUrls}
              handleSendPreviewPdf={handleSendPreviewPdf}
            />
          </div>
        </div>
      </div>
    </OrderDetailProvider>
  );
};

export default AdminOrderDetailPage;