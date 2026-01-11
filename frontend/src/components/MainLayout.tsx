import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  DocumentArrowUpIcon,
  ChatBubbleBottomCenterTextIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { path: '/dashboard', name: 'Dashboard', icon: HomeIcon },
  { path: '/upload', name: '合同上传', icon: DocumentArrowUpIcon },
  { path: '/ai-assistant', name: '法律AI助手', icon: ChatBubbleBottomCenterTextIcon },
  { path: '/contracts', name: '合同检索', icon: MagnifyingGlassIcon },
  { path: '/account', name: '个人账户', icon: UserCircleIcon },
  { path: '/settings', name: '设置', icon: Cog6ToothIcon },
];

export default function MainLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitial = (user?.full_name?.trim()?.charAt(0) || 'U').toUpperCase();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Header - 关键修复：移除所有冲突的padding */}
      <header className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="h-20 px-8 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <span className="font-bold text-2xl">CM</span>
            </div>
            <div>
              <div className="text-xl font-bold">Contract Manager</div>
              <div className="text-sm text-white/90 hidden sm:block">合同管理系统</div>
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg backdrop-blur-sm">
              {userInitial}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-semibold">{user?.full_name || '用户'}</div>
              <div className="text-xs text-white/90">{user?.email || ''}</div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm font-medium"
              title="退出登录"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`flex-shrink-0 bg-white border-r border-gray-200 transition-all duration-300 overflow-y-auto ${
            sidebarOpen ? 'w-72' : 'w-20'
          }`}
        >
          <nav className="py-6">
            <ul className="space-y-2 px-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-semibold shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      title={item.name}
                    >
                      <Icon className="w-6 h-6 flex-shrink-0" />
                      {sidebarOpen && (
                        <span className="text-base whitespace-nowrap">{item.name}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Toggle Button */}
          <div className="px-4 py-4 border-t border-gray-200 mt-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              title={sidebarOpen ? '收起侧边栏' : '展开侧边栏'}
            >
              <svg
                className={`w-5 h-5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </aside>

        {/* Main Content - 关键修复：增加padding */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-8 py-10 lg:px-12 lg:py-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}