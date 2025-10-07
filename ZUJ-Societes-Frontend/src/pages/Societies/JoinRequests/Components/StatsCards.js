import React from 'react';

export default function StatsCards({ requests }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Pending Requests */}
      <div className="bg-white rounded-2xl shadow-card p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-gray-600">Pending Requests</p>
            <p className="text-xl font-bold text-gray-900">{requests.filter(r => r.Status === 'pending').length}</p>
          </div>
        </div>
      </div>

      {/* Approved Requests */}
      <div className="bg-white rounded-2xl shadow-card p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-gray-600">Approved</p>
            <p className="text-xl font-bold text-gray-900">{requests.filter(r => r.Status === 'approved').length}</p>
          </div>
        </div>
      </div>

      {/* Rejected Requests */}
      <div className="bg-white rounded-2xl shadow-card p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-gray-600">Rejected</p>
            <p className="text-xl font-bold text-gray-900">{requests.filter(r => r.Status === 'rejected').length}</p>
          </div>
        </div>
      </div>

      {/* Total Requests */}
      <div className="bg-white rounded-2xl shadow-card p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-gray-600">Total Requests</p>
            <p className="text-xl font-bold text-gray-900">{requests.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
