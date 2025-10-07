import React, { useState, useEffect } from 'react';
import AxiosClient from '../../../../config/axios';
import { toast } from 'react-toastify';

export default function InviteModal({ isOpen, onClose, societyId, onInviteSent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');

  
  const searchUsers = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await AxiosClient.get('/users/search_users', {
        params: {
          query: query,
        },
      });

      if (response.status === 200) {
        setSearchResults(response.data.data || []);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleInvite = async () => {
    if (!selectedUser) return;

    try {
      setIsInviting(true);
      const response = await AxiosClient.post('/societies/invite_member', {
        SocietyID: societyId,
        InviteeID: selectedUser.ID,
        token: localStorage.getItem('token') || sessionStorage.getItem('token'),
      });

      if (response.status === 201) {
        toast.success(`Invitation sent to ${selectedUser.Name}`);
        setSelectedUser(null);
        setSearchTerm('');
        setInviteMessage('');
        if (onInviteSent) {
          onInviteSent();
        }
        onClose();
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
    } finally {
      setIsInviting(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchTerm(user.Name);
    setSearchResults([]);
  };

  const handleClose = () => {
    setSelectedUser(null);
    setSearchTerm('');
    setSearchResults([]);
    setInviteMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Invite Member</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* User Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search for a user
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type user name or email..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {isSearching && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl">
                {searchResults.map((user) => (
                  <div
                    key={user.ID}
                    onClick={() => handleUserSelect(user)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.Photo || 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png'}
                        alt={user.Name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user.Name}</p>
                        <p className="text-sm text-gray-500">{user.Email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected User */}
          {selectedUser && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.Photo || 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png'}
                  alt={selectedUser.Name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{selectedUser.Name}</p>
                  <p className="text-sm text-gray-500">{selectedUser.Email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Optional Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Optional message (optional)
            </label>
            <textarea
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              placeholder="Add a personal message to your invitation..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleClose}
              disabled={isInviting}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              disabled={!selectedUser || isInviting}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isInviting ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
