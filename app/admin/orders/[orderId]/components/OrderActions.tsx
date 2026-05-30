'use client';

import { FC, useState } from 'react';
import { OrderDetail } from '@/types/order';

interface PdfFile {
  url: string;
  path: string;
  spu_id: number;
  item_id: number;
  preview_url: string;
  preview_path: string;
}

interface PdfResponse {
  status: string;
  completed_at: string | null;
  files: PdfFile[];
  email_send_log: any[];
}

interface OrderActionsProps {
  order: OrderDetail;
  onRefresh: () => void;
  handleGeneratePdf?: () => void;
  handleGetPdfUrls?: () => Promise<PdfResponse>;
  handleSendPreviewPdf?: () => void;
}

const OrderActions: FC<OrderActionsProps> = ({ order, onRefresh, handleGeneratePdf, handleGetPdfUrls, handleSendPreviewPdf }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfData, setPdfData] = useState<PdfResponse | null>(null);

  const handlePrintInvoice = () => {
    // Implement print invoice functionality
    window.print();
  };

  const handleSendEmail = async () => {
    setIsProcessing(true);
    try {
      // Implement send email functionality
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert('邮件发送成功');
    } catch (error) {
      alert('邮件发送失败');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefund = async () => {
    if (!confirm('确定要退款吗？此操作不可撤销。')) return;

    setIsProcessing(true);
    try {
      // Implement refund functionality
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert('退款处理成功');
      onRefresh();
    } catch (error) {
      alert('退款处理失败');
    } finally {
      setIsProcessing(false);
    }
  };

  const canRefund = order.payment_status === 'paid' && !['cancelled', 'refunded'].includes(order.status);
  const canCancel = !['completed', 'cancelled', 'refunded'].includes(order.status);

  const handleGetPdfUrlsClick = async () => {
    if (handleGetPdfUrls) {
      try {
        const data = await handleGetPdfUrls();
        setPdfData(data);
        setShowPdfModal(true);
      } catch (error) {
        console.error('Error fetching PDF URLs:', error);
        alert('获取PDF链接失败');
      }
    }
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
    setPdfData(null);
  };

  const openPdfInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">订单操作</h3>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onRefresh}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          刷新数据
        </button>

        <button
          onClick={handlePrintInvoice}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          打印发票
        </button>

        <button
          onClick={handleSendEmail}
          disabled={isProcessing}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {isProcessing ? '发送中...' : '发送邮件'}
        </button>

        {handleGeneratePdf && (
          <button
            onClick={handleGeneratePdf}
            disabled={!order.can_generate_pdf}
            className="inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 cursor-pointer border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            再次确认
          </button>
        )}

        {handleGetPdfUrls && (
          <button
            onClick={handleGetPdfUrlsClick}
            className="inline-flex items-center px-4 py-2 cursor-pointer border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            获取预览PDF链接
          </button>
        )}

        {handleSendPreviewPdf && (
          <button
            onClick={handleSendPreviewPdf}
            className="inline-flex items-center px-4 py-2 cursor-pointer border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            发送预览PDF
          </button>
        )}

        {canRefund && (
          <button
            onClick={handleRefund}
            disabled={isProcessing}
            className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
            </svg>
            {isProcessing ? '处理中...' : '申请退款'}
          </button>
        )}

        {canCancel && (
          <button
            onClick={() => {
              if (confirm('确定要取消此订单吗？')) {
                // Implement cancel order functionality
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            取消订单
          </button>
        )}
      </div>

      {/* PDF Links Modal */}
      {showPdfModal && pdfData && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">PDF文件列表</h3>
              <button
                onClick={closePdfModal}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-4 flex items-center space-x-2">
                <span className="text-sm text-gray-600">状态:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  pdfData.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {pdfData.status === 'completed' ? '已完成' : '处理中'}
                </span>
                {pdfData.completed_at && (
                  <span className="text-sm text-gray-500">
                    完成时间: {new Date(pdfData.completed_at).toLocaleString('zh-CN')}
                  </span>
                )}
              </div>

              {pdfData.files && pdfData.files.length > 0 ? (
                <div className="space-y-3">
                  {pdfData.files.map((file, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">
                            PDF #{index + 1}
                          </h4>
                          <div className="text-sm text-gray-500 space-y-1">
                            <div>Item ID: {file.item_id}</div>
                            <div>SPU ID: {file.spu_id}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openPdfInNewTab(file.url)}
                          className="inline-flex items-center px-3 py-1.5 border border-indigo-300 rounded-md text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          打开完整PDF
                        </button>

                        {file.preview_url && (
                          <button
                            onClick={() => openPdfInNewTab(file.preview_url)}
                            className="inline-flex items-center px-3 py-1.5 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            打开预览PDF
                          </button>
                        )}
                      </div>

                      <div className="mt-2 text-xs text-gray-400 break-all">
                        {file.path}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  暂无PDF文件
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={closePdfModal}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderActions;