import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AxiosClient from '../../config/axios';
import { useAuth } from '../../context/AuthContext';
import CommentList from './CommentList';
import { formatEventDate } from '../../utils/dateUtils';

export default function PostCard({ post, onPostDeleted }) {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportMessage, setReportMessage] = useState('');
  const [isLiked, setIsLiked] = useState(post.IsLiked || false);
  const [likesCount, setLikesCount] = useState(post.Likes || 0);
  const [mounted, setMounted] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const defaultImage = 'https://img.freepik.com/free-vector/multicultural-people-standing-together_74855-6583.jpg';

  const handleLike = async () => {
    const prevIsLiked = isLiked;

    setIsLiked(!prevIsLiked);
    setLikesCount((prevLikes) =>
      !prevIsLiked ? prevLikes + 1 : Math.max(prevLikes - 1, 0)
    );

    try {
      if (!prevIsLiked) {
        await AxiosClient.post('/posts/like', {
          post_id: post.ID,
        });
      } else {
        await AxiosClient.post('/posts/unlike', {
          post_id: post.ID,
        });
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);

      setIsLiked(prevIsLiked);
      setLikesCount((prevLikes) =>
        prevIsLiked ? prevLikes + 1 : Math.max(prevLikes - 1, 0)
      );
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      return;
    }

    const tempId = Date.now().toString();
    const optimisticComment = {
      id: tempId,
      Content: commentText,
      User_Name: 'You',
      User_Photo: 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png',
    };

    setComments((prev) => [...prev, optimisticComment]);
    setCommentText('');
    setShowComments(true);

    try {
      const response = await AxiosClient.post('/comments', {
        content: commentText,
        post_id: post.ID,
      });

      if (response.status !== 201) {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      setComments((prev) => prev.filter((c) => c.id !== tempId));
    }
  };

  const handleCommentDeleted = (deletedCommentId) => {
    setComments((prev) => prev.filter((comment) => comment.ID !== deletedCommentId));
  };

  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      const response = await AxiosClient.delete('/posts', {
        params: {
          post_id: post.ID,
        },
      });

      if (response.status === 200) {
        toast.success('Post deleted successfully.');
        setShowDeleteModal(false);
        if (onPostDeleted) {
          onPostDeleted(post.ID);
        }
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const toggleComments = () => setShowComments((prev) => !prev);

  const getComments = async () => {
    try {
      setLoadingComments(true);
      const response = await AxiosClient.get('/comments', {
        params: {
          post_id: post.ID,
        },
      });
      if (response.status === 200) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const openReportModal = () => {
    setReportMessage('');
    setShowReportModal(true);
  };

  const closeReportModal = () => setShowReportModal(false);

  const submitReport = async () => {
    if (!reportMessage.trim()) {
      return toast.info('Please enter a report message.');
    }
    try {
      const response = await AxiosClient.post('/posts/report', {
        post_id: post.ID,
        message: reportMessage,
      });

      if (response.status === 200) {
        toast.success('Post reported successfully.');
      }
    } catch (error) {
      console.error(error);
    }
    setShowReportModal(false);
  };

  useEffect(() => {
    getComments();
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-lg font-semibold mb-4">Report Post</h2>
            <textarea
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
              className="w-full h-28 border rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Describe why you are reporting this post..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeReportModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitReport}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Post Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative z-[61]">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Delete Post</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
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
                onClick={handleDeletePost}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Post'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Card */}
      <div className={`bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden mb-8 max-w-2xl mx-auto transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="p-6">
          {/* User Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={post.User_Image || 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png'}
                  alt={post.User_Name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-gray-100"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{post.User_Name}</h3>
                <p className="text-xs text-gray-500">{formatEventDate(post.CreatedAt)}</p>
              </div>
            </div>
            {/* Delete button for post owner */}
            {isAuthenticated && user && user.ID === post.User && (
              <button
                onClick={openDeleteModal}
                className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                title="Delete post"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          {/* Content */}
          <p className="text-gray-800 text-base mb-6 leading-relaxed">{post.Content}</p>

          {/* Image */}
          {post.Image && (
            <div className="rounded-2xl overflow-hidden mb-6 shadow-lg">
              <img
                src={post.Image || defaultImage}
                alt="Post"
                className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultImage;
                }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="mb-6">
            {isAuthenticated ? (
              <div className="flex items-center justify-between text-gray-500 text-sm">
                <div className="flex items-center gap-6">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${isLiked
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                  >
                    <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {likesCount} Likes
                  </button>

                  <button
                    onClick={toggleComments}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {comments.length} Comments
                  </button>

                  <button
                    onClick={openReportModal}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm px-4 py-2 bg-gray-50 rounded-xl">
                {likesCount} Likes • {comments.length} Comments
              </div>
            )}
          </div>

          {/* Comments */}
          {showComments && (
            <div className="border-t border-gray-100 pt-6">
              {loadingComments ? (
                <div className="space-y-4 animate-pulse">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gray-200"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <CommentList comments={comments} postId={post.ID} onCommentDeleted={handleCommentDeleted} />
              )}
              {isAuthenticated && (
                <form onSubmit={handleAddComment} className="mt-6 flex gap-3">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-primary-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-primary-600 hover:to-blue-600 transition-all duration-200 shadow-lg"
                  >
                    Post
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
