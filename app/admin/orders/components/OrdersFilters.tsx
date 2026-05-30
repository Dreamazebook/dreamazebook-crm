'use client';

import { FC } from 'react';

interface DateRange {
  start: string;
  end: string;
}

interface OrdersFiltersProps {
  filters: {
    dateRange: DateRange;
    statusFilter: string;
    paymentStatus: string;
    discountFilter: string;
    regionFilter: string;
  };
  onFilterChange: {
    setDateRange: (range: DateRange) => void;
    setStatusFilter: (status: string) => void;
    setPaymentStatusFilter: (status: string) => void;
    setDiscountFilter: (filter: string) => void;
    setRegionFilter: (region: string) => void;
  };
}

const OrdersFilters: FC<OrdersFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      {/* Date Range */}
      <div className='w-full md:w-1/2 mb-4'>
        <label className="block text-sm font-medium text-gray-700 mb-2">下单时间：</label>
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => onFilterChange.setDateRange({ ...filters.dateRange, start: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="开始日期"
          />
          <span className="text-gray-500 text-sm">至</span>
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => onFilterChange.setDateRange({ ...filters.dateRange, end: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="结束日期"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
        {/* Order Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">订单状态：</label>
          <select
            value={filters.statusFilter}
            onChange={(e) => onFilterChange.setStatusFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">全部</option>
            <option value="pending">未付款</option>
            <option value="ai_processing">AI生成中</option>
            <option value="ai_completed">AI完成</option>
            <option value="preparing">人工审核中</option>
            <option value="printing">印刷中</option>
            <option value="shipped">运输中</option>
            <option value="delivered">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>

        {/* Payment Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">支付状态：</label>
          <select
            value={filters.paymentStatus}
            onChange={(e) => onFilterChange.setPaymentStatusFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">全部</option>
            <option value="paid">已支付</option>
            <option value="unpaid">支付失败</option>
            <option value="refunded">已退款</option>
            <option value="partial_refund">部分退款</option>
          </select>
        </div>

        {/* Amount Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">实付金额：</label>
          <select
            value={filters.discountFilter}
            onChange={(e) => onFilterChange.setDiscountFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">全部</option>
            <option value="0-50">$0-$50</option>
            <option value="50-100">$50-$100</option>
            <option value="100+">$100+</option>
          </select>
        </div>

        {/* Region Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">收货地区：</label>
          <select
            value={filters.regionFilter}
            onChange={(e) => onFilterChange.setRegionFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">全部</option>
            <option value="US">美国</option>
            <option value="CN">中国</option>
            <option value="CA">加拿大</option>
            <option value="UK">英国</option>
          </select>
        </div>

        {/* Discount Code Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">折扣码：</label>
          <select
            value={filters.discountFilter}
            onChange={(e) => onFilterChange.setDiscountFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">全部</option>
            <option value="SSJDUI">SSJDUI</option>
            <option value="DFGFXI">DFGFXI</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrdersFilters;