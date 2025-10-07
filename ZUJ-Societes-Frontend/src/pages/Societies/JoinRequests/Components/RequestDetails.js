import React from 'react';
import AxiosClient from '../../../../config/axios';

export default function RequestDetails({ setRequests, selectedRequest, setSelectedRequest, getStatusBadge, formatDate }) {
  
  const handleApprove = async (requestId) => {
    setRequests(prev => prev.map(req => 
      req.Request_ID === requestId ? { ...req, Status: 'approved' } : req
    ));

    const response = await AxiosClient.post("societies/join_requests/approve", {
      request_id: requestId
    });

    if (response.status === 204) {
      setSelectedRequest(null);
    }
  };

  const handleReject = async (requestId) => {
    setRequests(prev => prev.map(req => 
      req.Request_ID === requestId ? { ...req, Status: 'rejected' } : req
    ));

    const response = await AxiosClient.post("/societies/join_requests/reject", {
      request_id: requestId
    });

    if (response.status === 204) {
      setSelectedRequest(null);
    }
  };

  return (
    <div className="lg:col-span-1">
      {selectedRequest ? (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Request Details
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <div className="relative">
                <img
                  src={selectedRequest.User_Photo || 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png'}
                  alt={selectedRequest.User_Name}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedRequest.User_Name)}&background=3B82F6&color=fff`;
                  }}
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h4 className="text-base font-semibold text-gray-900">{selectedRequest.User_Name}</h4>
                <p className="text-sm text-gray-600">{selectedRequest.User_Email}</p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Status</h5>
              <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold capitalize ${getStatusBadge(selectedRequest.Status)}`}>
                {selectedRequest.Status}
              </span>
            </div>

            {selectedRequest.Status === 'pending' && (
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => handleApprove(selectedRequest.Request_ID)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2.5 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm font-semibold shadow-lg"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(selectedRequest.Request_ID)}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm font-semibold shadow-lg"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Select a Request</h3>
            <p className="text-sm text-gray-500">
              Click on a request from the list to view details and take action.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
