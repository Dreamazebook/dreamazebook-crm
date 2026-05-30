'use client';

import { FC, useEffect, useState } from 'react';
import { formatDate } from '../../orders/utils';
import api from '@/utils/api';
import { API_ADMIN_ASSIGN_USER_ROLES, API_ADMIN_USERS } from '@/constants/api';
import { AdminUser, ApiResponse, Role } from '@/types/api';

interface UserDetailModalProps {
  user: AdminUser;
  roles: Role[]
  onClose: () => void;
}

const UserDetailModal: FC<UserDetailModalProps> = ({ user, roles, onClose }) => {

  const [userDetail, setUserDetail] = useState<AdminUser|null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(user.roles || []);

  useEffect(() => {
    const fetchUserDetail = async () => {
      const {data, success} = await api.get<ApiResponse<AdminUser>>(`${API_ADMIN_USERS}/${user.id}`);
      if (success && data) {
        setUserDetail(data);
      }
    };
    fetchUserDetail();
  }, [user.id]);
  // Mock data for demonstration - in real app this would come from API
  const mockUserData = {
    ...user,
    phone: '238483484@23.com',
    address: {
      street: 'Wuhou District, Chengdu City, Sichuan Province, China',
      city: 'Chengdu',
      state: 'Sichuan',
      country: 'China',
      postal_code: '610000'
    },
    registration_ip: '11.234.23',
    last_login: '2023/23/12 12:23',
    login_device: 'XNXJSJSUAJSNSADS',
    orders: [
      {
        id: '1',
        order_number: '2323444433',
        status: '已完成',
        total_amount: 2334,
        created_at: '2023/23/12 12:23',
        items: [
          {
            name: 'Good Night',
            image: '/imgs/picbook/goodnight/封面1.jpg',
            quantity: 1,
            price: 24,
            total: 24
          }
        ],
        shipping_cost: 12
      }
    ]
  };

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleRoleToggle = (role: Role) => {
    setSelectedRoles(prev => 
      prev.some(r => r.id === role.id) 
        ? prev.filter(r => r.id !== role.id) 
        : [...prev, role]
    );
  };

  const handleSaveRoles = async () => {
    try {
      const { success } = await api.post<ApiResponse>(`${API_ADMIN_ASSIGN_USER_ROLES(user.id)}`, { roles: selectedRoles });
      if (success) {
        // Optional: Show success message or refresh data
      }
    } catch (error) {
      console.error('Error saving roles:', error);
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto z-50 bg-black/60">
      <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">用户详情</h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Basic Information Section */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-1 h-5 bg-blue-500 mr-3"></div>
                <h3 className="text-lg font-medium text-gray-900">基础信息</h3>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xl font-medium text-gray-600">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">用户名：</span>
                    <span className="text-sm text-gray-900">{userDetail?.name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">ID：</span>
                    <span className="text-sm text-gray-900">{userDetail?.id || 'N/A'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-gray-500">邮箱：</span>
                    <span className="text-sm text-gray-900">{userDetail?.email || 'N/A'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-gray-500">地区：</span>
                    
                  </div>
                </div>
              </div>
            </div>

            {/* More Information Section */}
            <div>
              <div className="flex items-center mb-4">
                <button className="flex items-center text-gray-700 hover:text-gray-900">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="text-lg font-medium">更多信息</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">注册时间：</span>
                  <span className="text-gray-900">{formatDate(userDetail?.created_at || '')}</span>
                </div>
                <div>
                  <span className="text-gray-500">注册来源：</span>
                  <span className="text-gray-900">{userDetail?.last_login_ip || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500">最后登录时间：</span>
                  <span className="text-gray-900">{formatDate(userDetail?.last_login_at || '')}</span>
                </div>
                <div>
                  <span className="text-gray-500">登录设备：</span>
                  <span className="text-gray-900">{userDetail?.last_login_ip || 'N/A'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">最后登录IP地址：</span>
                  <span className="text-gray-900">{userDetail?.last_login_ip || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Roles Information Section */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-1 h-5 bg-blue-500 mr-3"></div>
                <h3 className="text-lg font-medium text-gray-900">角色信息</h3>
              </div>
              <div className="space-y-2">
                {roles?.length ? (
                  roles.map((role) => (
                    <div key={role.id} className="p-3 bg-gray-50 rounded-md flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedRoles.some(r => r.id === role.id)}
                            onChange={() => handleRoleToggle(role)}
                            className="mr-2"
                          />
                          <span className="font-medium">{role.name}</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{role.guard_name}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">暂无角色信息</span>
                )}
                <button
                  onClick={handleSaveRoles}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  保存角色分配
                </button>
              </div>
            </div>

            {/* Address Information Section */}
            <div>
              <div className="flex items-center mb-4">
                <button className="flex items-center text-gray-700 hover:text-gray-900">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="text-lg font-medium">常用收货地址</span>
                </button>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">地址：</span>
                <span className="text-gray-900">
                  
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">收件人：</span>
                      <span className="text-gray-900">Augustine</span>
                    </div>
                    <div>
                      <span className="text-gray-500">邮箱：</span>
                      <span className="text-gray-900">{mockUserData.phone}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">地址：</span>
                      <span className="text-gray-900">{mockUserData.address?.street}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">收件人：</span>
                      <span className="text-gray-900">Augustine</span>
                    </div>
                    <div>
                      <span className="text-gray-500">邮箱：</span>
                      <span className="text-gray-900">{mockUserData.phone}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">地址：</span>
                      <span className="text-gray-900">{mockUserData.address?.street}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Records Section */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-1 h-5 bg-blue-500 mr-3"></div>
                <h3 className="text-lg font-medium text-gray-900">购买记录</h3>
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                共 12 笔订单，累计消费金额 2344 元
              </div>

              {/* Orders Table Header */}
              <div className="bg-gray-50 px-4 py-2 rounded-t-lg">
                <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
                  <span>展开</span>
                  <span>订单ID</span>
                  <span>订单状态</span>
                  <span>下单时间</span>
                  <span>应付金额</span>
                  <span>操作</span>
                </div>
              </div>

              {/* Orders List */}
              <div className="border border-t-0 border-gray-200 rounded-b-lg">
                {mockUserData.orders?.map((order) => (
                  <div key={order.id} className="border-b border-gray-200 last:border-b-0">
                    {/* Order Summary Row */}
                    <div className="px-4 py-3">
                      <div className="grid grid-cols-6 gap-4 items-center text-sm">
                        <button
                          onClick={() => toggleOrderExpansion(order.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg 
                            className={`w-4 h-4 transition-transform ${expandedOrder === order.id ? 'rotate-90' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <span className="text-gray-900">{order.order_number}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {order.status}
                        </span>
                        <span className="text-gray-600">{order.created_at}</span>
                        <span className="text-gray-900 font-medium">$ {order.total_amount}</span>
                        <button className="text-blue-600 hover:text-blue-800 text-xs">
                          详情
                        </button>
                      </div>
                    </div>

                    {/* Expanded Order Details */}
                    {expandedOrder === order.id && (
                      <div className="px-4 pb-4 bg-gray-50">
                        <div className="grid grid-cols-5 gap-4 text-xs text-gray-600 mb-2">
                          <span>商品名</span>
                          <span>图片</span>
                          <span>数量</span>
                          <span>原价</span>
                          <span>实付</span>
                        </div>
                        
                        {order.items.map((item, index) => (
                          <div key={index} className="grid grid-cols-5 gap-4 items-center py-2 text-sm">
                            <span className="text-gray-900">{item.name}</span>
                            <div className="w-8 h-10 bg-blue-100 rounded flex items-center justify-center">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <span className="text-gray-600">{item.quantity}</span>
                            <span className="text-gray-600">$ {item.price}</span>
                            <span className="text-gray-900">$ {item.total}</span>
                          </div>
                        ))}
                        
                        {/* Shipping Cost */}
                        <div className="grid grid-cols-5 gap-4 items-center py-2 text-sm border-t border-gray-200 mt-2 pt-2">
                          <span className="text-gray-600">运费</span>
                          <span></span>
                          <span></span>
                          <span></span>
                          <span className="text-gray-900">$ {order.shipping_cost || 12}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;