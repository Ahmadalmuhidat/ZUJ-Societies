import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SocietyHeader from '../Components/SocietyHeader';
import AxiosClient from '../../../config/axios';
import { useSocietyMembership } from '../../../context/MembershipContext';
import Timeline from './Components/MainContent';

export default function SocietyDetail() {
  const { id } = useParams();
  const { isMember, canPost, canCreateEvents } = useSocietyMembership(id);
  const [showModal, setShowModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [posts, setPosts] = useState([]);
  const [mounted, setMounted] = useState(false);

  const getPostsBySociety = async () => {
    try {
      const response = await AxiosClient.get("/societies/posts", {
        params: { society_id: id },
      });

      if (response.status === 200) {
        setPosts(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.ID !== deletedPostId));
  };

  const handleCreatePost = async () => {
    try {
      const response = await AxiosClient.post("/posts", {
        content: newPostContent,
        image: newPostImage || '',
        society_id: id,
      });

      if (response.status === 201) {
        setShowModal(false);
        setNewPostContent('');
        setNewPostImage('');
        getPostsBySociety();
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  useEffect(() => {
    getPostsBySociety();
    const idAnim = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(idAnim);
  }, [id]);

  return (
    <>
      <SocietyHeader
        societyId={id || '1'}
        showJoinButton={!isMember}
        actionButton={
          <div className="flex gap-3">
            {canCreateEvents() && (
              <Link
                to={`/societies/${id}/events/new`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Create Event
              </Link>
            )}
            {canPost() && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Create Post
              </button>
            )}
          </div>
        }
      />

      <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Timeline
            id={id}
            posts={posts}
            getPostsBySociety={getPostsBySociety}
            onPostDeleted={handlePostDeleted}
            setShowModal={setShowModal}
          />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-lg border border-white/20 relative">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Create a New Post
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <textarea
                  placeholder="What's on your mind?"
                  className="w-full border border-gray-300 p-4 rounded-xl resize-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Image URL (optional)"
                  className="w-full border border-gray-300 p-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                  value={newPostImage}
                  onChange={(e) => setNewPostImage(e.target.value)}
                />
              </div>

              {newPostImage && (
                <div className="mb-6 relative">
                  <img
                    src={newPostImage}
                    alt="Preview"
                    className="w-full rounded-xl max-h-64 object-cover shadow-lg"
                  />
                  <button
                    onClick={() => setNewPostImage('')}
                    className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
