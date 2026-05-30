'use client';

import { FC } from 'react';
import { OrderDetail } from '@/types/order';
import { formatDate } from '../../utils';

interface OrderCustomerProps {
  order: OrderDetail;
}

const OrderCustomer: FC<OrderCustomerProps> = ({ order }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Customer Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">客户信息</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-gray-600">
                {(order.user?.name || order.user?.email || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h4 className="text-base font-medium text-gray-900">
                {order.user?.name || '未设置姓名'}
              </h4>
              <p className="text-sm text-gray-500">客户ID: {order.user?.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">邮箱地址</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.user?.email || '未设置'}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">注册时间</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(order.created_at)}</dd>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">客户统计</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <div>
              <dt className="text-sm font-medium text-blue-900">总订单数</dt>
              <dd className="text-2xl font-bold text-blue-600">12</dd>
            </div>
            <div className="text-blue-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <div>
              <dt className="text-sm font-medium text-green-900">累计消费</dt>
              <dd className="text-2xl font-bold text-green-600">¥2,344</dd>
            </div>
            <div className="text-green-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
            <div>
              <dt className="text-sm font-medium text-purple-900">平均订单价值</dt>
              <dd className="text-2xl font-bold text-purple-600">¥195</dd>
            </div>
            <div className="text-purple-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCustomer;