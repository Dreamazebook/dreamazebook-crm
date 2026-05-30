'use client';

import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import api from '@/utils/api';
import { API_ADMIN_LOGSTICS, API_ADMIN_LOGSTIC_COMFIRM, API_ADMIN_LOGSTIC_DETAIL_PRINT_LABEL, API_ADMIN_LOGSTIC_RESCHEDULE_PICKUP } from '@/constants/api';
import { ApiResponse } from '@/types/api';
import { LogisticsOrder } from '@/types/logistics';

const LogisticsPage: FC = () => {
  const [logisticsData, setLogisticsData] = useState<LogisticsOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingOrderId, setCreatingOrderId] = useState<number | null>(null);
  const [confirmingOrderId, setConfirmingOrderId] = useState<number | null>(null);
  const [printingLabelOrderId, setPrintingLabelOrderId] = useState<number | null>(null);
  const [printingBookletOrderId, setPrintingBookletOrderId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleCreate4PXOrder = async (orderId: number) => {
    setCreatingOrderId(orderId);
    try {
      const response = await api.post<ApiResponse<any>>(API_ADMIN_LOGSTIC_RESCHEDULE_PICKUP(orderId), {
        reserve_time: selectedDate
      });
      if (response.success) {
        // Refresh the logistics data to update the status
        const { data, success } = await api.get<ApiResponse<LogisticsOrder[]>>(API_ADMIN_LOGSTICS);
        if (success && data) {
          setLogisticsData(data);
        }
      } else {
        setError((response as any).message || 'Failed to reschedule pickup');
      }
    } catch (err:any) {
      console.error('Error rescheduling pickup:', err);
      setError(err?.response?.data?.message || 'Failed to reschedule pickup');
    } finally {
      setCreatingOrderId(null);
    }
  };

  const handleConfirmOrder = async (orderId: number) => {
    setConfirmingOrderId(orderId);
    try {
      const response = await api.post<ApiResponse<any>>(API_ADMIN_LOGSTIC_COMFIRM, {order_ids:[orderId]});
      if (response.success) {
        // Refresh the logistics data to update the status
        const { data, success } = await api.get<ApiResponse<LogisticsOrder[]>>(API_ADMIN_LOGSTICS);
        if (success && data) {
          setLogisticsData(data);
        }
      } else {
        setError((response as any).message || 'Failed to confirm order');
      }
    } catch (err) {
      console.error('Error confirming order:', err);
      setError('Failed to confirm order');
    } finally {
      setConfirmingOrderId(null);
    }
  };

  const handlePrintLabel = async (orderId: number) => {
    setPrintingLabelOrderId(orderId);
    try {
      const response = await api.get<ApiResponse>(API_ADMIN_LOGSTIC_DETAIL_PRINT_LABEL(orderId));
      if (response.success && response.data) {
        // Open the label URL in a new window
        const labelUrl = response.data.label_url;
        if (labelUrl) {
          window.open(labelUrl, '_blank');
        }
      } else {
        setError(response.data?.message || 'Failed to print label');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to print label');
    } finally {
      setPrintingLabelOrderId(null);
    }
  };

  const handlePrintBooklet = async (orderId: number, order: LogisticsOrder) => {
    setPrintingBookletOrderId(orderId);
    try {
      // Get the PDF URL from print_data if available
      const pdfUrl = order.print_data?.print_pdf?.files?.[0]?.url;
      if (pdfUrl) {
        // Open the PDF directly
        window.open(pdfUrl, '_blank');
        setPrintingBookletOrderId(null);
      } else {
        setPrintingBookletOrderId(null);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to print booklet');
      setPrintingBookletOrderId(null);
    }
  };

  const fetchLogisticsData = async () => {
    try {
      const { data, success, message } = await api.get<ApiResponse<LogisticsOrder[]>>(API_ADMIN_LOGSTICS);
      if (success && data) {
        setLogisticsData(data);
      } else {
        setError(message || 'Failed to fetch logistics data');
      }
    } catch (err) {
      console.error('Error fetching logistics data:', err);
      setError('Failed to load logistics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogisticsData();
  }, []);

  return (
    <>
      <Head>
        <title>Logistics Management - Admin</title>
        <meta name="description" content="Manage logistics orders, create 4PX shipments, confirm orders, and print shipping labels" />
      </Head>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">物流管理</h1>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {loading ? (
          <div className="bg-white p-4 rounded border border-gray-200">
            <p className="text-gray-500 text-center py-8">正在加载物流数据...</p>
          </div>
        ) : logisticsData.length === 0 ? (
          <div className="bg-white p-4 rounded border border-gray-200">
            <p className="text-gray-500 text-center py-8">暂无物流数据。</p>
          </div>
        ) : (
          <div className="bg-white rounded border border-gray-200 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    订单号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    物流操作
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logisticsData.map((item) => {
                  const {
                    id,
                    order_number,
                    status,
                    logistics_status,
                    logistics_request_no,
                    has_logistics,
                    created_at
                  } = item;

                  const isConfirmed = status === 'confirmed' || status === 'completed';
                  const hasLogisticsRequest = !!logistics_request_no;
                  const isConfirming = confirmingOrderId === id;
                  const isCreating = creatingOrderId === id;
                  const isPrintingLabel = printingLabelOrderId === id;
                  const isPrintingBooklet = printingBookletOrderId === id;

                  const statusBadgeColor = 
                    status === 'completed' ? 'bg-green-100 text-green-800' :
                    status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800';

                  return (
                    <tr key={id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span>{order_number}</span>
                            {!isConfirmed && (
                              <button
                                onClick={() => handleConfirmOrder(id)}
                                disabled={isConfirming || hasLogisticsRequest}
                                className="px-3 cursor-pointer py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors"
                              >
                                {isConfirming ? '确认中...' : !has_logistics ? '确认订单' : '已确认'}
                              </button>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(created_at).toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePrintBooklet(id, item)}
                            disabled={item.print_data?.print_pdf?.files?.length == 0 || isPrintingBooklet}
                            className="cursor-pointer px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition-colors"
                          >
                            {isPrintingBooklet ? '打印中...' : '打印绘本'}
                          </button>
                          <button
                            onClick={() => handlePrintLabel(id)}
                            disabled={isPrintingLabel || !logistics_request_no}
                            className="cursor-pointer px-3 py-1 bg-orange-600 text-white text-xs font-medium rounded hover:bg-orange-700 disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors"
                          >
                            {isPrintingLabel ? '打印中...' : '打印面单'}
                          </button>
                          {logistics_request_no && (
                            <div className="flex flex-col gap-2">
                              {item.pickup_reserve_time && (
                                <div className="text-xs text-blue-600">
                                  当前揽件时间: {new Date(item.pickup_reserve_time).toLocaleString()}
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <input
                                  type="date"
                                  value={selectedDate}
                                  onChange={(e) => setSelectedDate(e.target.value)}
                                  className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  disabled={isCreating}
                                />
                                <button
                                  onClick={() => selectedDate && handleCreate4PXOrder(id)}
                                  disabled={isCreating || !selectedDate}
                                  className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                                >
                                  {isCreating ? '设置中...' : '重新安排'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div>
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${statusBadgeColor}`}>
                              {status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">
                            {logistics_status || '未创建'}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
    </div>
    </>
  );
};

export default LogisticsPage;