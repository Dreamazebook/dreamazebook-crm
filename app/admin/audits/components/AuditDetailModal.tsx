'use client';

import { FC } from 'react';

interface AuditDetailModalProps {
  audit: any;
  onClose: () => void;
}

const AuditDetailModal: FC<AuditDetailModalProps> = ({ audit, onClose }) => {
  return (
    <div className="fixed inset-0 overflow-y-auto z-50 bg-black/60">
      <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">审核详情</h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">订单ID：</span>
                <span className="text-gray-900">{audit?.order_id}</span>
              </div>
              <div>
                <span className="text-gray-500">制作时长：</span>
                <span className="text-gray-900">{audit?.duration}</span>
              </div>
              <div>
                <span className="text-gray-500">书籍数量：</span>
                <span className="text-gray-900">{audit?.book_count}</span>
              </div>
              <div>
                <span className="text-gray-500">审核人：</span>
                <span className="text-gray-900">{audit?.auditor}</span>
              </div>
            </div>

            {/* Auditor Assignment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分配审核人：
              </label>
              <select className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">选择审核人</option>
                <option value="lucy">Lucy</option>
                <option value="admin">Admin</option>
                <option value="reviewer">Reviewer</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditDetailModal;