'use client';

import { FC, useEffect, useState } from 'react';
import { OrderDetail } from '@/types/order';
import OrderDetailsModal from './components/OrderDetailsModal';
import OrdersHeader from './components/OrdersHeader';
import OrdersStatistics from './components/OrdersStatistics';
import OrdersFilters from './components/OrdersFilters';
import OrdersTable from './components/OrdersTable';
import OrdersPagination from './components/OrdersPagination';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import { useOrdersData } from './hooks/useOrdersData';
import { useOrdersFilters } from './hooks/useOrdersFilters';
import { useOrdersPagination } from './hooks/useOrdersPagination';
import {
  statusColors,
  paymentStatusColors,
  statusLabels,
  paymentStatusLabels,
} from './constants/orderConstants';

const AdminOrdersPage: FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    filters,
    onFilterChange
  } = useOrdersFilters();

  const { orders, loading, error } = useOrdersData(filters);

  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
  } = useOrdersPagination();
  
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleViewDetails = (order: OrderDetail) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const totalOrders = orders.length;
  const growthPercentage = 12;
  const lastUpdated = new Date().toLocaleString();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="bg-gray-50 min-h-screen">
      <OrdersHeader totalOrders={orders.length} lastUpdated={lastUpdated} />

      <div className="px-6 py-6">
        <OrdersStatistics totalOrders={totalOrders} growthPercentage={growthPercentage} />
        
        <OrdersFilters
          filters={filters}
          onFilterChange={onFilterChange}
        />
        
        <OrdersTable
          orders={orders}
          statusColors={statusColors}
          paymentStatusColors={paymentStatusColors}
          statusLabels={statusLabels}
          paymentStatusLabels={paymentStatusLabels}
          onViewDetails={handleViewDetails}
        />
        
        <OrdersPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalItems={orders.length}
        />
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal 
          orderDetail={selectedOrder} 
          onClose={() => setShowDetailsModal(false)} 
          statusColors={statusColors} 
          paymentStatusColors={paymentStatusColors} 
          statusLabels={statusLabels} 
          paymentStatusLabels={paymentStatusLabels} 
        />
      )}
    </div>
  );
};

export default AdminOrdersPage;