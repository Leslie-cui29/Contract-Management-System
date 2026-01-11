export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-10 lg:p-12 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-4">
          Welcome back, Test User!
        </h1>
        <p className="text-lg text-blue-100">
          Manage your contracts and documents all in one place
        </p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Contracts', value: '0', color: 'blue' },
          { label: 'Pending Review', value: '0', color: 'yellow' },
          { label: 'Completed', value: '0', color: 'green' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-gray-600 mb-3">{stat.label}</p>
            <p className="text-5xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Empty State */}
      <section className="bg-white rounded-2xl p-16 shadow-sm border border-gray-200 text-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900">No contracts yet</h2>
          <p className="text-base text-gray-600 leading-relaxed">
            Get started by uploading your first contract document.
            The system will automatically analyze and provide risk assessment.
          </p>

          <button
            disabled
            className="mt-6 px-8 py-4 rounded-xl text-base font-semibold text-white
                       bg-gradient-to-r from-blue-600 to-purple-600
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-md"
          >
            Upload Contract (Coming Soon)
          </button>
        </div>
      </section>
    </div>
  );
}