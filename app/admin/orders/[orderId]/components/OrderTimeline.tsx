'use client';

import { FC } from 'react';
import { OrderDetail } from '@/types/order';
import { formatDate } from '../../utils';

interface OrderTimelineProps {
  order: OrderDetail;
}

const OrderTimeline: FC<OrderTimelineProps> = ({ order }) => {
  const timelineEvents = [
    {
      id: 1,
      title: '订单创建',
      description: '客户成功创建订单',
      timestamp: order.created_at,
      type: 'created',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    },
    ...(order.paid_at ? [{
      id: 2,
      title: '支付完成',
      description: '客户完成支付',
      timestamp: order.paid_at,
      type: 'paid',
      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
    }] : []),
    ...(order.completed_at ? [{
      id: 3,
      title: '订单完成',
      description: '订单处理完成',
      timestamp: order.completed_at,
      type: 'completed',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    }] : []),
    ...(order.cancelled_at ? [{
      id: 4,
      title: '订单取消',
      description: '订单已被取消',
      timestamp: order.cancelled_at,
      type: 'cancelled',
      icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
    }] : []),
  ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const getEventColor = (type: string) => {
    switch (type) {
      case 'created': return 'bg-blue-100 text-blue-600';
      case 'paid': return 'bg-green-100 text-green-600';
      case 'completed': return 'bg-purple-100 text-purple-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">订单时间线</h3>
      
      <div className="flow-root">
        <ul className="-mb-8">
          {timelineEvents.map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== timelineEvents.length - 1 ? (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getEventColor(event.type)}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={event.icon} />
                      </svg>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.description}</p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime={event.timestamp}>
                        {formatDate(event.timestamp)}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Additional Notes */}
      {order.notes && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">订单备注</h4>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{order.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;