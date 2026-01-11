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
      {/* 统一的渐变顶部栏（全站一层） */}
      <header className="flex-shrink-0 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center">
              <span className="font-bold text-xl">CM</span>
            </div>
            <div className="leading-tight">
              <div className="text-lg font-semibold">Contract Manager</div>
              <div className="text-xs text-white/80 hidden sm:block">合同管理系统</div>
            </div>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center font-semibold">
              {userInitial}
            </div>
            <div className="hidden md:block leading-tight">
              <div className="text-sm font-medium">{user?.full_name || '用户'}</div>
              <div className="text-xs text-white/80">{user?.email || ''}</div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/15 hover:bg-white/25 transition"
              title="退出登录"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* 主体：左侧栏 + 内容 */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`flex-shrink-0 bg-white border-r border-gray-200 transition-all duration-300 overflow-y-auto ${
            sidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          <nav className="py-4">
            <ul className="space-y-1 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      title={item.name}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && (
                        <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* 折叠按钮 */}
          <div className="px-3 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
