import React from 'react';

export default function EventStats({ events, isEventCompleted }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

      {/* Upcoming Events */}
      <div className="bg-white rounded-2xl shadow-card p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-gray-600">Upcoming Events</p>
            <p className="text-xl font-bold text-gray-900">
              {events.filter(e => isEventCompleted(e) === 'upcoming').length}
            </p>
          </div>
        </div>
      </div>

      {/* Completed Events */}
      <div className="bg-white rounded-2xl shadow-card p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-gray-600">Completed Events</p>
            <p className="text-xl font-bold text-gray-900">
              {events.filter(e => isEventCompleted(e) === 'completed').length}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
