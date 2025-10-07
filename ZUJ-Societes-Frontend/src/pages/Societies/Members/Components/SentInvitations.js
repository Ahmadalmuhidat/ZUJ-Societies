import React, { useState, useEffect } from 'react';
import AxiosClient from '../../../../config/axios';
import { toast } from 'react-toastify';

export default function SentInvitations({ societyId, isOpen, onClose }) {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSentInvitations = async () => {
    try {
      setLoading(true);
      const response = await AxiosClient.get('/societies/get_sent_invitations', {
        params: {
          society_id: societyId,
          token: localStorage.getItem('token') || sessionStorage.getItem('token'),
        },
      });

      if (response.status === 200) {
        setInvitations(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching sent invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelInvitation = async (invitationId) => {
    try {
      const response = await AxiosClient.delete('/societies/cancel_invitation', {
        params: {
          invitation_id: invitationId,
          token: localStorage.getItem('token') || sessionStorage.getItem('token'),
        },
      });

      if (response.status === 200) {
        toast.success('Invitation cancelled');
        fetchSentInvitations();
      }
    } catch (error) {
      console.error('Error cancelling invitation:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSentInvitations();
    }
  }, [isOpen, societyId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Sent Invitations</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-500">No invitations sent yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <div key={invitation.ID} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img
                      src={invitation.InviteePhoto || 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png'}
                      alt={invitation.InviteeName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{invitation.InviteeName}</p>
                      <p className="text-sm text-gray-500">{invitation.InviteeEmail}</p>
                      <p className="text-xs text-gray-400">
                        Sent {new Date(invitation.CreatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      invitation.Status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : invitation.Status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {invitation.Status}
                    </span>
                    {invitation.Status === 'pending' && (
                      <button
                        onClick={() => cancelInvitation(invitation.ID)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Cancel invitation"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

