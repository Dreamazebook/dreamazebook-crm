'use client';

import { Role } from '@/types/api';
import { FC } from 'react';

interface DateRange {
  start: string;
  end: string;
}

interface UserFilters {
  searchTerm: string;
  dateRange: DateRange;
  regionFilter: string;
  sourceFilter: string;
  satisfactionFilter: string;
  role: string;
}

interface UsersFiltersProps {
  filters: UserFilters;
  updateFilter: <K extends keyof UserFilters>(key: K, value: UserFilters[K]) => void;
  roles: Role[];
}

const UsersFilters: FC<UsersFiltersProps> = ({
  filters,
  updateFilter,
  roles
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">日期：</label>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="开始日期"
            />
            <span className="text-gray-500">至</span>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, end: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="结束日期"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">地区：</label>
          <select
            value={filters.regionFilter}
            onChange={(e) => updateFilter('regionFilter', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All</option>
            <option value="中国·四川">中国·四川</option>
            <option value="美国·加州">美国·加州</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">注册来源：</label>
          <select
            value={filters.sourceFilter}
            onChange={(e) => updateFilter('sourceFilter', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All</option>
            <option value="ins">ins</option>
            <option value="Facebook">Facebook</option>
            <option value="Google">Google</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">满意度：</label>
          <select
            value={filters.satisfactionFilter}
            onChange={(e) => updateFilter('satisfactionFilter', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All</option>
            <option value="满意">满意</option>
            <option value="不满意">不满意</option>
          </select>
        </div> */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">角色：</label>
          <select
            value={filters.role}
            onChange={(e) => updateFilter('role', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All</option>
            {roles.map(role => (
              <option key={role.id} value={role.name}>{role.name}</option>
            ))}
          </select>
        </div>
      </div>

    </div>
  );
};

export default UsersFilters;