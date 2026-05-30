'use client';

import { useState } from 'react';

export const useOrdersPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
  };
};