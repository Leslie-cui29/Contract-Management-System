import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.full_name || 'User'}!
            </h2>
            <p className="text-base text-blue-100">
              Manage your contracts and documents all in one place
            </p>
          </div>

          <div className="hidden md:block">
            <div className="w-24 h-24 rounded-2xl bg-white/10" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm font-medium text-gray-600 mb-1">Total Contracts</p>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm font-medium text-gray-600 mb-1">Pending Review</p>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl shadow-md p-12">
        <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">No contracts yet</h3>
        <p className="text-gray-600 text-center mb-8">
          Get started by uploading your first contract document. The upload feature will be available soon.
        </p>

        <div className="flex justify-center">
          <button
            disabled
            className="px-6 py-3 rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 disabled:opacity-50"
          >
            Upload Contract (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}
