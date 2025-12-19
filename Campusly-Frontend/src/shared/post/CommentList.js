import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AxiosClient from '../../config/axios';
import { useAuth } from '../../context/AuthContext';

export default function CommentList({ comments, postId, onCommentDeleted }) {
  const { isAuthenticated, user } = useAuth();
  const [visibleCount, setVisibleCount] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewMore = () => setVisibleCount((prev) => prev + 3);

  const displayedComments = comments.slice(0, visibleCount);
  const hasMore = visibleCount < comments.length;

  const handleDeleteComment = async () => {
    if (!commentToDelete || !isAuthenticated) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const response = await AxiosClient.delete('/comments', {
        params: {
          comment_id: commentToDelete.ID
        },
      });

      if (response.status === 200) {
        toast.success('Comment deleted successfully.');
        if (onCommentDeleted) {
          onCommentDeleted(commentToDelete.ID);
        }
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setCommentToDelete(null);
    }
  };

  const openDeleteModal = (comment) => {
    setCommentToDelete(comment);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };
  
  const showDeleteCommentButton = (comment) => {    
    return isAuthenticated && user && (user.ID === comment.User_ID || user.ID === comment.User || user.Role === 'admin');
  };

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      {/* Delete Comment Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative z-[61]">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Delete Comment</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteComment}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Comment'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`space-y-4 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        {displayedComments.map((comment) => (
          <div key={comment.id} className="flex">
            <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={comment.User_Photo || 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png'}
                alt={comment.User_Name}
                className="w-9 h-9 rounded-full object-cover"
              />
            </div>
            <div className="ml-2 bg-gray-100 rounded-lg p-3 flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-sm">{comment.User_Name}</h4>
                {showDeleteCommentButton(comment) && (
                  <button
                    onClick={() => openDeleteModal(comment)}
                    className="text-red-500 hover:text-red-600 ml-2"
                    title="Delete comment"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="text-sm mt-1 text-gray-900 font-medium">{comment.Content}</p>
            </div>
          </div>
        ))}

        {hasMore && (
          <button
            onClick={handleViewMore}
            className="text-blue-600 hover:underline text-sm mt-2"
          >
            View more comments
          </button>
        )}
      </div>
    </>
  );
}
