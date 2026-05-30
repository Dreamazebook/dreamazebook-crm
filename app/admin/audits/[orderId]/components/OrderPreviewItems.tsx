'use client';

import { OrderPreviewItem } from '@/types/api';
import { FC, useState } from 'react';

type OrderPreviewItemsProps = {
  items: OrderPreviewItem[];
  previewId?: string | null;
  onApprove: (itemId: number) => void;
  onReject: (itemId: number, reason: string) => void;
};

import PagesModal from './PagesModal';

const OrderPreviewItems: FC<OrderPreviewItemsProps> = ({
  items,
  previewId,
  onApprove,
  onReject
}) => {
  const [rejectReason, setRejectReason] = useState<string>('');
  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<OrderPreviewItem | null>(null);
  const [isPagesModalOpen, setIsPagesModalOpen] = useState(false);

  // Auto-open modal if previewId matches an item
  useState(() => {
    if (previewId) {
      const matchedItem = items.find(item => item.item_id.toString() === previewId);
      if (matchedItem) {
        setSelectedItem(matchedItem);
        setIsPagesModalOpen(true);
      }
    }
  });

  const handleViewPages = (item: OrderPreviewItem) => {
    setSelectedItem(item);
    setIsPagesModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPagesModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">订单项 ({items.length})</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.item_id} className="px-6 py-4 cursor-pointer hover:bg-gray-50" onClick={() => handleViewPages(item)}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {item.pages[0]?.image_url && (
                        <img 
                          className="h-16 w-16 rounded-md object-cover" 
                          src={item.pages[0].image_url} 
                          alt={item.picbook.name} 
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.picbook.name}</h4>
                      <p className="text-sm text-gray-500">
                        角色: {item.character_info.full_name} ({item.character_info.language})
                      </p>
                      <p className="text-sm text-gray-500">
                        状态: {item.processing_info.status}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        点击查看 {item.pages.length} 页预览
                      </p>
                    </div>
                  </div>
                </div>
                
                {previewId && (
                  <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onApprove(item.item_id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      通过
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveItemId(item.item_id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      拒绝
                    </button>
                  </div>
                )}
              </div>
              
              {activeItemId === item.item_id && (
                <div className="mt-4 flex space-x-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="请输入拒绝原因"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onReject(item.item_id, rejectReason);
                      setRejectReason('');
                      setActiveItemId(null);
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    确认拒绝
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pages Modal */}
      {selectedItem && (
        <PagesModal
          isOpen={isPagesModalOpen}
          onClose={handleCloseModal}
          pages={selectedItem.pages}
          bookTitle={selectedItem.picbook.name}
        />
      )}
    </>
  );
};

export default OrderPreviewItems;