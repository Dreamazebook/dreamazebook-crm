'use client';

import { FC } from 'react';
import Image from 'next/image';
import { OrderDetail } from '@/types/order';
import { formatCurrency } from '../../utils';
import ResultImagesModal from './ResultImagesModal';
import { useOrderDetail } from '../context/OrderDetailContext';

interface OrderItemsProps {
  order: OrderDetail;
}

const OrderItems: FC<OrderItemsProps> = ({ order }) => {
  const { isModalOpen, selectedItem, openModal, closeModal } = useOrderDetail();

  const handleViewImages = (item: any) => {
    openModal(item);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">订单商品</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {order.items?.map((item) => (
          <div key={item.id} className="p-6 cursor-pointer hover:bg-gray-50" onClick={() => handleViewImages(item)}>
            <div className="flex items-start space-x-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.product_image || '/placeholder-book.png'}
                    alt={item.sku_code || 'Product Image'}
                    width={80}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-gray-900 mb-1">
                      {item.product_name}
                    </h4>

                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <span className="font-medium mr-2">数量:</span>
                      <span>{item.quantity}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <span className="font-medium mr-2">状态:</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {item.status || '未设置'}
                      </span>
                    </div>

                    {item.message && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">客户留言:</span>
                        <p className="text-sm text-gray-600 mt-1">{item.message}</p>
                      </div>
                    )}

                    {item.result_images && item.result_images.length > 0 && (
                      <div className="mt-3">
                        <span className="text-sm font-medium text-blue-600">
                          点击查看 {item.result_images.length} 张结果图片
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="text-right ml-4">
                    <div className="text-sm text-gray-500 mb-1">单价</div>
                    <span className='text-sm font-medium text-gray-900 mb-2'>${item.unit_price}</span>
                    <div className="text-sm text-gray-500 mb-1">小计</div>
                    <span className='text-sm font-medium text-gray-900 mb-2'>${item.total_price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Total */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-base font-medium text-gray-900">
            商品总计 ({order.items?.length || 0} 件)
          </span>
          <span className='text-lg font-semibold text-gray-900'>${order.total_amount}</span>
        </div>
      </div>
      </div>

      {/* Result Images Modal */}
      <ResultImagesModal
        isOpen={isModalOpen}
        onClose={closeModal}
        orderId={order.id}
      />
    </>
  );
};

export default OrderItems;