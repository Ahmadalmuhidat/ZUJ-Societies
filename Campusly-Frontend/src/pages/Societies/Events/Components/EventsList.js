import React, { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useSocietyMembership } from '../../../../context/MembershipContext';
import { Link } from 'react-router-dom';
import AxiosClient from '../../../../config/axios';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../../../../shared/components/DeleteConfirmationModal';
import { getEventStatus } from '../../../../utils/dateUtils';

export default function EventsList({ id, events, searchTerm, filter, isMember, onEventDeleted }) {
  const { isAuthenticated, user } = useAuth();
  const { isAdmin } = useSocietyMembership(id);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const defaultEventImage = 'https://img.freepik.com/free-vector/multicultural-people-standing-together_74855-6583.jpg';

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = events
    .filter(event => {
      const status = getEventStatus(event);
      // If there's a search term, we show all events that match the search term
      // otherwise we follow the filter
      const matchesFilter = searchTerm ? true : (filter === 'all' || status === filter);
      const matchesSearch = event.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.Description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (filter === 'upcoming') {
        return new Date(a.Date).getTime() - new Date(b.Date).getTime();
      }
      return new Date(b.Date).getTime() - new Date(a.Date).getTime();
    });


  const canDeleteEvent = (event) => {
    if (!isAuthenticated || !user) return false;
    return event.User === user.ID || isAdmin;
  };

  const handleDeleteClick = (event, e) => {
    e.preventDefault();
    e.stopPropagation();
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      setIsDeleting(true);

      const response = await AxiosClient.delete("/events", {
        params: {
          event_id: eventToDelete.ID
        }
      });

      if (response.status === 200) {
        toast.success("Event deleted successfully");
        setShowDeleteModal(false);
        setEventToDelete(null);
        if (onEventDeleted) {
          onEventDeleted(eventToDelete.ID);
        }
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {filteredEvents.map(event => (
          <div key={event.ID} className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="md:flex">
              <div className="md:w-1/3 relative">
                <img
                  src={event.Image || defaultEventImage}
                  alt={event.Title}
                  className="w-full h-48 md:h-full object-cover"
                  onError={e => { e.target.src = `https://via.placeholder.com/400x300/3B82F6/ffffff?text=${encodeURIComponent(event.Title)}` }}
                />
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold capitalize shadow-lg backdrop-blur-sm ${getStatusBadge(getEventStatus(event))}`}>
                    {getEventStatus(event)}
                  </span>
                </div>
                {canDeleteEvent(event) && (
                  <button
                    onClick={(e) => handleDeleteClick(event, e)}
                    className="absolute top-4 left-4 p-2 bg-red-500 text-white hover:bg-red-600 rounded-xl transition-colors shadow-lg backdrop-blur-sm"
                    title="Delete event"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="md:w-2/3 p-5">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{event.Title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{event.Description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="font-medium">{formatDate(event.Date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="font-medium">{formatTime(event.Time)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="font-medium truncate">{event.Location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="font-medium truncate">{event.Organizer}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Link to={`/events/${event.ID}`}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No events found</h3>
          <p className="text-sm text-gray-500 mb-6">
            {searchTerm ? 'Try adjusting your search criteria.' : 'No events match the selected filter.'}
          </p>
          {isAuthenticated && isMember && isAdmin && (
            <Link
              to={`/societies/${id}/events/new`}
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Event
            </Link>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setEventToDelete(null);
        }}
        onConfirm={handleDeleteEvent}
        title="Delete Event"
        message={`Are you sure you want to delete "${eventToDelete?.Title}"? This action cannot be undone.`}
        confirmText="Delete Event"
        isLoading={isDeleting}
      />
    </>
  );
}
