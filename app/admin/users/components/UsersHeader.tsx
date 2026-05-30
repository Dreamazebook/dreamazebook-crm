'use client';

import { FC } from 'react';

interface UsersHeaderProps {
  totalUsers: number;
  lastUpdated: string;
}

const UsersHeader: FC<UsersHeaderProps> = ({ totalUsers, lastUpdated }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="flex items-center text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-medium text-gray-900">用户管理</h1>
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <span>共{totalUsers}条</span>
            <span>数据更新：{lastUpdated}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            导出
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            营销
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersHeader;