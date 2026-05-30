'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { API_ADMIN_ROLES, API_ADMIN_USERS } from '@/constants/api';
import { AdminUser, ApiResponse, Role } from '@/types/api';

interface User {
  id: string;
  name?: string;
  email: string;
  created_at: string;
  updated_at: string;
  region?: string;
  source?: string;
  satisfaction?: string;
  order_count?: number;
  total_spent?: number;
}

export const useUsersData = (filters:any) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [roles, setRoles] = useState<Role[]>([]);

  const getAdminUsersAPI = () => {
    const {role} = filters;
    let result = API_ADMIN_USERS+'?';
    if (role) {
      result += `role=${role}`;
    }
    return result
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get<ApiResponse>(getAdminUsersAPI());
        if (response.success && response.data) {
          setUsers(response.data?.data);
        } else {
          setError('Failed to fetch users');
        }

        const {success, data} = await api.get<ApiResponse>(API_ADMIN_ROLES);
        if (success && data) {
          setRoles(data?.data);
        }

      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filters]);

  return { users, loading, error, setUsers, roles };
};