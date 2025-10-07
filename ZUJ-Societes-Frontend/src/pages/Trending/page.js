import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AxiosClient from '../../config/axios';
import { SkeletonList } from '../../shared/components/LoadingSpinner';
import PostCard from '../../shared/post/PostCard';

export default function TrendingPage() {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [timeFilter, setTimeFilter] = useState('7'); 
  const [limit, setLimit] = useState(20);
  const [isFilterChanging, setIsFilterChanging] = useState(false);

  const fetchTrendingPosts = async (isFilterChange = false) => {
    try {
      if (isFilterChange) {
        setIsFilterChanging(true);
        
        setTrendingPosts([]);
      } else {
        setLoading(true);
      }
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      try {
        const response = await AxiosClient.get('/analytics/trending-posts', { 
          params: { token, limit, days: timeFilter } 
        });
        
        if (response.status === 200) {
          
          const postsWithLikeStatus = response.data.data.map(post => ({
            ...post,
            Is_Liked: post.Is_Liked || false,
            Likes: post.Likes || 0,
            Comments: post.Comments || post.CommentsCount || 0
          }));
          setTrendingPosts(postsWithLikeStatus);
          return;
        }
      } catch (analyticsError) {
        console.log('Analytics endpoint not available, falling back to regular posts');
      }

      const response = await AxiosClient.get('/posts/get_all_posts', { 
        params: { token } 
      });

      if (response.status === 200) {
        const posts = response.data.data || [];
        
        
        const trendingPosts = posts
          .map(post => ({
            ...post,
            Is_Liked: post.Is_Liked || false,
            Likes: post.Likes || 0,
            Comments: post.Comments || post.CommentsCount || 0,
            engagement: (post.Likes || 0) + (post.Comments || post.CommentsCount || 0)
          }))
          .sort((a, b) => b.engagement - a.engagement)
          .slice(0, limit);
        
        setTrendingPosts(trendingPosts);
      }
    } catch (error) {
      console.error('Failed to fetch trending posts:', error);
      setTrendingPosts([]);
    } finally {
      setLoading(false);
      setIsFilterChanging(false);
    }
  };

  useEffect(() => {
    fetchTrendingPosts();
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, [limit]);

  useEffect(() => {
    fetchTrendingPosts(true);
  }, [timeFilter]);

  const handlePostDeleted = (deletedPostId) => {
    setTrendingPosts((prevPosts) => prevPosts.filter((post) => post.ID !== deletedPostId));
  };

  const timeFilters = [
    { value: '1', label: 'Today' },
    { value: '7', label: 'This Week' },
    { value: '30', label: 'This Month' },
    { value: '90', label: 'This Quarter' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <SkeletonList count={1} className="h-12 mb-4" />
            <SkeletonList count={3} className="h-8 mb-4" />
          </div>
          <SkeletonList count={5} className="space-y-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className={`mb-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Trending Posts</h1>
                <p className="text-gray-600 mt-1">Discover the most engaging content from your communities</p>
              </div>
            </div>
            <Link 
              to="/" 
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Time Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {timeFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setTimeFilter(filter.value)}
                disabled={isFilterChanging}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  timeFilter === filter.value
                    ? 'bg-red-500 text-white shadow-lg scale-105 ring-2 ring-red-200'
                    : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {isFilterChanging && timeFilter === filter.value ? (
                  <div className="flex items-center">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {filter.label}
                  </div>
                ) : (
                  filter.label
                )}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{trendingPosts.length}</div>
                <div className="text-sm text-gray-600">Trending Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {trendingPosts.reduce((sum, post) => sum + (post.Likes || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Likes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {trendingPosts.reduce((sum, post) => sum + (post.Comments || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Comments</div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading indicator for filter changes */}
        {isFilterChanging && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <span className="ml-3 text-gray-600 font-medium">Loading trending posts...</span>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div 
          key={timeFilter} 
          className={`space-y-6 transition-all duration-500 ${mounted && !isFilterChanging ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
          {trendingPosts.length === 0 && !isFilterChanging ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No trending posts found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your time filter or check back later for new content.</p>
              <Link 
                to="/" 
                className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          ) : (
            trendingPosts.map((post, index) => (
              <div 
                key={post.ID} 
                className="relative group animate-fade-in-up"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Trending Rank Badge */}
                <div className="absolute -top-2 -left-2 z-10">
                  <div className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full text-sm font-bold shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                    #{index + 1}
                  </div>
                </div>
                
                {/* Post Card with Trending Styling */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl shadow-card border-2 border-red-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-red-200">
                  <PostCard post={post} onPostDeleted={handlePostDeleted} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {trendingPosts.length > 0 && trendingPosts.length >= limit && (
          <div className="text-center mt-8">
            <button
              onClick={() => setLimit(prev => prev + 10)}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 font-medium transform hover:scale-105 hover:shadow-lg active:scale-95"
            >
              Load More Posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
