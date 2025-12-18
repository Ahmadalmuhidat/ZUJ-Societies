import React, { useState, useEffect } from 'react';
import AxiosClient from '../../config/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function TransferOwnershipModal({ isOpen, onClose, societyId, onTransferSuccess }) {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transferring, setTransferring] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
    }
  }, [isOpen]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await AxiosClient.get('/societies/members', {
        params: { society_id: societyId }
      });
      if (response.status === 200) {
        setMembers(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
      toast.error("Failed to load members.");
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedMember) return;

    try {
      setTransferring(true);
      const response = await AxiosClient.post('/societies/ownership', {
        society_id: societyId,
        new_owner_id: selectedMember.ID
      });

      if (response.status === 200) {
        toast.success("Ownership transferred successfully!");
        onTransferSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Transfer failed:", error);
      toast.error(error.response?.data?.error_message || "Failed to transfer ownership.");
    } finally {
      setTransferring(false);
    }
  };

  const filteredMembers = members.filter(member => {
    if (member.ID === user?.ID) return false;
    return (
      member.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.Email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Transfer Ownership</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-yellow-800">
                You must transfer ownership to another member before you can leave the society.
                Once transferred, you will lose owner privileges but remain an admin.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading members...</div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No members found</div>
            ) : (
              filteredMembers.map(member => (
                <button
                  key={member.ID}
                  onClick={() => setSelectedMember(member)}
                  className={`w-full flex items-center p-3 rounded-xl transition-all ${selectedMember?.ID === member.ID
                    ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500'
                    : 'hover:bg-gray-50 border border-transparent'
                    }`}
                >
                  <img
                    src={member.Photo || 'https://via.placeholder.com/40'}
                    alt={member.Name}
                    className="w-10 h-10 rounded-full object-cover bg-gray-200"
                  />
                  <div className="ml-3 text-left">
                    <p className="font-medium text-gray-900">{member.Name}</p>
                    <p className="text-xs text-gray-500">{member.Role}</p>
                  </div>
                  {selectedMember?.ID === member.ID && (
                    <svg className="w-5 h-5 text-blue-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            disabled={!selectedMember || transferring}
            className={`px-6 py-2 font-medium text-white rounded-lg shadow-lg transition-all ${!selectedMember || transferring
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
          >
            {transferring ? 'Transferring...' : 'Transfer Ownership'}
          </button>
        </div>
      </div>
    </div>
  );
}
