import React from 'react';

export default function General({ settings, handleGeneralChange }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h3>

      <div className="space-y-6">
        <div>
          <label htmlFor="society-name" className="block text-sm font-medium text-gray-700 mb-2">
            Society Name
          </label>
          <input
            type="text"
            id="society-name"
            value={settings.general.name}
            onChange={(e) => handleGeneralChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={settings.general.description}
            onChange={(e) => handleGeneralChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={settings.general.category}
              onChange={(e) => handleGeneralChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Technology">Technology</option>
              <option value="Science">Science</option>
              <option value="Arts">Arts</option>
              <option value="Sports">Sports</option>
              <option value="Academic">Academic</option>
              <option value="Social">Social</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
