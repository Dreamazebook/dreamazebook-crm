'use client';

import { OrderDetail } from '@/types/order';
import { createContext, useContext, ReactNode, useState } from 'react';

interface OrderDetailContextType {
  order: OrderDetail | null;
  fetchOrderDetail: (orderId: string|number) => void;
  handleManualConfirm: (itemId: string) => Promise<void>;
  isModalOpen: boolean;
  selectedItem: any;
  openModal: (item: any) => void;
  closeModal: () => void;
  handleGeneratePdf: () => void;
  handleGetPdfUrls: () => void;
  handleSendPreviewPdf: () => void;
}

const OrderDetailContext = createContext<OrderDetailContextType | undefined>(undefined);

interface OrderDetailProviderProps {
  children: ReactNode;
  order: OrderDetail | null;
  fetchOrderDetail: (orderId: string|number) => void;
  handleManualConfirm: (itemId: string) => Promise<void>;
  isModalOpen: boolean;
  selectedItem: any;
  openModal: (item: any) => void;
  closeModal: () => void;
  handleGeneratePdf: () => void;
  handleGetPdfUrls: () => void;
  handleSendPreviewPdf: () => void;
}
export const OrderDetailProvider = ({ 
  children, 
  order, 
  fetchOrderDetail,
  handleManualConfirm,
  isModalOpen,
  selectedItem,
  openModal,
  closeModal,
  handleGeneratePdf,
  handleGetPdfUrls,
  handleSendPreviewPdf,
}: OrderDetailProviderProps) => {
  return (
    <OrderDetailContext.Provider value={{ 
      order, 
      fetchOrderDetail,
      handleManualConfirm,
      isModalOpen,
      selectedItem,
      openModal,
      closeModal,
      handleGeneratePdf,
      handleGetPdfUrls,
      handleSendPreviewPdf,
    }}>
      {children}
    </OrderDetailContext.Provider>
  );
};

export const useOrderDetail = () => {
  const context = useContext(OrderDetailContext);
  if (context === undefined) {
    throw new Error('useOrderDetail must be used within an OrderDetailProvider');
  }
  return context;
};