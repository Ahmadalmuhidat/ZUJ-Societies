import React from "react";

export default function Search({ searchTerm, setSearchTerm, roleFilter, setRoleFilter, sortBy, setSortBy }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Members
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div>
          <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Role
          </label>
          <select
            id="role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
        </div>

        <div>
          <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-2">
            Sort by
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name">Name</option>
            <option value="role">Role</option>
            <option value="joined">Join Date</option>
          </select>
        </div>
      </div>
    </div>
  );
}
