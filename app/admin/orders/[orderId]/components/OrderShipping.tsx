'use client';

import { FC } from 'react';
import { OrderDetail, getShippingOptions } from '@/types/order';
import { formatAddress } from '@/types/address';
import { formatCurrency } from '../../utils';

interface OrderShippingProps {
  order: OrderDetail;
}

const OrderShipping: FC<OrderShippingProps> = ({ order }) => {
  const shippingOptions = getShippingOptions(order.shipping_options);
  const shippingOption = shippingOptions.find(option => option.code === order.shipping_method);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Shipping Address */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">收货地址</h3>
        
        {order.shipping_address ? (
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {order.shipping_address.first_name} {order.shipping_address.last_name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">{order.shipping_address.email}</p>
                  <p className="text-sm text-gray-600 mb-2">{order.shipping_address.phone}</p>
                  <p className="text-sm text-gray-700">
                    {formatAddress(order.shipping_address)}
                  </p>
                </div>
                {order.shipping_address.is_default && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    默认地址
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p>未设置收货地址</p>
          </div>
        )}
      </div>

      {/* Billing Address */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">账单地址</h3>
        
        {order.billing_address && order.billing_address.street !== order.shipping_address?.street ? (
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">
                {order.billing_address.first_name} {order.billing_address.last_name}
              </h4>
              <p className="text-sm text-gray-600 mb-1">{order.billing_address.email}</p>
              <p className="text-sm text-gray-600 mb-2">{order.billing_address.phone}</p>
              <p className="text-sm text-gray-700">
                {formatAddress(order.billing_address)}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>与收货地址相同</p>
          </div>
        )}
      </div>

      {/* Shipping Method */}
      <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">配送方式</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <dt className="text-sm font-medium text-gray-500 mb-1">配送方式</dt>
            <dd className="text-sm text-gray-900">{shippingOption?.name || order.shipping_method || '未设置'}</dd>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <dt className="text-sm font-medium text-gray-500 mb-1">配送费用</dt>
            <span className='text-sm text-gray-900'>${order.shipping_cost}</span>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <dt className="text-sm font-medium text-gray-500 mb-1">预计送达</dt>
            <dd className="text-sm text-gray-900">{shippingOption?.estimated_days || '未设置'} 个工作日</dd>
          </div>
        </div>

        {shippingOption?.description && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">{shippingOption.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderShipping;