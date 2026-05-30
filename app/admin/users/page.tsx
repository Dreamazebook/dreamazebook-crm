'use client';

import { FC, useState } from 'react';
import UsersHeader from './components/UsersHeader';
import UsersFilters from './components/UsersFilters';
import UsersTable from './components/UsersTable';
import UsersPagination from './components/UsersPagination';
import { useUsersData } from './hooks/useUsersData';
import { useUsersFilters } from './hooks/useUsersFilters';
import { useUsersPagination } from './hooks/useUsersPagination';
import LoadingState from '../orders/components/LoadingState';
import ErrorState from '../orders/components/ErrorState';
import UserDetailModal from './components/UserDetailModal';

const AdminUsersPage: FC = () => {
  const { filters, updateFilter } = useUsersFilters();
  const { users, loading, error, roles } = useUsersData(filters);
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
  } = useUsersPagination();

  const totalUsers = 2;
  const lastUpdated = '2025/03/12 12:34';

  const [selectedUser, setSelectedUser] = useState(null);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="bg-gray-50 min-h-screen">

      {selectedUser && <UserDetailModal roles={roles} user={selectedUser} onClose={() => setSelectedUser(null)} />}

      <UsersHeader totalUsers={totalUsers} lastUpdated={lastUpdated} />

      <div className="px-6 py-6">
        <UsersFilters
          filters={filters}
          updateFilter={updateFilter}
          roles={roles}
        />
        
        <UsersTable users={users} searchTerm={filters.searchTerm} setSelectedUser={setSelectedUser} />
        
        <UsersPagination
          totalUsers={users.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
      </div>
    </div>
  );
};

export default AdminUsersPage;