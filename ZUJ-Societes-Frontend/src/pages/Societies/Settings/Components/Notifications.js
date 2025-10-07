import React from 'react';

export default function Notifications({ settings, handleNotificationChange }) {
  const notificationOptions = [
    { key: 'newMemberNotifications', label: 'New member notifications', description: 'Get notified when someone joins the society' },
    { key: 'eventReminders', label: 'Event reminders', description: 'Send reminders about upcoming events' },
    { key: 'weeklyDigest', label: 'Weekly digest', description: 'Send a weekly summary of society activity' },
    { key: 'emailNotifications', label: 'Email notifications', description: 'Send notifications via email' }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Auto-saved
        </div>
      </div>

      <div className="space-y-6">
        {notificationOptions.map((notification) => (
          <div key={notification.key} className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">{notification.label}</h4>
              <p className="text-sm text-gray-600">{notification.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications[notification.key]}
                onChange={(e) => handleNotificationChange(notification.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
