'use client';

import { FC } from 'react';
import { OrderDetail } from '@/types/order';
import { formatCurrency, formatDate } from '../../utils';

interface OrderPaymentProps {
  order: OrderDetail;
}

const OrderPayment: FC<OrderPaymentProps> = ({ order }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Payment Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">支付信息</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">支付方式</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">
                {order.payment_method || '未设置'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">支付ID</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono break-all">
                {order.payment_id || '未设置'}
              </dd>
            </div>
          </div>

          {order.stripe_payment_intent_id && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Stripe Payment Intent</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono break-all">
                {order.stripe_payment_intent_id}
              </dd>
            </div>
          )}

          {order.paid_at && (
            <div>
              <dt className="text-sm font-medium text-gray-500">支付时间</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(order.paid_at)}</dd>
            </div>
          )}
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">费用明细</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-600">商品小计</span>
            <span className='text-sm text-gray-900'>${order.total_amount - order.shipping_cost - order.tax_amount + order.discount_amount}</span>
          </div>
          
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-600">配送费用</span>
            <span className='text-sm text-gray-900'>${order.shipping_cost}</span>
          </div>
          
          {order.tax_amount > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600">税费</span>
              <span className='text-sm text-gray-900'>${order.tax_amount}</span>
            </div>
          )}
          
          {order.discount_amount > 0 && (
            <div className="flex justify-between py-2 text-green-600">
              <span className="text-sm">折扣金额</span>
              <span className='text-sm text-green-600'>${order.discount_amount}</span>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between">
              <span className="text-base font-medium text-gray-900">总金额</span>
              <span className='text-base font-medium text-gray-900'>${order.total_amount}</span>
            </div>
          </div>
        </div>

        {order.coupon_code && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-green-800">
                使用优惠券：<span className="font-medium">{order.coupon_code}</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPayment;