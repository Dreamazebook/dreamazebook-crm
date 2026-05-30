'use client';

import { OrderDetail } from '@/types/order';

interface OrderPaymentInfoProps {
  order: OrderDetail;
}

export default function OrderPaymentInfo({ order }: OrderPaymentInfoProps) {
  return (
    <div className="border-t border-gray-200 py-4 mb-6">
      <h4 className="text-md font-medium text-gray-900 mb-3">费用明细</h4>
      <dl className="space-y-2">
        <div className="flex justify-between">
          <dt className="text-sm text-gray-500">商品小计</dt>
          <dd className="text-sm text-gray-900">
            ${order.total_amount - order.shipping_cost - order.tax_amount + order.discount_amount}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm text-gray-500">配送费用</dt>
          <dd className="text-sm text-gray-900">
            ${order.shipping_cost}
          </dd>
        </div>
        {order.tax_amount > 0 && (
          <div className="flex justify-between">
            <dt className="text-sm text-gray-500">税费</dt>
            <dd className="text-sm text-gray-900">
              ${order.tax_amount}
            </dd>
          </div>
        )}
        {order.discount_amount > 0 && (
          <div className="flex justify-between text-green-600">
            <dt className="text-sm">折扣</dt>
            <dd className="text-sm">
              -${order.discount_amount}
            </dd>
          </div>
        )}
        {order.coupon_code && (
          <div className="flex justify-between">
            <dt className="text-sm text-gray-500">优惠券</dt>
            <dd className="text-sm text-gray-900">{order.coupon_code}</dd>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <dt className="text-sm font-medium text-gray-500">总金额</dt>
          <dd className="text-sm text-gray-900 font-bold">
            ${order.total_amount}
          </dd>
        </div>
      </dl>
    </div>
  );
}