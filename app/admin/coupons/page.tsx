'use client';

import { FC } from 'react';
import CouponsHeader from './components/CouponsHeader';
import CouponsTable from './components/CouponsTable';
import CouponsPagination from './components/CouponsPagination';
import { useCouponsData } from './hooks/useCouponsData';
import { useCouponsPagination } from './hooks/useCouponsPagination';
import LoadingState from '../orders/components/LoadingState';
import ErrorState from '../orders/components/ErrorState';

const AdminCouponsPage: FC = () => {
  const { coupons, loading, error, meta, fetchCoupons } = useCouponsData();
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
  } = useCouponsPagination();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCoupons(page);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="bg-gray-50 min-h-screen">
      <CouponsHeader totalCoupons={meta.total} />

      <div className="px-6 py-6">
        <CouponsTable coupons={coupons} />

        <CouponsPagination
          totalItems={meta.total}
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
      </div>
    </div>
  );
};

export default AdminCouponsPage;
