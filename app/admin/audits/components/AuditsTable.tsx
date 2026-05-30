'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import React from 'react';
import { OrderDetail } from '@/types/order';
import Link from 'next/link';

interface AuditsTableProps {
  audits: OrderDetail[];
  setSelectedAudit: Function;
}

const AuditsTable: FC<AuditsTableProps> = ({ audits, setSelectedAudit }) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRowExpansion = (auditId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(auditId)) {
      newExpanded.delete(auditId);
    } else {
      newExpanded.add(auditId);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return '待开始';
      case 'completed': return '已完成';
      case 'rejected': return '已拒绝';
      default: return '未知';
    }
  };

  if (audits.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到审核记录</h3>
          <p className="mt-1 text-sm text-gray-500">
            没有找到符合条件的审核记录
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                展开
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                订单 ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                制作时长
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                书籍数量
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                审核人
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {audits.map((audit) => (
              <React.Fragment key={audit.id}>
                {/* Main Row */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleRowExpansion(audit.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg 
                        className={`w-4 h-4 transition-transform ${expandedRows.has(audit.id) ? 'rotate-90' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {audit.order_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {audit.items?.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedAudit(audit)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      修改审核人
                    </button>
                  </td>
                </tr>

                {/* Expanded Row */}
                {expandedRows.has(audit.id) && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-3">
                        <div className="grid grid-cols-4 gap-4 text-xs text-gray-600 mb-2">
                          <span>书籍名称</span>
                          <span>预览图</span>
                          <span>审核状态</span>
                          <span>操作</span>
                        </div>
                        
                        {audit.items.map((book) => (
                          <div key={book.id} className="grid grid-cols-4 gap-4 items-center py-2 text-sm">
                            <span className="text-gray-900">{book.product_name}</span>
                            <div className="w-12 h-16 bg-blue-100 rounded flex items-center justify-center overflow-hidden">
                              <Image 
                                src={book.product_image || '/placeholder-book.png'} 
                                alt={book.product_name}
                                width={48}
                                height={64}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            </div>
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(book.status)}`}>
                              
                            </span>
                            <Link href={`/admin/audits/${audit.id}?previewId=${book.id}`} className="text-blue-600 hover:text-blue-900 text-xs">
                              去审核
                            </Link>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditsTable;