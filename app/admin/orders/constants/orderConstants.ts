export const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-purple-100 text-purple-800',
  ai_processing: 'bg-purple-100 text-purple-800',
  preparing: 'bg-blue-100 text-blue-800',
  printing: 'bg-orange-100 text-orange-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
};

export const paymentStatusColors: Record<string, string> = {
  paid: 'bg-green-100 text-green-800',
  unpaid: 'bg-red-100 text-red-800',
  refunded: 'bg-purple-100 text-purple-800',
  partial_refund: 'bg-yellow-100 text-yellow-800',
};

export const statusLabels: Record<string, string> = {
  pending: '未付款',
  processing: 'AI生成中',
  completed: '已完成',
  cancelled: '已取消',
  refunded: '已退款',
  ai_processing: 'AI生成中',
  ai_completed: 'AI完成',
  confirmed: '已确认',
  preparing: '人工审核中',
  printing: '印刷中',
  shipped: '运输中',
  delivered: '已完成',
};

export const paymentStatusLabels: Record<string, string> = {
  paid: '已支付',
  unpaid: '支付失败',
  refunded: '已退款',
  partial_refund: '部分退款',
};