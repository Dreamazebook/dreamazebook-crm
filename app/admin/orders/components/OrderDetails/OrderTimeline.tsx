'use client';

import { formatDate, OrderDetail } from '@/types/order';

interface OrderTimelineProps {
  order: OrderDetail;
}

export default function OrderTimeline({ order }: OrderTimelineProps) {
  return (
    <div className="border-t border-gray-200 py-4 mb-6">
      <h4 className="text-md font-medium text-gray-900 mb-3">重要日期</h4>
      <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">创建时间</dt>
          <dd className="mt-1 text-sm text-gray-900">{formatDate(order.created_at)}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">更新时间</dt>
          <dd className="mt-1 text-sm text-gray-900">{formatDate(order.updated_at)}</dd>
        </div>
        {order.paid_at && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">支付时间</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(order.paid_at)}</dd>
          </div>
        )}
        {order.completed_at && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">完成时间</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(order.completed_at)}</dd>
          </div>
        )}
        {order.cancelled_at && (
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">取消时间</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(order.cancelled_at)}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}