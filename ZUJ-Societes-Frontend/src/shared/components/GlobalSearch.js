import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosClient from '../../config/axios';
import LoadingSpinner from './LoadingSpinner';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    societies: [],
    events: [],
    posts: []
  });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAll = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({ societies: [], events: [], posts: [] });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      
      const [societiesRes, eventsRes, postsRes] = await Promise.allSettled([
        AxiosClient.get('/societies/get_all_societies', { params: { token } }),
        AxiosClient.get('/events/get_all_events', { params: { token } }),
        AxiosClient.get('/posts/get_all_posts', { params: { token } })
      ]);

      const searchTerm = searchQuery.toLowerCase();
      
      
      const societies = societiesRes.status === 'fulfilled' && societiesRes.value.status === 200
        ? (societiesRes.value.data.data || []).filter(society =>
            society.Name.toLowerCase().includes(searchTerm) ||
            society.Description?.toLowerCase().includes(searchTerm) ||
            society.Category?.toLowerCase().includes(searchTerm)
          ).slice(0, 3)
        : [];

      const events = eventsRes.status === 'fulfilled' && eventsRes.value.status === 200
        ? (eventsRes.value.data.data || []).filter(event =>
            event.Title.toLowerCase().includes(searchTerm) ||
            event.Description?.toLowerCase().includes(searchTerm) ||
            event.Location?.toLowerCase().includes(searchTerm)
          ).slice(0, 3)
        : [];

      const posts = postsRes.status === 'fulfilled' && postsRes.value.status === 200
        ? (postsRes.value.data.data || []).filter(post =>
            post.Content?.toLowerCase().includes(searchTerm) ||
            post.Society_Name?.toLowerCase().includes(searchTerm)
          ).slice(0, 3)
        : [];

      setResults({ societies, events, posts });
    } catch (error) {
      console.error('Search error:', error);
      setResults({ societies: [], events: [], posts: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      searchAll(value);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const getTotalResults = () => {
    return results.societies.length + results.events.length + results.posts.length;
  };

  const SearchResultItem = ({ item, type, onClick }) => {
    const getItemIcon = () => {
      const icons = {
        society: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
        event: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
        post: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
      };
      return icons[type] || icons.post;
    };

    const getItemColor = () => {
      const colors = {
        society: 'text-blue-600 bg-blue-100',
        event: 'text-green-600 bg-green-100',
        post: 'text-purple-600 bg-purple-100'
      };
      return colors[type] || colors.post;
    };

    return (
      <div
        onClick={onClick}
        className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getItemColor()}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getItemIcon()} />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {item.Name || item.Title}
          </h4>
          <p className="text-xs text-gray-600 truncate">
            {item.Description || item.Content}
          </p>
        </div>
        <span className="text-xs text-gray-500 capitalize">{type}</span>
      </div>
    );
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search societies, events, posts..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim() && setShowResults(true)}
          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <LoadingSpinner size="small" />
          </div>
        )}
      </form>

      {/* Search Results Dropdown */}
      {showResults && query.trim() && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <LoadingSpinner size="small" text="Searching..." />
            </div>
          ) : getTotalResults() > 0 ? (
            <div>
              {/* Societies */}
              {results.societies.length > 0 && (
                <div>
                  <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Societies ({results.societies.length})
                    </h3>
                  </div>
                  {results.societies.map((society) => (
                    <SearchResultItem
                      key={society.ID}
                      item={society}
                      type="society"
                      onClick={() => {
                        navigate(`/societies/${society.ID}`);
                        setShowResults(false);
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Events */}
              {results.events.length > 0 && (
                <div>
                  <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Events ({results.events.length})
                    </h3>
                  </div>
                  {results.events.map((event) => (
                    <SearchResultItem
                      key={event.ID}
                      item={event}
                      type="event"
                      onClick={() => {
                        navigate(`/events/${event.ID}`);
                        setShowResults(false);
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Posts */}
              {results.posts.length > 0 && (
                <div>
                  <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Posts ({results.posts.length})
                    </h3>
                  </div>
                  {results.posts.map((post) => (
                    <SearchResultItem
                      key={post.ID}
                      item={post}
                      type="post"
                      onClick={() => {
                        navigate(`/posts/${post.ID}`);
                        setShowResults(false);
                      }}
                    />
                  ))}
                </div>
              )}

              {/* View All Results */}
              <div className="p-3 text-center border-t border-gray-200">
                <button
                  onClick={handleSearch}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all {getTotalResults()} results for "{query}"
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-600">
              <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">No results found for "{query}"</p>
              <p className="text-xs text-gray-500 mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}