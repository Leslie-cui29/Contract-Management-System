import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ContractUpload from './pages/ContractUpload';
import AIAssistant from './pages/AIAssistant';
import ContractSearch from './pages/ContractSearch';

// 受保护的路由组件
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
}

// 占位页面组件
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <p className="mt-4 text-gray-600">此页面正在开发中...</p>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="upload" element={<ContractUpload />} />
        <Route path="ai-assistant" element={<AIAssistant />} />
        <Route path="contracts" element={<ContractSearch />} />
        <Route path="contracts/:id" element={<PlaceholderPage title="合同详情" />} />
        <Route path="contracts/project/:id" element={<PlaceholderPage title="项目合同" />} />
        <Route path="contracts/unorganized" element={<PlaceholderPage title="未分类合同" />} />
        <Route path="account" element={<PlaceholderPage title="个人账户" />} />
        <Route path="settings" element={<PlaceholderPage title="设置" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;