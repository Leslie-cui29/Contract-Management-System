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

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* 顶部栏 - 固定在最顶部 */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 h-16 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* 左侧 Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CM</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">合同管理系统</span>
          </div>

          {/* 右侧用户信息 */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.full_name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="w-6 h-6 text-gray-600" />
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">{user?.full_name || '用户'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="退出登录"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 主体区域 - 侧边栏 + 内容 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧边栏 */}
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
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
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

          {/* 侧边栏折叠按钮 */}
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

        {/* 主内容区 */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}