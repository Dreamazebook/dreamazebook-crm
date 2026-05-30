'use client';

import { FC } from 'react';
import { OrderPreviewResponse } from '@/types/api';
import { formatDate } from '../../../orders/utils';

interface OrderPreviewInfoProps {
  orderPreview: OrderPreviewResponse;
}

const OrderPreviewInfo: FC<OrderPreviewInfoProps> = ({ orderPreview }) => {
  const { order_info, user_info } = orderPreview;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Order Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">订单信息</h3>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">订单ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{order_info.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">订单号</dt>
              <dd className="mt-1 text-sm text-gray-900">{order_info.order_number}</dd>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">状态</dt>
              <dd className="mt-1 text-sm text-gray-900">{order_info.status_text}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">总金额</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {order_info.total ? `$${order_info.total.toFixed(2)}` : '未设置'}
              </dd>
            </div>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">创建时间</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(order_info.created_at)}</dd>
          </div>

          {order_info.confirmed_at && (
            <div>
              <dt className="text-sm font-medium text-gray-500">确认时间</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(order_info.confirmed_at)}</dd>
            </div>
          )}
        </div>
      </div>

      {/* User Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">用户信息</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-gray-600">
                {user_info.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h4 className="text-base font-medium text-gray-900">{user_info.name}</h4>
              <p className="text-sm text-gray-500">用户ID: {user_info.id}</p>
            </div>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">邮箱地址</dt>
            <dd className="mt-1 text-sm text-gray-900">{user_info.email}</dd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPreviewInfo;