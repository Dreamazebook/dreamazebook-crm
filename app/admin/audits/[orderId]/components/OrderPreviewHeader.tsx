'use client';

import { FC } from 'react';
import { OrderPreviewResponse } from '@/types/api';
import { formatDate } from '../../../orders/utils';

interface OrderPreviewHeaderProps {
  orderPreview: OrderPreviewResponse;
  onBack: () => void;
}

const OrderPreviewHeader: FC<OrderPreviewHeaderProps> = ({
  orderPreview,
  onBack,
}) => {
  const { order_info } = orderPreview;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回审核列表
          </button>
          
          <div className="border-l border-gray-300 pl-4">
            <h1 className="text-xl font-medium text-gray-900">
              订单预览 #{order_info.order_number}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <span>创建时间：{formatDate(order_info.created_at)}</span>
              {order_info.confirmed_at && (
                <span>确认时间：{formatDate(order_info.confirmed_at)}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order_info.status)}`}>
            {order_info.status_text}
          </span>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            导出预览
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPreviewHeader;