import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

// Type definitions
interface Contract {
  id: string;
  name: string;
  contract_type: string;
  signing_date: string;
  parties: string[];
  amount?: number;
  risk_level?: 'low' | 'medium' | 'high';
  status: 'pending' | 'active' | 'completed';
  project_id?: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}

interface DashboardStats {
  total_contracts: number;
  completed_contracts: number;
  pending_contracts: number;
  active_contracts: number;
  recent_contracts: Contract[];
  top_amount_contracts: Contract[];
  high_risk_contracts: Contract[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">无法加载数据</p>
      </div>
    );
  }

  const statusData = [
    { 
      name: '已履行', 
      value: stats.completed_contracts, 
      color: 'bg-green-500',
      percentage: (stats.completed_contracts / stats.total_contracts * 100).toFixed(1)
    },
    { 
      name: '待履行', 
      value: stats.pending_contracts, 
      color: 'bg-yellow-500',
      percentage: (stats.pending_contracts / stats.total_contracts * 100).toFixed(1)
    },
    { 
      name: '履行中', 
      value: stats.active_contracts, 
      color: 'bg-blue-500',
      percentage: (stats.active_contracts / stats.total_contracts * 100).toFixed(1)
    },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">合同管理数据概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="合同总数"
          value={stats.total_contracts}
          icon={DocumentTextIcon}
          color="blue"
        />
        <StatCard
          title="已履行合同"
          value={stats.completed_contracts}
          icon={CheckCircleIcon}
          color="green"
        />
        <StatCard
          title="履行中合同"
          value={stats.active_contracts}
          icon={ClockIcon}
          color="yellow"
        />
        <StatCard
          title="高风险合同"
          value={stats.high_risk_contracts.length}
          icon={ExclamationTriangleIcon}
          color="red"
        />
      </div>

      {/* 圆饼图区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 合同状态分布 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">合同状态分布</h2>
          <div className="space-y-4">
            {statusData.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-medium text-gray-900">
                    {item.value} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近修改合同 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最近修改合同</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {stats.recent_contracts.slice(0, 10).map((contract) => (
              <Link
                key={contract.id}
                to={`/contracts/${contract.id}`}
                className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="font-medium text-gray-900 text-sm">{contract.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(contract.updated_at).toLocaleDateString('zh-CN')}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 金额前十和风险前十 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 金额最大前十 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">金额最大前十</h2>
          <div className="space-y-3">
            {stats.top_amount_contracts.map((contract, index) => (
              <Link
                key={contract.id}
                to={`/contracts/${contract.id}`}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{contract.name}</span>
                </div>
                <span className="text-sm font-semibold text-blue-600">
                  ¥{contract.amount?.toLocaleString()}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 法律风险前十 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">法律风险前十</h2>
          <div className="space-y-3">
            {stats.high_risk_contracts.map((contract, index) => (
              <Link
                key={contract.id}
                to={`/contracts/${contract.id}`}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{contract.name}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  contract.risk_level === 'high' ? 'bg-red-100 text-red-700' :
                  contract.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {contract.risk_level === 'high' ? '高风险' :
                   contract.risk_level === 'medium' ? '中风险' : '低风险'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 统计卡片组件
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: number; 
  icon: any; 
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  }[color];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}