import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AxiosClient from '../../../config/axios';
import { SkeletonList } from '../../../shared/components/LoadingSpinner';

export default function PublicProfile() {
  const { id } = useParams();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [societies, setSocieties] = useState([]);
  const [posts, setPosts] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [p, s, po, ae] = await Promise.all([
        AxiosClient.get('/users/get_user_public_profile', { params: { user_id: id } }),
        AxiosClient.get('/societies/get_societies_by_user_public', { params: { user_id: id } }),
        AxiosClient.get('/posts/get_posts_by_user', { params: { user_id: id } }),
        AxiosClient.get('/events/get_events_attended_by_user', { params: { user_id: id, limit: 6 } }),
      ]);
      if (p.status === 200) {
        setProfile(p.data.data);
      }
      if (s.status === 200) {
        setSocieties(s.data.data || []);
      }
      if (po.status === 200) {
        setPosts(po.data.data || []);
      }
      if (ae.status === 200) {
        setAttendedEvents(ae.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch public profile', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, [id]);

  return (
    <main className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <SkeletonList count={3} className="space-y-6" />
        ) : (
          <>
            {/* Header */}
            <div className="relative overflow-hidden mb-6">
              {/* Background with gradient */}
              <div className="h-32 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

                {/* Floating elements for visual interest */}
                <div className="absolute top-3 right-3 w-12 h-12 bg-white/10 rounded-full blur-lg"></div>
                <div className="absolute bottom-3 left-3 w-10 h-10 bg-purple-300/20 rounded-full blur-md"></div>
              </div>

              {/* Profile content */}
              <div className="relative -mt-16 px-4 pb-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                    {/* Avatar section */}
                    <div className="relative group">
                      <div className="w-20 h-20 bg-white rounded-xl border-3 border-white shadow-lg overflow-hidden relative">
                        <img
                          src={profile?.Image || defaultAvatar}
                          alt={profile?.Name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = defaultAvatar;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>

                    {/* Profile info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            {profile?.Name || 'User Name'}
                          </h1>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                            <span className="text-sm">{profile?.Email}</span>
                          </div>

                          {profile?.Bio && (
                            <p className="text-gray-600 max-w-xl leading-relaxed whitespace-pre-line text-sm line-clamp-2">
                              {profile.Bio}
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md">
                            <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                            Follow
                          </button>
                          <button className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md">
                            <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats section */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="text-lg font-bold text-gray-900">{profile?.Society_Count || societies.length}</div>
                        <div className="text-xs text-gray-600 font-medium">Societies</div>
                      </div>

                      <div className="text-center group">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-lg font-bold text-gray-900">{profile?.Event_Count || 0}</div>
                        <div className="text-xs text-gray-600 font-medium">Events</div>
                      </div>

                      <div className="text-center group">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="text-lg font-bold text-gray-900">{profile?.Post_Count || posts.length}</div>
                        <div className="text-xs text-gray-600 font-medium">Posts</div>
                      </div>

                      <div className="text-center group">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <div className="text-lg font-bold text-gray-900">{profile?.Likes_Count || 0}</div>
                        <div className="text-xs text-gray-600 font-medium">Likes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Societies */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Societies
                  </h2>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{societies.length}</span>
                </div>

                {societies.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No societies to show</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {societies.slice(0, 6).map(s => (
                      <Link
                        key={s.ID}
                        to={`/societies/${s.ID}`}
                        className="group flex items-center justify-between rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 p-3 hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
                            <img
                              src={s.Image || 'https://placehold.co/80x80?text=S'}
                              alt={s.Name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{s.Name}</div>
                            <div className="text-xs text-gray-500">{s.Category}</div>
                          </div>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Attended Events */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Attended Events
                  </h2>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{attendedEvents.length}</span>
                </div>

                {attendedEvents.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No attended events</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attendedEvents.slice(0, 6).map(event => (
                      <Link
                        key={event.ID}
                        to={`/events/${event.ID}`}
                        className="group flex items-center justify-between rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all duration-300 p-3 hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 shadow-md">
                            <img
                              src={event.Image || 'https://placehold.co/80x80?text=E'}
                              alt={event.Title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors truncate">{event.Title}</div>
                            <div className="text-xs text-gray-500 truncate">{event.Society_Name || 'Event'}</div>
                            <div className="text-xs text-gray-400">
                              {event.Date ? new Date(event.Date).toLocaleDateString() : 'TBD'}
                            </div>
                          </div>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Posts */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Recent Posts
                  </h2>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{posts.length}</span>
                </div>

                {posts.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No posts yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.slice(0, 5).map(p => (
                      <div key={p.ID} className="rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
                        {p.Image && (
                          <div className="h-32 w-full overflow-hidden">
                            <img
                              src={p.Image}
                              alt="Post"
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <p className="text-gray-800 leading-relaxed whitespace-pre-line mb-3 text-sm line-clamp-3">{p.Content}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{p.CreatedAt ? new Date(p.CreatedAt).toLocaleString() : ''}</span>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                {p.Likes || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                {p.CommentsCount || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
