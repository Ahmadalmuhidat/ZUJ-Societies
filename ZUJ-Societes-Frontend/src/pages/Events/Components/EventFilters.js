import React, { useEffect, useState } from 'react';

export default function EventFilters({ filter, setFilter }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={`flex flex-wrap gap-4 mb-8 justify-end transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="relative">
        <select 
          className="appearance-none bg-white border border-gray-200 rounded-full py-2 pl-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filter.days}
          onChange={(e) => setFilter({ ...filter, days: e.target.value })}
        >
          <option>Weekdays</option>
          <option>Weekends</option>
          <option>All Days</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
      
      <div className="relative">
        <select 
          className="appearance-none bg-white border border-gray-200 rounded-full py-2 pl-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
        >
          <option>Event Type</option>
          <option>Concert</option>
          <option>Festival</option>
          <option>Conference</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
      
      <div className="relative">
        <select 
          className="appearance-none bg-white border border-gray-200 rounded-full py-2 pl-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        >
          <option>Any Category</option>
          <option>Music</option>
          <option>Sports</option>
          <option>Arts</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
