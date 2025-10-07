import React from 'react';

export default function RequestsList({ filter, setFilter, filteredRequests, selectedRequest, setSelectedRequest }) {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-2xl shadow-card border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              Join Requests
            </h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredRequests.map((request) => (
            <div
              key={request.Request_ID}
              className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${selectedRequest?.Request_ID === request.Request_ID ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
              onClick={() => setSelectedRequest(request)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <img
                      src={request.User_Photo || 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png'}
                      alt={request.User_Name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-gray-200"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(request.User_Name)}&background=3B82F6&color=fff`;
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900">{request.User_Name}</h3>
                    <p className="text-sm text-gray-600">{request.User_Email}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No requests found</h3>
            <p className="text-sm text-gray-500">
              {filter === 'pending' ? 'No pending join requests at the moment.' : 'Try changing the filter to see other requests.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
