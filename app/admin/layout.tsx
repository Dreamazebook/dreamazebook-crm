'use client';
import { FC, ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useUserStore from '@/stores/userStore';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const { fetchCurrentUser, user, logout } = useUserStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, [])

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  const navLinks = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: (
        <svg
          className="mr-3 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
          />
        </svg>
      ),
      active: pathname === '/admin' || pathname.endsWith('/admin'),
    },
    {
      href: '/admin/users',
      label: 'Users',
      icon: (
        <svg
          className="mr-3 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      active: isActive('/admin/users'),
    },
    {
      href: '/admin/orders',
      label: 'Orders',
      icon: (
        <svg
          className="mr-3 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
      active: isActive('/admin/orders'),
    },
    {
      href: '/admin/products',
      label: 'Products',
      icon: (
        <svg
          className="mr-3 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      active: isActive('/admin/products'),
    },
    {
      href: '/admin/logistics',
      label: 'Logistics',
      icon: (
        <svg
          className="mr-3 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      ),
      active: isActive('/admin/logistics'),
    },
    {
      href: '/admin/audits',
      label: 'Preview Audit',
      icon: (
        <svg
          className="mr-3 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
      active: isActive('/admin/audits'),
    },
  ];

  return (
        <div className="min-h-screen bg-gray-100 flex">
          {/* Mobile menu button */}
          <div className="lg:hidden fixed top-0 left-0 z-20 w-full bg-white shadow-sm">
            <div className="px-4 py-3 flex justify-between items-center">
              <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isSidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-1 bg-black/50 transition-opacity lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside className={`fixed z-2 lg:sticky top-0 h-screen w-64 bg-white shadow-md transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 transition duration-300 ease-in-out flex-shrink-0`}>
            <div className="p-6">
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              {user && (
                <p className="text-sm text-gray-600 mt-2">Welcome, {user.name || user.email}</p>
              )}
            </div>

            <nav className="mt-6">
              <div className="px-6 py-2">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Navigation
                </h2>
              </div>

              <div className="mt-2 space-y-1">
                {navLinks.map(({ href, label, icon, active }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={()=>setIsSidebarOpen(false)}
                    className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${active
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    {icon}
                    {label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  // Add logout functionality here
                  logout();
                  router.push('/');
                }}
                className="flex cursor-pointer items-center w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors duration-200"
              >
                <svg
                  className="mr-3 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-h-screen p-4 lg:p-8 pt-16 lg:pt-8 overflow-auto relative">
            {children}
          </main>
        </div>
  );
};

export default AdminLayout; 