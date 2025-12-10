import AxiosClient from '../../../config/axios';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useSocietyMembership } from '../../../context/MembershipContext';
import DeleteConfirmationModal from '../../../shared/components/DeleteConfirmationModal';
import { parseEventDate } from '../../../utils/dateUtils';

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [event, setEvent] = useState(null);
  const { isAdmin } = useSocietyMembership(event?.Society);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [eventStats, setEventStats] = useState({ attendees: 0, shares: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const defaultImage = 'https://img.freepik.com/free-vector/multicultural-people-standing-together_74855-6583.jpg';

  const getEventInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await AxiosClient.get("/events/info", {
        params: {
          event_id: id,
        },
      });

      if (response.status === 200) {
        setEvent(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch event info:", error);
      setError(error.message || 'Something went wrong.');
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  const getEventStats = async () => {
    try {
      setLoadingStats(true);
      const response = await AxiosClient.get("/events/stats", {
        params: { event_id: id }
      });
      if (response.status === 200) {
        setEventStats(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch event stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const getUserEventStatus = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await AxiosClient.get("/users/events/status", {
        params: {
          event_id: id
        }
      });
      if (response.status === 200) {
        const { attendance } = response.data.data;
        setIsAttending(attendance === 'attending');
      }
    } catch (error) {
      console.error("Failed to fetch user event status:", error);
    }
  };

  const toggleAttendance = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const newStatus = isAttending ? 'not_attending' : 'attending';
      
      const response = await AxiosClient.post("/events/attendance", {
        event_id: id,
        status: newStatus
      });
      
      if (response.status === 200) {
        setIsAttending(!isAttending);
        getEventStats(); 
      }
    } catch (error) {
      console.error("Failed to toggle attendance:", error);
    }
  };

  const recordShare = async () => {
    if (!isAuthenticated) return;

    try {
      await AxiosClient.post("/events/share", {
        event_id: id,
      });
      getEventStats(); 
    } catch (error) {
      console.error("Failed to record share:", error);
    }
  };
  
  const canDelete = useMemo(() => {
    if (!isAuthenticated || !event || !user) return false;
    return event.User === user.ID || isAdmin;
  }, [isAuthenticated, event, user, isAdmin]);

  const handleDeleteEvent = async () => {
    try {
      setIsDeleting(true);
      
      const response = await AxiosClient.delete("/events", {
        params: { 
          event_id: event.ID
        }
      });

      if (response.status === 200) {
        toast.success("Event deleted successfully");
        navigate("/events");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    getEventInfo();
    getEventStats();
    getUserEventStatus();
    const idAnim = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(idAnim);
  }, [id, isAuthenticated]);

  
  const eventDate = event?.Date;
  const eventTime = event?.Time;
  const eventLocation = event?.Location;
  const eventTitle = event?.Title;
  const eventDescription = event?.Description;

  const formattedDate = useMemo(() => {
    const parsed = parseEventDate(eventDate, eventTime);
    if (parsed) {
      return parsed.toLocaleString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    const raw = [eventDate, eventTime].filter(Boolean).join(' ');
    return raw || 'TBD';
  }, [eventDate, eventTime]);

  const mapUrl = useMemo(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventLocation || '')}`, [eventLocation]);
  const shareData = useMemo(() => ({
    title: eventTitle || 'Event',
    text: (eventDescription && eventDescription.slice(0, 140)) || 'Check out this event',
    url: typeof window !== 'undefined' ? window.location.href : ''
  }), [eventTitle, eventDescription]);

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero Section Skeleton */}
        <div className="relative">
          <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-200 animate-pulse"></div>
          
          {/* Navigation Skeleton */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
              <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-white/90 backdrop-blur-sm">
                <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="p-2 rounded-lg bg-white/90 backdrop-blur-sm">
                <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Title Overlay Skeleton */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-20 bg-white/30 rounded-full animate-pulse"></div>
                <div className="h-4 w-32 bg-white/30 rounded animate-pulse"></div>
              </div>
              <div className="h-12 bg-white/30 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-6 bg-white/30 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Event Details Card Skeleton */}
              <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
                <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 bg-gray-100 rounded-xl animate-pulse">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-28"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description Skeleton */}
              <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
                <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteEvent}
        title="Delete Event"
        message={`Are you sure you want to delete "${event?.Title}"? This action cannot be undone.`}
        confirmText="Delete Event"
        isLoading={isDeleting}
      />
    </div>
  );
}

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">
        {error}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Event not found.
      </div>
    );
  }

  const handleShare = async () => {
    try {
      
      await recordShare();
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Link copied to clipboard');
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
        <img
          src={event.Image || defaultImage}
          alt={event.Title}
          className="w-full h-64 sm:h-80 lg:h-96 object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultImage;
          }}
        />
        
        {/* Navigation */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowShareModal(true)}
              className="p-2 rounded-lg bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white transition-all duration-200 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>

            {/* Delete button - only show if user can delete */}
            {canDelete && (
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="p-2 rounded-lg bg-red-500 backdrop-blur-sm text-white hover:bg-red-600 transition-all duration-200 shadow-lg"
                title="Delete event"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {event.Category}
              </span>
              <span className="text-white/80 text-sm">
                {formattedDate}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              {event.Title}
            </h1>
            <p className="text-white/90 text-lg sm:text-xl drop-shadow-md">
              📍 {event.Location}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details Card */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Event Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm">Date & Time</h3>
                      <p className="text-gray-700 text-sm">{formattedDate}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm">Location</h3>
                      <p className="text-gray-700 text-sm mb-2">{event.Location}</p>
                      <a 
                        href={mapUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-green-600 hover:text-green-800 text-xs font-medium inline-flex items-center gap-1"
                      >
                        Get Directions
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm">Category</h3>
                      <p className="text-gray-700 text-sm">{event.Category}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm">Organizer</h3>
                      <p className="text-gray-700 text-sm">{event.Organizer || 'Campusly'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                About this Event
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                  {event.Description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                Event Actions
              </h3>
              <div className="space-y-3">
                {isAuthenticated ? (
                  <>
                    <button 
                      onClick={toggleAttendance}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                        isAttending
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg'
                      }`}
                    >
                      {isAttending ? '✓ Attending' : 'Attend Event'}
                    </button>
                    <button 
                      onClick={() => setShowShareModal(true)}
                      className="w-full py-3 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold transition-all duration-200"
                    >
                      Share Event
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 font-semibold text-center transition-all duration-200 shadow-lg"
                  >
                    Login to Attend
                  </Link>
                )}
              </div>
            </div>

            {/* Event Stats */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                Event Stats
              </h3>
              {loadingStats ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <span className="text-gray-700 font-medium text-sm">Attendees</span>
                    <span className="font-bold text-gray-900 text-lg">{eventStats.attendees}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <span className="text-gray-700 font-medium text-sm">Shares</span>
                    <span className="font-bold text-gray-900 text-lg">{eventStats.shares}</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                Share Event
              </h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={handleShare}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 font-semibold transition-all duration-200 shadow-lg"
              >
                Share via Native Share
              </button>
              <button 
                onClick={async () => {
                  await recordShare();
                  navigator.clipboard.writeText(shareData.url);
                  toast.success('Link copied to clipboard!');
                  setShowShareModal(false);
                }}
                className="w-full py-3 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold transition-all duration-200"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
