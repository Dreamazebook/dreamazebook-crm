'use client';

import { FC, useState } from 'react';
import AuditsHeader from './components/AuditsHeader';
import AuditsStatistics from './components/AuditsStatistics';
import AuditsFilters from './components/AuditsFilters';
import AuditsTable from './components/AuditsTable';
import AuditsPagination from './components/AuditsPagination';
import { useAuditsData } from './hooks/useAuditsData';
import { useAuditsFilters } from './hooks/useAuditsFilters';
import { useAuditsPagination } from './hooks/useAuditsPagination';
import LoadingState from '../orders/components/LoadingState';
import ErrorState from '../orders/components/ErrorState';
import AuditDetailModal from './components/AuditDetailModal';

const AdminAuditsPage: FC = () => {
  const { audits, loading, error } = useAuditsData();
  const {
    dateRange,
    setDateRange,
    bookNameFilter,
    setBookNameFilter,
    auditorFilter,
    setAuditorFilter,
    reviewStatusFilter,
    setReviewStatusFilter,
  } = useAuditsFilters();
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
  } = useAuditsPagination();

  const [selectedAudit, setSelectedAudit] = useState(null);

  const totalAudits = 312;
  const passRate = 61;
  const modelUsage = { a: 75, b: 25 };
  const growthPercentage = 12;
  const lastUpdated = '2025/03/12 12:34';

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="bg-gray-50 min-h-screen">
      {selectedAudit && (
        <AuditDetailModal 
          audit={selectedAudit} 
          onClose={() => setSelectedAudit(null)} 
        />
      )}

      <AuditsHeader lastUpdated={lastUpdated} />

      <div className="px-6 py-6">
        <AuditsStatistics 
          totalAudits={totalAudits}
          passRate={passRate}
          modelUsage={modelUsage}
          growthPercentage={growthPercentage}
        />
        
        <AuditsFilters
          dateRange={dateRange}
          setDateRange={setDateRange}
          bookNameFilter={bookNameFilter}
          setBookNameFilter={setBookNameFilter}
          auditorFilter={auditorFilter}
          setAuditorFilter={setAuditorFilter}
          reviewStatusFilter={reviewStatusFilter}
          setReviewStatusFilter={setReviewStatusFilter}
        />
        
        <AuditsTable 
          audits={audits} 
          setSelectedAudit={setSelectedAudit} 
        />
        
        <AuditsPagination
          totalAudits={audits.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
      </div>
    </div>
  );
};

export default AdminAuditsPage;