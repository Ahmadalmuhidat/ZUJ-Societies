import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AxiosClient from '../../config/axios';
import { parseEventDate } from '../../utils/dateUtils';

export default function PersonalizedRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        
        try {
          const response = await AxiosClient.get('/analytics/recommendations', { 
            params: { token, user_id: user?.ID } 
          });
          
          if (response.status === 200) {
            setRecommendations(response.data.data);
            return;
          }
        } catch (analyticsError) {
          console.log('Analytics endpoint not available, falling back to individual calls');
        }

        
        const [userSocietiesRes, allSocietiesRes, eventsRes] = await Promise.allSettled([
          AxiosClient.get('/societies/get_societies_by_user', { params: { token } }),
          AxiosClient.get('/societies/get_all_societies', { params: { token } }),
          AxiosClient.get('/events/get_all_events', { params: { token } })
        ]);

        const recommendations = [];

        
        let userSocietyIds = [];
        if (userSocietiesRes.status === 'fulfilled' && userSocietiesRes.value.status === 200) {
          userSocietyIds = userSocietiesRes.value.data.data?.map(s => s.ID) || [];
        }

        
        if (allSocietiesRes.status === 'fulfilled' && allSocietiesRes.value.status === 200) {
          const allSocieties = allSocietiesRes.value.data.data || [];
          const recommendedSocieties = allSocieties
            .filter(society => !userSocietyIds.includes(society.ID))
            .slice(0, 2)
            .map(society => ({
              id: society.ID,
              type: 'society',
              title: society.Name,
              description: society.Description || 'Join this community',
              reason: 'Based on your interests',
              members: society.Member_Count || 0,
              category: society.Category || 'General',
              image: society.Image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop'
            }));
          
          recommendations.push(...recommendedSocieties);
        }

        
        if (eventsRes.status === 'fulfilled' && eventsRes.value.status === 200) {
          const allEvents = eventsRes.value.data.data || [];
          const recommendedEvents = allEvents
            .slice(0, 1)
            .map(event => ({
              id: event.ID,
              type: 'event',
              title: event.Title,
              description: event.Description || 'Join this event',
              reason: 'Matches your interests',
              date: event.Date ? (() => {
                try {
                  
                  let dateToFormat;
                  if (typeof event.Date === 'string') {
                    dateToFormat = new Date(event.Date);
                  } else {
                    dateToFormat = parseEventDate(event.Date);
                  }
                  
                  
                  if (dateToFormat && !isNaN(dateToFormat.getTime())) {
                    return dateToFormat.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    });
                  }
                  return 'TBD';
                } catch (error) {
                  console.error('Date parsing error:', error);
                  return 'TBD';
                }
              })() : 'TBD',
              time: event.Time || 'TBD',
              location: event.Location || 'TBD',
              image: event.Image || 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop'
            }));
          
          recommendations.push(...recommendedEvents);
        }

        setRecommendations(recommendations);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, [user]);

  const getTypeIcon = (type) => {
    const icons = {
      society: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      event: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    };
    return icons[type] || icons.society;
  };

  const getTypeColor = (type) => {
    const colors = {
      society: 'text-blue-600 bg-blue-100',
      event: 'text-green-600 bg-green-100'
    };
    return colors[type] || colors.society;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-card p-4 border border-gray-100 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
            <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          Recommended for You
        </h3>
        <Link to="/recommendations" className="text-xs text-primary-600 hover:text-primary-800 font-semibold transition-colors">
          View All
        </Link>
      </div>
      
      <div className="space-y-3">
        {recommendations.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-xl p-3 hover:shadow-md transition-all duration-300 bg-white hover:border-primary-200 group">
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(item.type)}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getTypeIcon(item.type)} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-700 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2 whitespace-pre-line">
                  {item.description}
                </p>
                <div className="flex items-center mt-2 space-x-3 text-xs text-gray-500">
                  {item.type === 'society' && (
                    <>
                      <span className="flex items-center font-medium">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {item.members} members
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded-lg font-medium">
                        {item.category}
                      </span>
                    </>
                  )}
                  {item.type === 'event' && (
                    <>
                      <span className="flex items-center font-medium">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item.date} at {item.time}
                      </span>
                      <span className="flex items-center font-medium">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.location}
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-2">
                  <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-lg font-medium">
                    {item.reason}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <button className="flex-1 bg-primary-500 text-white text-xs py-2 px-3 rounded-lg hover:bg-primary-600 transition-all duration-200 font-semibold">
                {item.type === 'society' ? 'Join Society' : 'Register'}
              </button>
              <button className="px-3 py-2 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
