import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AxiosClient from '../../config/axios';

export default function SocietyInsights({ societies = [] }) {
  const [insights, setInsights] = useState({
    totalSocieties: 0,
    totalMembers: 0,
    averageMembers: 0,
    topCategories: [],
    mostActive: [],
    newest: [],
    largest: []
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (societies.length > 0) {
      calculateInsights();
    } else {
      
      const fetchSocieties = async () => {
        try {
          const response = await AxiosClient.get('/societies');
          if (response.status === 200) {
            const fetchedSocieties = response.data.data || [];
            setInsights(prev => ({
              ...prev,
              totalSocieties: fetchedSocieties.length,
              totalMembers: fetchedSocieties.reduce((sum, society) => sum + (society.Member_Count || 0), 0),
              averageMembers: fetchedSocieties.length > 0 ? Math.round(fetchedSocieties.reduce((sum, society) => sum + (society.Member_Count || 0), 0) / fetchedSocieties.length) : 0
            }));
          }
        } catch (error) {
          console.error('Failed to fetch societies:', error);
        }
      };
      fetchSocieties();
    }
  }, [societies]);

  const calculateInsights = () => {
    const totalSocieties = societies.length;
    const totalMembers = societies.reduce((sum, society) => sum + (society.Member_Count || 0), 0);
    const averageMembers = totalSocieties > 0 ? Math.round(totalMembers / totalSocieties) : 0;

    
    const categoryCount = {};
    societies.forEach(society => {
      if (society.Category) {
        categoryCount[society.Category] = (categoryCount[society.Category] || 0) + 1;
      }
    });
    const topCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));

    
    const mostActive = [...societies]
      .sort((a, b) => (b.Member_Count || 0) - (a.Member_Count || 0))
      .slice(0, 5);

    
    const newest = [...societies]
      .sort((a, b) => new Date(b.CreatedAt || 0) - new Date(a.CreatedAt || 0))
      .slice(0, 5);

    
    const largest = [...societies]
      .filter(society => society.Member_Count > 50)
      .sort((a, b) => (b.Member_Count || 0) - (a.Member_Count || 0))
      .slice(0, 5);

    setInsights({
      totalSocieties,
      totalMembers,
      averageMembers,
      topCategories,
      mostActive,
      newest,
      largest
    });
  };

  const StatCard = ({ title, value, icon, color = 'blue' }) => (
    <div className="bg-white rounded-2xl shadow-card p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center">
        <div className={`p-3 rounded-xl bg-${color}-100`}>
          <svg className={`w-4 h-4 text-${color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-xs font-medium text-gray-500">{title}</p>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );  

  const SocietyList = ({ title, societies, emptyMessage, maxItems = 3 }) => (
    <div className="bg-white rounded-2xl shadow-card p-6 mb-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {societies.length > 0 ? (
          societies.slice(0, maxItems).map((society, index) => (
            <div key={society.ID} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-xs">
                  {society.Name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-medium text-gray-900 truncate">{society.Name}</h4>
                  <p className="text-xs text-gray-600">{society.Category || 'Uncategorized'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-900">{society.Member_Count || 0}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-500 text-center py-2">{emptyMessage}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className={`space-y-3 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      {/* Statistics Overview */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          title="Total Societies"
          value={insights.totalSocieties}
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          color="blue"
        />
        <StatCard
          title="Total Members"
          value={insights.totalMembers.toLocaleString()}
          icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          color="green"
        />
        <StatCard
          title="Avg Members"
          value={insights.averageMembers}
          icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          color="purple"
        />
        <StatCard
          title="Categories"
          value={insights.topCategories.length}
          icon="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          color="orange"
        />
      </div>

      {/* Top Categories */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Top Categories</h3>
        <div className="space-y-2">
          {insights.topCategories.slice(0, 3).map((category, index) => (
            <div key={category.category} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  {index + 1}
                </span>
                <span className="text-xs font-medium text-gray-900">{category.category}</span>
              </div>
              <span className="text-xs text-gray-600">{category.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Most Active Societies */}
      <SocietyList
        title="Most Active"
        societies={insights.mostActive}
        emptyMessage="No active societies"
        maxItems={3}
      />

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <Link
            to="/societies/new"
            className="flex items-center p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs font-medium text-blue-900">Create Society</span>
          </Link>
          <Link
            to="/societies?filter=trending"
            className="flex items-center p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xs font-medium text-green-900">Trending</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
