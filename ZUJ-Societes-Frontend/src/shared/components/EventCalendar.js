import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AxiosClient from '../../config/axios';
import { parseEventDate, isSameDay } from '../../utils/dateUtils';

export default function EventCalendar({ events = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await AxiosClient.get('/events/get_all_events', { 
          params: { token } 
        });

        if (response.status === 200) {
          setAllEvents(response.data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setAllEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const eventsToUse = allEvents.length > 0 ? allEvents : events;
    return eventsToUse.filter(event => {
      const eventDate = parseEventDate(event.Date);
      return eventDate && isSameDay(eventDate, date);
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);

  return (
    <div className={`bg-white rounded-2xl shadow-card p-6 border border-gray-100 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-3 hover:bg-primary-100 rounded-xl transition-all duration-200 group"
          >
            <svg className="w-5 h-5 text-gray-600 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h4 className="text-xl font-bold text-gray-900 min-w-[160px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>
          <button
            onClick={() => navigateMonth(1)}
            className="p-3 hover:bg-primary-100 rounded-xl transition-all duration-200 group"
          >
            <svg className="w-5 h-5 text-gray-600 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          return (
            <div
              key={index}
              className={`
                p-2 min-h-[40px] cursor-pointer rounded-md transition-colors
                ${day ? 'hover:bg-gray-100' : ''}
                ${isToday(day) ? 'bg-blue-100 text-blue-900 font-semibold' : ''}
                ${isSelected(day) ? 'bg-blue-600 text-white' : ''}
                ${!day ? 'invisible' : ''}
              `}
              onClick={() => day && setSelectedDate(day)}
            >
              <div className="text-sm">
                {day ? day.getDate() : ''}
              </div>
              {dayEvents.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {dayEvents.slice(0, 2).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected(day) ? 'bg-white' : 'bg-blue-500'
                      }`}
                    />
                  ))}
                  {dayEvents.length > 2 && (
                    <div className={`text-xs ${isSelected(day) ? 'text-white' : 'text-blue-600'}`}>
                      +{dayEvents.length - 2}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Date Events */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-bold text-gray-900 mb-4">
          Events on {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h4>
        <div className="space-y-3">
          {getEventsForDate(selectedDate).length > 0 ? (
            getEventsForDate(selectedDate).map((event) => (
              <Link
                key={event.ID}
                to={`/events/${event.ID}`}
                className="block p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-primary-50 hover:to-blue-50 transition-all duration-300 group border border-gray-200 hover:border-primary-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-gradient-to-br from-primary-500 to-blue-500 rounded-full shadow-sm"></div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary-700 transition-colors">
                      {event.Title}
                    </h5>
                    <p className="text-xs text-gray-600 font-medium">
                      {new Date(event.Date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No events on this date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
