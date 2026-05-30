'use client';

import { FC } from 'react';
import { OrderDetail } from '@/types/order';
import { formatDate } from '../../utils';

interface OrderDetailHeaderProps {
  order: OrderDetail;
  onBack: () => void;
  statusColors: Record<string, string>;
  paymentStatusColors: Record<string, string>;
  statusLabels: Record<string, string>;
  paymentStatusLabels: Record<string, string>;
  onStatusUpdate: (status: string) => void;
  onPaymentStatusUpdate: (paymentStatus: string) => void;
}

const OrderDetailHeader: FC<OrderDetailHeaderProps> = ({
  order,
  onBack,
  statusColors,
  paymentStatusColors,
  statusLabels,
  paymentStatusLabels,
  onStatusUpdate,
  onPaymentStatusUpdate,
}) => {
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
            返回订单列表
          </button>
          
          <div className="border-l border-gray-300 pl-4">
            <h1 className="text-xl font-medium text-gray-900">
              订单详情 #{order.order_number}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <span>创建时间：{formatDate(order.created_at)}</span>
              <span>更新时间：{formatDate(order.updated_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">订单状态:</span>
              <span 
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}
              >
                {statusLabels[order.status] || order.status}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">支付状态:</span>
              <span 
                className={`px-3 py-1 rounded-full text-sm font-medium ${paymentStatusColors[order.payment_status] || 'bg-gray-100 text-gray-800'}`}
              >
                {paymentStatusLabels[order.payment_status] || order.payment_status}
              </span>
            </div>
          </div>

          {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            导出订单
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailHeader;