import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SocietyNav from './SocietyNav';
import { useAuth } from '../../../context/AuthContext';
import AxiosClient from '../../../config/axios';
import { useSocietyMembership } from '../../../context/MembershipContext';
import TransferOwnershipModal from '../../../shared/components/TransferOwnershipModal';
import { toast } from 'react-toastify';

const societyDetailsCache = new Map();
const joinStatusCache = new Map();

export default function SocietyHeader({ societyId, showJoinButton = false, actionButton }) {
  const cacheDetails = societyDetailsCache.get(societyId);
  const cacheJoin = joinStatusCache.get(societyId);
  const [details, setDetails] = useState(cacheDetails || {});
  const { isAuthenticated } = useAuth();
  const [joinRequested, setJoinRequested] = useState(Boolean(cacheJoin));
  const [mounted, setMounted] = useState(Boolean(cacheDetails));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const { user } = useAuth();
  const fetchedRef = useRef(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { isMember, clearMembership } = useSocietyMembership(id);
  const defaultImage = 'https://img.freepik.com/free-vector/multicultural-people-standing-together_74855-6583.jpg';

  const getSocietyDetails = async () => {
    try {
      const response = await AxiosClient.get('/societies/info', {
        params: {
          society_id: societyId
        },
      });
      if (response.status === 200) {
        societyDetailsCache.set(societyId, response.data.data);
        setDetails(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching society details:', error);
    }
  };

  const checkJoinRequest = async () => {
    try {
      const response = await AxiosClient.get('/societies/requests/check', {
        params: { society_id: societyId },
      });
      if (response.status === 200 && response.data.data === "pending") {
        joinStatusCache.set(societyId, true);
        setJoinRequested(true);
      }
    } catch (error) {
      console.error('Error fetching society details:', error);
    }
  };

  const handleJoinSociety = async () => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const response = await AxiosClient.post("/societies/requests", { society_id: societyId });
      if (response.status === 201) {
        if (response.data.data?.auto_approved) {
          window.location.reload();
        } else {
          joinStatusCache.set(societyId, true);
          setJoinRequested(true);
        }
      }
    } catch (error) {
      console.error('Failed to request join:', error);
    }
  };

  const handleLeaveSociety = async () => {
    if (!isAuthenticated) {
      return;
    }

    if (details?.User === user?.ID) {
      setShowTransferModal(true);
      return;
    }

    try {
      const response = await AxiosClient.post("/societies/leave", { society_id: societyId });
      if (response.status === 200) {
        clearMembership(societyId);
        navigate('/societies');
      }
    } catch (error) {
      console.error('Failed to leave society:', error);
      toast.error(error.response?.data?.error_message || "Failed to leave society.");
    }
  };

  useEffect(() => {
    if (!cacheDetails && !fetchedRef.current) {
      fetchedRef.current = true;
      getSocietyDetails();
    }
    if (isAuthenticated && cacheJoin !== true) {
      checkJoinRequest();
    }
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, [societyId, isAuthenticated]);

  return (
    <>
      {/* Cover Section */}
      <div className={`relative h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-purple-300/20 rounded-full blur-lg"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex items-end pb-6">
          <div className="flex items-end space-x-4">
            <div className="w-24 h-24 bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-white relative group z-20">
              <img
                src={details.Image || defaultImage}
                alt={details.Name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = defaultImage; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-white pb-2 flex-1 z-20">
              <h1 className="text-3xl font-bold mb-2">{details.Name}</h1>
              <p className="text-base opacity-90 mb-3 whitespace-pre-line line-clamp-2">{details.Description}</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">{details.Category}</span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {details.Member_Count || 0} members
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile content card */}
      <div className="relative -mt-4 px-4 pb-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Society Stats */}
              <div className="grid grid-cols-3 gap-4">
                {/* Members */}
                <div className="text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{details.Member_Count || 0}</div>
                  <div className="text-xs text-gray-600">Members</div>
                </div>
                {/* Events */}
                <div className="text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{details.Event_Count || 0}</div>
                  <div className="text-xs text-gray-600">Events</div>
                </div>
                {/* Posts */}
                <div className="text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{details.Post_Count || 0}</div>
                  <div className="text-xs text-gray-600">Posts</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 relative">
                {actionButton}

                {showJoinButton && isAuthenticated && (
                  <button
                    onClick={handleJoinSociety}
                    disabled={joinRequested}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${joinRequested
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                      }`}
                  >
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {joinRequested ? 'Request Sent' : 'Join Society'}
                  </button>
                )}

                {/* Dropdown */}
                {isAuthenticated && isMember && (
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-md flex items-center gap-1"
                    >
                      Actions
                      <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <button
                          onClick={handleLeaveSociety}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          Leave Society
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4">
          <SocietyNav societyId={societyId} />
        </div>
      </div>

      <TransferOwnershipModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        societyId={societyId}
        onTransferSuccess={() => {
          getSocietyDetails(); // Refresh details to show new owner
          setShowTransferModal(false);
          // Optional: automatically leave after transfer? Or ask user to click leave again?
          // For now, let's just refresh. The user can click leave again and it will work immediately since they aren't owner anymore.
          toast.info("Ownership transferred. You can now leave the society.");
        }}
      />
    </>
  );
}
