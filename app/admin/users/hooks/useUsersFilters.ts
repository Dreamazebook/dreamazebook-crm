'use client';

import { useState } from 'react';

interface DateRange {
  start: string;
  end: string;
}

interface UserFilters {
  searchTerm: string;
  dateRange: DateRange;
  regionFilter: string;
  sourceFilter: string;
  satisfactionFilter: string;
  role: string;
}

export const useUsersFilters = () => {
  const [filters, setFilters] = useState<UserFilters>({
    searchTerm: '',
    dateRange: { start: '', end: '' },
    regionFilter: '',
    sourceFilter: '',
    satisfactionFilter: '',
    role: ''
  });

  const updateFilter = <K extends keyof UserFilters>(key: K, value: UserFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return {
    filters,
    setFilters,
    updateFilter
  };
};