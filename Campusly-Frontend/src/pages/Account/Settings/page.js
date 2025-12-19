import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosClient from '../../../config/axios';
import { toast } from 'react-toastify';

export default function UserSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notifications');
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      societyUpdates: true
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false
    }
  });

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    fetchSettings();
    return () => cancelAnimationFrame(id);
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await AxiosClient.get('/users/profile');
      if (response.status === 200) {
        const user = response.data.data;
        setSettings({
          notifications: user.Notifications || settings.notifications,
          privacy: user.Privacy || settings.privacy
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleNotificationChange = async (field, value) => {
    const newNotifications = { ...settings.notifications, [field]: value };
    setSettings(prev => ({ ...prev, notifications: newNotifications }));

    try {
      await AxiosClient.put('/users/profile', {
        notifications: newNotifications
      });
      toast.success('Settings updated');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const handlePrivacyChange = async (field, value) => {
    const newPrivacy = { ...settings.privacy, [field]: value };
    setSettings(prev => ({ ...prev, privacy: newPrivacy }));

    try {
      await AxiosClient.put('/users/profile', {
        privacy: newPrivacy
      });
      toast.success('Settings updated');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your notifications and privacy preferences</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
                  <div className="space-y-4">
                    <SettingToggle
                      label="Email Notifications"
                      description="Receive email notifications for important updates"
                      checked={settings.notifications.emailNotifications}
                      onChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                    />
                    <SettingToggle
                      label="Society Updates"
                      description="Get notified about updates from societies you're a member of"
                      checked={settings.notifications.societyUpdates}
                      onChange={(checked) => handleNotificationChange('societyUpdates', checked)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h2>

                  {/* Profile Visibility */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Profile Visibility
                    </label>
                    <div className="space-y-3">
                      {[
                        { value: 'public', label: 'Public', description: 'Anyone can view your profile' },
                        { value: 'members', label: 'Society Members', description: 'Only members of your societies can view' },
                        { value: 'private', label: 'Private', description: 'Only you can view your profile' }
                      ].map(option => (
                        <label key={option.value} className="flex items-start cursor-pointer">
                          <input
                            type="radio"
                            name="profileVisibility"
                            value={option.value}
                            checked={settings.privacy.profileVisibility === option.value}
                            onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                            className="mt-1 mr-3"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Contact Information Visibility */}
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h3>
                    <SettingToggle
                      label="Show Email on Profile"
                      description="Display your email address on your public profile"
                      checked={settings.privacy.showEmail}
                      onChange={(checked) => handlePrivacyChange('showEmail', checked)}
                    />
                    <SettingToggle
                      label="Show Phone Number on Profile"
                      description="Display your phone number on your public profile"
                      checked={settings.privacy.showPhone}
                      onChange={(checked) => handlePrivacyChange('showPhone', checked)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingToggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <h4 className="text-sm font-medium text-gray-900">{label}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
}
