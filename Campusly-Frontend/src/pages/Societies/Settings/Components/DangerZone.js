import React from 'react';

export default function DangerZone({ leaveSociety, setShowDeleteConfirm, isOwner }) {
  if (!isOwner) return null; // Safety check

  return (
    <div>
      <h3 className="text-lg font-semibold text-red-600 mb-6">Danger Zone</h3>

      <div className="space-y-6">
        <div className="border border-red-200 rounded-lg p-6 bg-red-50">
          <h4 className="text-lg font-medium text-red-900 mb-2">Delete Society</h4>
          <p className="text-sm text-red-700 mb-4">
            Permanently delete this society and all associated data. This action cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Delete Society
          </button>
        </div>
      </div>
    </div>
  );
}
