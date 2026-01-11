import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  FolderIcon,
  DocumentTextIcon,
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

interface Project {
  id: string;
  name: string;
  contract_count: number;
  created_at: string;
}


export default function ContractSearch() {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    party: '',
    contractType: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'projects' | 'search'>('projects');

  useEffect(() => {
    fetchProjects();
    
    // 如果有 uploaded 参数，显示搜索结果
    const uploadedId = searchParams.get('uploaded');
    if (uploadedId) {
      setViewMode('search');
      fetchContracts();
    }
  }, [searchParams]);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (filters.startDate) params.append('start_date', filters.startDate);
      if (filters.endDate) params.append('end_date', filters.endDate);
      if (filters.party) params.append('party', filters.party);
      if (filters.contractType) params.append('contract_type', filters.contractType);

      const response = await api.get(`/contracts/search?${params}`);
      setContracts(response.data);
      setViewMode('search');
    } catch (error) {
      console.error('Failed to search contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContracts();
  };

  return (
    <div>
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">合同检索</h1>
        <p className="mt-2 text-gray-600">搜索和管理您的合同文档</p>
      </div>

      {/* 搜索栏 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            {/* 搜索输入框 */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索合同名称、当事人、关键词..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* 筛选按钮 */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-lg border transition-colors ${
                showFilters
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-5 w-5 inline-block mr-2" />
              筛选
            </button>

            {/* 搜索按钮 */}
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              搜索
            </button>
          </div>

          {/* 筛选选项 */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  起始日期
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  结束日期
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  合同当事人
                </label>
                <input
                  type="text"
                  value={filters.party}
                  onChange={(e) => setFilters({ ...filters, party: e.target.value })}
                  placeholder="输入当事人名称"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  合同类型
                </label>
                <select
                  value={filters.contractType}
                  onChange={(e) => setFilters({ ...filters, contractType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">全部类型</option>
                  <option value="purchase">采购合同</option>
                  <option value="sales">销售合同</option>
                  <option value="service">服务合同</option>
                  <option value="lease">租赁合同</option>
                </select>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* 主内容区 */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : viewMode === 'projects' ? (
        <ProjectsView projects={projects} />
      ) : (
        <ContractsView contracts={contracts} />
      )}
    </div>
  );
}

// 项目视图组件
function ProjectsView({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Unorganized Contracts 卡片 */}
      <Link
        to="/contracts/unorganized"
        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border-2 border-dashed border-gray-300 hover:border-blue-500"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gray-100 rounded-lg">
            <FolderIcon className="h-8 w-8 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">未分类合同</h3>
            <p className="text-sm text-gray-500 mt-1">Unorganized Contracts</p>
          </div>
        </div>
      </Link>

      {/* 项目卡片 */}
      {projects.map((project) => (
        <Link
          key={project.id}
          to={`/contracts/project/${project.id}`}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FolderIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {project.contract_count} 个合同
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// 合同列表视图组件
function ContractsView({ contracts }: { contracts: Contract[] }) {
  if (contracts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <DocumentTextIcon className="mx-auto h-16 w-16 text-gray-400" />
        <p className="mt-4 text-gray-500">未找到相关合同</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-200">
        {contracts.map((contract) => (
          <Link
            key={contract.id}
            to={`/contracts/${contract.id}`}
            className="block p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{contract.name}</h3>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>{new Date(contract.signing_date).toLocaleDateString('zh-CN')}</span>
                  <span>•</span>
                  <span>{contract.parties.join(', ')}</span>
                  <span>•</span>
                  <span>{contract.contract_type}</span>
                </div>
              </div>
              <div className="ml-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  contract.status === 'completed' ? 'bg-green-100 text-green-700' :
                  contract.status === 'active' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {contract.status === 'completed' ? '已履行' :
                   contract.status === 'active' ? '履行中' : '待履行'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}