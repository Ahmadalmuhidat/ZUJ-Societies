import React from "react";

export default function MembersStats({ members }) {
  const totalMembers = members.length;
  const adminsCount = members.filter((m) => m.Role === "admin").length;
  const moderatorsCount = members.filter((m) => m.Role === "moderator").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Members */}
      <div className="bg-white rounded-2xl shadow-card p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M7 20v-2m5-8a3 3 0 110-6 3 3 0 010 6z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-gray-600">Total Members</p>
            <p className="text-xl font-bold text-gray-900">{totalMembers}</p>
          </div>
        </div>
      </div>

      {/* Admins */}
      <div className="bg-white rounded-2xl shadow-card p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A3.001 3.001 0 017 16h10a3 3 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-gray-600">Admins</p>
            <p className="text-xl font-bold text-gray-900">{adminsCount}</p>
          </div>
        </div>
      </div>

      {/* Moderators */}
      <div className="bg-white rounded-2xl shadow-card p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl shadow-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l3 3-3 3m5-6h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-gray-600">Moderators</p>
            <p className="text-xl font-bold text-gray-900">{moderatorsCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
