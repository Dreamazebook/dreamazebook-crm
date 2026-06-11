'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';

interface CouponsHeaderProps {
  totalCoupons: number;
}

const CouponsHeader: FC<CouponsHeaderProps> = ({ totalCoupons }) => {
  const router = useRouter();

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-medium text-gray-900">Coupons</h1>
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <span>Total {totalCoupons}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push('/admin/coupons/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            + New Coupon
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponsHeader;
