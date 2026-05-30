'use client';

import { FC } from 'react';
import { OrderDetail, getShippingOptions } from '@/types/order';
import { formatDate, formatCurrency } from '../../utils';
import { formatAddress } from '@/types/address';

interface OrderOverviewProps {
  order: OrderDetail;
}

const OrderOverview: FC<OrderOverviewProps> = ({ order }) => {
  const shippingOptions = getShippingOptions(order.shipping_options);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Order Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">订单摘要</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">商品数量</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">{order.items?.length || 0}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">订单总额</dt>
              <span className='mt-1 text-2xl font-semibold text-gray-900'>${order.total_amount}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">商品小计</span>
                <span className='text-sm text-gray-900'>${order.total_amount - order.shipping_cost - order.tax_amount + order.discount_amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">配送费用</span>
                <span className='text-sm text-gray-900'>${order.shipping_cost}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="text-sm">折扣</span>
                  <span className='text-sm text-green-600'>${order.discount_amount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">快速信息</h3>
        
        <div className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">客户</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {order.user?.name || order.user?.email || '未知客户'}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">收货地址</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {order.shipping_address ? (
                <div>
                  <p className="font-medium">
                    {order.shipping_address.first_name} {order.shipping_address.last_name}
                  </p>
                  <p className="text-gray-600">{formatAddress(order.shipping_address)}</p>
                </div>
              ) : (
                '未设置'
              )}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">配送方式</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {shippingOptions.find(opt => opt.code === order.shipping_method)?.name || order.shipping_method || '未设置'}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">支付方式</dt>
            <dd className="mt-1 text-sm text-gray-900 capitalize">
              {order.payment_method || '未设置'}
            </dd>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">最近活动</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">订单状态更新为：{order.status}</p>
              <p className="text-xs text-gray-500">{formatDate(order.updated_at)}</p>
            </div>
          </div>
          
          {order.paid_at && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">支付完成</p>
                <p className="text-xs text-gray-500">{formatDate(order.paid_at)}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">订单创建</p>
              <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderOverview;