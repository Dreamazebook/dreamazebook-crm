'use client';

import { OrderDetail } from '@/types/order';
import { formatAddress } from '@/types/address';

interface OrderAddressInfoProps {
  order: OrderDetail;
}

export default function OrderAddressInfo({ order }: OrderAddressInfoProps) {
  return (
    <>
      {order.shipping_address && (
        <div className="border-t border-gray-200 py-4 mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">收货地址</h4>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-900">
              {order.shipping_address.first_name} {order.shipping_address.last_name}
            </p>
            <p className="text-sm text-gray-600">{order.shipping_address.email}</p>
            <p className="text-sm text-gray-600">{order.shipping_address.phone}</p>
            <p className="text-sm text-gray-600 mt-1">
              {formatAddress(order.shipping_address)}
            </p>
          </div>
        </div>
      )}

      {order.billing_address && order.billing_address.street !== order.shipping_address?.street && (
        <div className="border-t border-gray-200 py-4 mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">账单地址</h4>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-900">
              {order.billing_address.first_name} {order.billing_address.last_name}
            </p>
            <p className="text-sm text-gray-600">{order.billing_address.email}</p>
            <p className="text-sm text-gray-600">{order.billing_address.phone}</p>
            <p className="text-sm text-gray-600 mt-1">
              {formatAddress(order.billing_address)}
            </p>
          </div>
        </div>
      )}
    </>
  );
}