import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import AxiosClient from '../../config/axios';

export default function NotificationsPage() {
  const [invitationResponses, setInvitationResponses] = useState({});

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  useEffect(() => {
    const fetchInvitationStatuses = async () => {
      const invitations = notifications.filter(notification => notification.Type === 'invitation');
      const statuses = {};

      for (const notif of invitations) {
        if (notif.Data?.inviteId) {
          try {
            const response = await AxiosClient.post('/societies/members/invites/check-status', {
              invitation_id: notif.Data.inviteId
            }, { skipToast: true });
            if (response.data?.status) {
              statuses[notif.Data.inviteId] = response.data.status;
            }
          } catch (error) {
            console.log('Could not fetch status for invitation:', notif.Data.inviteId);
          }
        }
      }

      setInvitationResponses(statuses);
    };

    if (notifications.length > 0) {
      fetchInvitationStatuses();
    }
  }, [notifications]);

  const getNotificationIcon = (type) => {
    const icons = {
      event: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      society: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      post: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      comment: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      like: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      join_request: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
      join_approved: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      join_rejected: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
      new_event: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    };
    return icons[type] || icons.post;
  };

  const getNotificationColor = (type) => {
    const colors = {
      event: 'bg-green-100 text-green-600',
      society: 'bg-blue-100 text-blue-600',
      post: 'bg-purple-100 text-purple-600',
      comment: 'bg-yellow-100 text-yellow-600',
      like: 'bg-red-100 text-red-600',
      join_request: 'bg-orange-100 text-orange-600',
      join_approved: 'bg-green-100 text-green-600',
      join_rejected: 'bg-red-100 text-red-600',
      new_event: 'bg-emerald-100 text-emerald-600',
      invitation: 'bg-indigo-100 text-indigo-600'
    };
    return colors[type] || colors.post;
  };

  const getNotificationCardStyle = (type) => {
    const styles = {
      event: 'bg-green-50 border-green-200 hover:bg-green-100',
      society: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      post: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      comment: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
      like: 'bg-red-50 border-red-200 hover:bg-red-100',
      join_request: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      join_approved: 'bg-green-50 border-green-200 hover:bg-green-100',
      join_rejected: 'bg-red-50 border-red-200 hover:bg-red-100',
      new_event: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
      invitation: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
    };
    return styles[type] || 'bg-white border-gray-100 hover:bg-gray-50';
  };

  const getNotificationBorderAccent = (type) => {
    const borders = {
      event: 'border-l-green-500',
      society: 'border-l-blue-500',
      post: 'border-l-purple-500',
      comment: 'border-l-yellow-500',
      like: 'border-l-red-500',
      join_request: 'border-l-orange-500',
      join_approved: 'border-l-green-500',
      join_rejected: 'border-l-red-500',
      new_event: 'border-l-emerald-500',
      invitation: 'border-l-indigo-500'
    };
    return borders[type] || 'border-l-blue-500';
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return time.toLocaleDateString();
  };

  const acceptInvitation = async (inviteId) => {
    setInvitationResponses(prev => ({
      ...prev,
      [inviteId]: "accepted"
    }));

    try {
      await AxiosClient.post("/societies/members/invites/respond", {
        invitation_id: inviteId,
        response: "accept"
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      markAsRead(inviteId);
    }
  };

  const rejectInvitation = async (inviteId) => {
    setInvitationResponses(prev => ({
      ...prev,
      [inviteId]: "rejected"
    }));

    try {
      await AxiosClient.post("/societies/members/invites/respond", {
        invitation_id: inviteId,
        response: "decline"
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      markAsRead(inviteId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 1 1 15 0v5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">Stay updated with real-time notifications</p>
              </div>
            </div>
          </div>

          {/* Stats and Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{notifications.length}</div>
                  <div className="text-sm text-gray-600">Total Notifications</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
                  <div className="text-sm text-gray-600">Unread</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</div>
                  <div className="text-sm text-gray-600">Read</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    Mark All Read
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 1 1 15 0v5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications yet</h3>
              <p className="text-gray-600 mb-4">You'll see real-time notifications here when they arrive.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.ID || notification.id}
                className={`rounded-2xl shadow-card border-2 overflow-hidden transition-all duration-300 hover:shadow-xl ${getNotificationCardStyle(notification.Type || notification.type)
                  } ${!(notification.Read)
                    ? `border-l-4 ${getNotificationBorderAccent(notification.Type || notification.type)}`
                    : ''
                  }`}
              >
                {notification.Type === 'invitation' ? (
                  <div className="p-6">
                    {(() => {
                      const localStatus = invitationResponses[notification.Data.inviteId];
                      const dataStatus = notification.Data?.status;
                      const status = localStatus || dataStatus;

                      return (
                        <div className="flex items-start space-x-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getNotificationIcon(notification.type)} />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-gray-900">{notification.Title || notification.title}</h3>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">{formatTime(notification.CreatedAt || notification.time)}</span>
                                {!(notification.Read) && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-600 mt-2">{notification.Message || notification.message}</p>
                            <div className="mt-4 flex space-x-3">
                              {status === "accepted" || status === "accept" ? (
                                <div className="px-4 py-2 bg-green-100 text-green-600 rounded-lg text-sm font-medium">
                                  Invitation Accepted ✓
                                </div>
                              ) : status === "rejected" || status === "decline" ? (
                                <div className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium">
                                  Invitation Rejected ✕
                                </div>
                              ) : (
                                <>
                                  <button
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                                    onClick={() => acceptInvitation(notification.Data.inviteId)}
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                    onClick={() => rejectInvitation(notification.Data.inviteId)}
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                            </div>

                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div
                    className="p-6 cursor-pointer transition-colors"
                    onClick={() => markAsRead(notification.ID || notification.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getNotificationIcon(notification.type)} />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">{notification.Title || notification.title}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{formatTime(notification.CreatedAt || notification.time)}</span>
                            {!(notification.Read) && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 mt-2">{notification.Message || notification.message}</p>
                        {notification.data && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {notification.data.postId && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                Post ID: {notification.data.postId}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
