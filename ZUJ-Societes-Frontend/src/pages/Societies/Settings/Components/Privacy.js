import React from 'react';

export default function Privacy({ settings, handlePrivacyChange }) {
  const visibilityOptions = [
    { value: 'public', label: 'Public', description: 'Anyone can find and view this society' },
    { value: 'private', label: 'Private', description: 'Only members can view this society' },
    { value: 'invite-only', label: 'Invite Only', description: 'Only invited users can join' }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Auto-saved
        </div>
      </div>

      <div className="space-y-6">
        {/* Society Visibility */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Society Visibility</label>
          <div className="space-y-3">
            {visibilityOptions.map((option) => (
              <label key={option.value} className="flex items-start">
                <input
                  type="radio"
                  name="visibility"
                  value={option.value}
                  checked={settings.privacy.visibility === option.value}
                  onChange={(e) => handlePrivacyChange('visibility', e.target.value)}
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

        {/* Other Privacy Toggles */}
        <div className="space-y-4">
          <PrivacyToggle
            label="Require approval for new members"
            description="New join requests must be approved by admins"
            checked={settings.privacy.joinApproval}
            onChange={(checked) => handlePrivacyChange('joinApproval', checked)}
          />
          <PrivacyToggle
            label="Show member list publicly"
            description="Allow non-members to see the member list"
            checked={settings.privacy.memberListVisible}
            onChange={(checked) => handlePrivacyChange('memberListVisible', checked)}
          />
          <PrivacyToggle
            label="Show events publicly"
            description="Allow non-members to see society events"
            checked={settings.privacy.eventsVisible}
            onChange={(checked) => handlePrivacyChange('eventsVisible', checked)}
          />
        </div>
      </div>
    </div>
  );
}

function PrivacyToggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
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
