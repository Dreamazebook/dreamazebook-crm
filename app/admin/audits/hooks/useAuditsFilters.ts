'use client';

import { useState } from 'react';

interface DateRange {
  start: string;
  end: string;
}

export const useAuditsFilters = () => {
  const [dateRange, setDateRange] = useState<DateRange>({ start: '', end: '' });
  const [bookNameFilter, setBookNameFilter] = useState('');
  const [auditorFilter, setAuditorFilter] = useState('');
  const [reviewStatusFilter, setReviewStatusFilter] = useState('');

  return {
    dateRange,
    setDateRange,
    bookNameFilter,
    setBookNameFilter,
    auditorFilter,
    setAuditorFilter,
    reviewStatusFilter,
    setReviewStatusFilter,
  };
};