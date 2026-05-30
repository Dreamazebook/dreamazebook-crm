'use client';

import { OrderDetail } from '@/types/order';
import Image from 'next/image';

interface OrderItemsListProps {
  items: OrderDetail['items'];
}

export default function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div className="border-t border-gray-200 py-4 mb-6">
      <h4 className="text-md font-medium text-gray-900 mb-3">订单商品</h4>
      <div className="space-y-3">
        {items?.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-16 h-20 flex-shrink-0 rounded overflow-hidden">
              
            </div>
            <div className="flex-1">
              
              {item.message && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">留言:</span> {item.message}
                </p>
              )}
            </div>
            <div className="text-right">
              <span className="text-sm font-medium">${item.total_price}</span>
              <p className="text-xs text-gray-500">单价</p>
              <span className="text-sm font-bold">${item.total_price}</span>
              <p className="text-xs text-gray-500">小计</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}