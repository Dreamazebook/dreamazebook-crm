'use client';

import { FC, useState, useEffect } from 'react';
import { OrderDetail } from '@/types/order';
import { formatDate } from '../utils';
import Link from 'next/link';

interface OrdersTableProps {
  orders: OrderDetail[];
  statusColors: Record<string, string>;
  paymentStatusColors: Record<string, string>;
  statusLabels: Record<string, string>;
  paymentStatusLabels: Record<string, string>;
  onViewDetails: (order: OrderDetail) => void;
}

// Countdown component for orders created within 48 hours
const CountdownTimer: FC<{ createdAt: string }> = ({ createdAt }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const createdDate = new Date(createdAt);
      const now = new Date();
      const timeDiff = createdDate.getTime() + 48 * 60 * 60 * 1000 - now.getTime(); // 48 hours in milliseconds

      if (timeDiff <= 0) {
        setTimeLeft('处理超时');
        setIsExpired(true);
        return;
      }

      setIsExpired(false);
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}小时 ${minutes}分钟 ${seconds}秒`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [createdAt]);

  return (
    <span className={`font-medium ${isExpired ? 'text-red-700 bg-red-100 px-2 py-1 rounded' : 'text-red-600'}`}>
      {timeLeft}
    </span>
  );
};

const OrdersTable: FC<OrdersTableProps> = ({
  orders,
  statusColors,
  paymentStatusColors,
  statusLabels,
  paymentStatusLabels,
  onViewDetails,
}) => {
  // Check if order was created within the last 48 hours
  const isWithin48Hours = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const timeDiff = now.getTime() - createdDate.getTime();
    return timeDiff < 48 * 60 * 60 * 1000; // 48 hours in milliseconds
  };
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到订单</h3>
          <p className="mt-1 text-sm text-gray-500">
            没有找到符合条件的订单
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                订单ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                用户名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                订单状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                支付状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                下单时间
                <svg className="inline w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                应付金额
                <svg className="inline w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                实付金额
                <svg className="inline w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                折扣信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.order_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.user?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${statusColors[order.status]}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${paymentStatusColors[order.payment_status]}`}>
                    {paymentStatusLabels[order.payment_status] || order.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.payment_status !== 'pending' && isWithin48Hours(order.created_at) ? (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">{formatDate(order.created_at)}</div>
                      <CountdownTimer createdAt={order.created_at} />
                    </div>
                  ) : (
                    <div>
                      <div>{formatDate(order.created_at)}</div>
                      {order.payment_status === 'pending' && (
                        <div className="text-xs text-gray-400 mt-1">
                          待支付
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${order.total_amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${order.total_amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.coupon_code || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onViewDetails(order)}
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    预览
                  </button>
                  <Link href={`/admin/orders/${order.id}`} className="ml-2 text-blue-600 hover:text-blue-900 transition-colors">
                    详情
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;