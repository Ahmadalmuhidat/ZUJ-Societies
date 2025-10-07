import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';

export default function NotificationCenter() {
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    isConnected, 
    reconnectAttempts,
    maxReconnectAttempts,
    markAsRead, 
    markAllAsRead,
    reconnect
  } = useNotifications();

  const getNotificationIcon = (type) => {
    const icons = {
      event: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      society: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      post: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      like: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      comment: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      join_request: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
      join_approved: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      join_rejected: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
      new_event: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    };
    return icons[type] || icons.post;
  };

  const getNotificationColor = (type) => {
    const colors = {
      event: 'text-green-600 bg-green-100',
      society: 'text-blue-600 bg-blue-100',
      post: 'text-purple-600 bg-purple-100',
      like: 'text-red-600 bg-red-100',
      comment: 'text-indigo-600 bg-indigo-100',
      join_request: 'text-orange-600 bg-orange-100',
      join_approved: 'text-green-600 bg-green-100',
      join_rejected: 'text-red-600 bg-red-100',
      new_event: 'text-emerald-600 bg-emerald-100'
    };
    return colors[type] || colors.post;
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          Notifications
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
          {/* Connection status indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
                 title={isConnected ? 'Connected to real-time notifications' : 'Disconnected from notifications'} />
            {!isConnected && reconnectAttempts < maxReconnectAttempts && (
              <span className="text-xs text-gray-500">
                Reconnecting... ({reconnectAttempts}/{maxReconnectAttempts})
              </span>
            )}
            {!isConnected && reconnectAttempts >= maxReconnectAttempts && (
              <button
                onClick={reconnect}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
                title="Click to reconnect"
              >
                Reconnect
              </button>
            )}
          </div>
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-64 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828zM4 12h16M4 16h16" />
            </svg>
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 3).map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${!(notification.Read || notification.read) ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                onClick={() => markAsRead(notification.ID || notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getNotificationIcon(notification.type)} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{notification.Title || notification.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.Message || notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.CreatedAt || notification.time).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {!(notification.Read || notification.read) && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            to="/notifications"
            className="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all notifications ({notifications.length})
          </Link>
        </div>
      )}
    </div>
  );
}