'use client';

import { FC } from 'react';

interface DateRange {
  start: string;
  end: string;
}

interface AuditsFiltersProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  bookNameFilter: string;
  setBookNameFilter: (name: string) => void;
  auditorFilter: string;
  setAuditorFilter: (auditor: string) => void;
  reviewStatusFilter: string;
  setReviewStatusFilter: (status: string) => void;
}

const AuditsFilters: FC<AuditsFiltersProps> = ({
  dateRange,
  setDateRange,
  bookNameFilter,
  setBookNameFilter,
  auditorFilter,
  setAuditorFilter,
  reviewStatusFilter,
  setReviewStatusFilter,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">时间：</label>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="开始日期"
            />
            <span className="text-gray-500 text-sm">至</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="结束日期"
            />
          </div>
        </div>

        {/* Book Name Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">书籍名称：</label>
          <select
            value={bookNameFilter}
            onChange={(e) => setBookNameFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Lucy</option>
            <option value="good-night">Good Night</option>
            <option value="birthday-book">Birthday Book</option>
            <option value="melody">Your Melody</option>
          </select>
        </div>

        {/* Review Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">审核状态：</label>
          <select
            value={reviewStatusFilter}
            onChange={(e) => setReviewStatusFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Lucy</option>
            <option value="pending">待开始</option>
            <option value="completed">已完成</option>
            <option value="rejected">已拒绝</option>
          </select>
        </div>

        {/* Auditor Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">审核人：</label>
          <select
            value={auditorFilter}
            onChange={(e) => setAuditorFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Lucy</option>
            <option value="lucy">Lucy</option>
            <option value="admin">Admin</option>
            <option value="reviewer">Reviewer</option>
          </select>
        </div>
      </div>

      {/* Search and Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            查询
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">
            搜索
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditsFilters;