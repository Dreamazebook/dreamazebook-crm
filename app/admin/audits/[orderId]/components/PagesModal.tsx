'use client';

import { FC, useState } from 'react';
import DreamzeImage from '@/app/components/DreamzeImage';

interface PagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: any[];
  bookTitle: string;
}

const PagesModal: FC<PagesModalProps> = ({ isOpen, onClose, pages, bookTitle }) => {
  const [selectedPageIds, setSelectedPageIds] = useState<number[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  
  if (!isOpen) return null;

  const handleApprove = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmApprove = () => {
    // 这里添加实际审核通过逻辑
    console.log('审核通过:', selectedPageIds);
    setShowConfirmModal(false);
    onClose();
  };

  const handleRegenerate = () => {
    setShowRegenerateModal(true);
  };

  const handleConfirmRegenerate = () => {
    // 这里添加实际重新生成逻辑
    console.log('重新生成:', selectedPageIds);
    setShowRegenerateModal(false);
  };

  const handleCheckboxChange = (pageId: number) => {
    console.log('Checkbox clicked for pageId:', pageId);
    setSelectedPageIds(prev => {
      const newSelected = [...prev];
      const index = newSelected.indexOf(pageId);
      if (index === -1) {
        newSelected.push(pageId);
      } else {
        newSelected.splice(index, 1);
      }
      console.log('Updated selectedPageIds:', newSelected);
      return newSelected;
    });
  };

  return (
    <>
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="absolute inset-0 z-100 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">审核通过</h3>
            <p className="text-gray-600">
              确定要信息无误审核通过
            </p>
            <p className="text-gray-600 mb-6">
              审核人： 鱼鱼鱼
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 cursor-pointer border rounded-md hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleConfirmApprove}
                className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-md hover:bg-blue-700"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showRegenerateModal && (
        <div className="absolute inset-0 z-100 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">重新生成</h3>
            <p className="text-gray-600 mb-6">
              确定要重新生成选中的 {selectedPageIds.length} 个页面吗？
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowRegenerateModal(false)}
                className="px-4 py-2 cursor-pointer border rounded-md hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleConfirmRegenerate}
                className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-md hover:bg-blue-700"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow-xl w-full h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-medium text-gray-900">{bookTitle}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleRegenerate}
              className="px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
            >
              重新生成
            </button>
            <button 
              onClick={handleApprove}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              审核通过
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-full">
          <div className='flex justify-between mb-6'>
            <div className='flex items-center space-x-2'>
            {selectedPageIds.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">已选:</span>
                <div className="flex space-x-1">
                  {selectedPageIds.map((id, index) => (
                    <span key={index} className="text-sm">
                      {pages.find(p => p.page_id === id)?.page_number || id}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button className='text-blue-500 cursor-pointer' onClick={()=>{
              setSelectedPageIds(pages.map(p=>p.page_id))
            }}>全选</button>
            <button className='text-blue-500 cursor-pointer' onClick={()=>{
              setSelectedPageIds([])
            }}>取消</button>
            </div>
          </div>
          {/* Book Title */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">{bookTitle}</h3>
          </div>

          {/* Page Thumbnails */}
          <div className="grid gap-2 mb-6">
            {pages.map((page, index) => (
              <div key={index} className="relative w-full aspect-[960/487] flex items-center group">
                <DreamzeImage
                  src={page.result_image_url || page.image_url}
                  alt={`Page ${page.page_number}`}
                  cssClass=""
                />
                <div 
                  className={`absolute right-2 top-2 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPageIds.includes(page.page_id) ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'}`}
                  onClick={() => handleCheckboxChange(page.page_id)}
                >
                  {selectedPageIds.includes(page.page_id) && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
    </>
  );
};

export default PagesModal;