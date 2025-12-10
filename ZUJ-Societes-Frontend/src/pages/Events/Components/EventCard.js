import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useSocietyMembership } from '../../../context/MembershipContext';
import AxiosClient from '../../../config/axios';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../../../shared/components/DeleteConfirmationModal';
import { formatEventDate } from '../../../utils/dateUtils';

export default function EventCard({ onEventDeleted, ...event }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isAdmin } = useSocietyMembership(event.Society);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const defaultImage = 'https://img.freepik.com/free-vector/multicultural-people-standing-together_74855-6583.jpg';

  const formattedDate = formatEventDate(event.Date);

  const handleClick = () => {
    navigate(`/events/${event.ID}`);
  };

  const canDelete = isAuthenticated && (
    event.User === user?.ID || 
    isAdmin 
  );

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await AxiosClient.delete("/events", {
        params: { 
          event_id: event.ID
        }
      });

      if (response.status === 200) {
        toast.success("Event deleted successfully");
        setShowDeleteModal(false);
        if (onEventDeleted) {
          onEventDeleted(event.ID);
        }
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); 
    setShowDeleteModal(true);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-xl group transition-all duration-500 transform hover:-translate-y-2 cursor-pointer mb-6 relative border border-gray-100"
      >
        {/* Delete button */}
        {canDelete && (
          <button
            onClick={handleDeleteClick}
            className="absolute top-4 right-4 z-10 p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg backdrop-blur-sm"
            title="Delete event"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}

        <div className="relative h-52 w-full overflow-hidden">
          <img 
            src={event.Image || defaultImage}
            alt={event.Title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{event.Category}</span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-primary-500 to-blue-500 rounded-xl px-3 py-2 text-white min-w-[75px] shadow-lg">
              <span className="text-xs font-semibold opacity-90">{event.Time}</span>
              <span className="text-xs font-bold">{formattedDate}</span>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 mb-2">{event.Title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">{event.Description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">{event.Location}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium">{event.Category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${event.Title}"? This action cannot be undone.`}
        confirmText="Delete Event"
        isLoading={isDeleting}
      />
    </>
  );
}
