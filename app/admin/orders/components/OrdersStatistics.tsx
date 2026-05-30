'use client';

import { FC } from 'react';

interface OrdersStatisticsProps {
  totalOrders: number;
  growthPercentage: number;
}

const OrdersStatistics: FC<OrdersStatisticsProps> = ({ totalOrders, growthPercentage }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">订单笔数</h3>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">{totalOrders}</span>
          <span className="text-sm font-medium text-red-500 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {growthPercentage}%
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">订单笔数</h3>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">{totalOrders}</span>
          <span className="text-sm font-medium text-green-500 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            {growthPercentage}%
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">订单笔数</h3>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">{totalOrders}</span>
          <span className="text-sm font-medium text-green-500 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            {growthPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrdersStatistics;