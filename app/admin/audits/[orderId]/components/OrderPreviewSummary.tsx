'use client';

import { FC } from 'react';
import { OrderPreviewResponse } from '@/types/api';

interface OrderPreviewSummaryProps {
  orderPreview: OrderPreviewResponse;
}

const OrderPreviewSummary: FC<OrderPreviewSummaryProps> = ({ orderPreview }) => {
  const { summary } = orderPreview;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">订单摘要</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {summary.total_items}
          </div>
          <div className="text-sm text-gray-500">总商品数</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {summary.items_with_generated_files}
          </div>
          <div className="text-sm text-gray-500">已生成文件</div>
        </div>

        <div className="text-center">
          <div className={`text-2xl font-bold mb-1 ${
            summary.all_files_generated ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {summary.all_files_generated ? '是' : '否'}
          </div>
          <div className="text-sm text-gray-500">全部文件已生成</div>
        </div>

        <div className="text-center">
          <div className={`text-2xl font-bold mb-1 ${
            summary.can_generate_pdf ? 'text-green-600' : 'text-gray-400'
          }`}>
            {summary.can_generate_pdf ? '可以' : '不可以'}
          </div>
          <div className="text-sm text-gray-500">生成PDF</div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mt-6 flex flex-wrap gap-3">
        <div className={`px-3 py-2 rounded-full text-sm font-medium ${
          summary.can_preview ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {summary.can_preview ? '✓ 可预览' : '✗ 不可预览'}
        </div>
        
        <div className={`px-3 py-2 rounded-full text-sm font-medium ${
          summary.can_generate_pdf ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {summary.can_generate_pdf ? '✓ 可生成PDF' : '✗ 不可生成PDF'}
        </div>

        <div className={`px-3 py-2 rounded-full text-sm font-medium ${
          summary.all_files_generated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {summary.all_files_generated ? '✓ 文件完整' : '⚠ 文件未完整'}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>整体完成进度</span>
          <span>{Math.round((summary.items_with_generated_files / summary.total_items) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(summary.items_with_generated_files / summary.total_items) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderPreviewSummary;