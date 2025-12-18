import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProfileHeader({ profileData }) {
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png';

  return (
    <div className="relative overflow-hidden mb-8">
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
                  src={profileData?.Image || defaultAvatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultAvatar;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Edit avatar button */}
              <button
                onClick={() => setIsEditingAvatar(true)}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                title="Edit avatar"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            {/* Profile info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {profileData?.Name || 'User Name'}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <span className="text-sm">{profileData?.Email}</span>
                  </div>

                  {profileData?.Bio && (
                    <p className="text-gray-600 max-w-xl leading-relaxed whitespace-pre-line text-sm line-clamp-2">
                      {profileData.Bio}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Member since {profileData?.Create_Date ? new Date(profileData.Create_Date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Recently'}</span>
                    </div>
                  </div>
                </div>

                {/* Settings Button */}
                <Link
                  to="/account/settings"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Link>
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
                <div className="text-lg font-bold text-gray-900">{profileData?.Society_Count || 0}</div>
                <div className="text-xs text-gray-600 font-medium">Societies</div>
              </div>

              <div className="text-center group">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-lg font-bold text-gray-900">{profileData?.Event_Count || 0}</div>
                <div className="text-xs text-gray-600 font-medium">Events</div>
              </div>

              <div className="text-center group">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-lg font-bold text-gray-900">{profileData?.Post_Count || 0}</div>
                <div className="text-xs text-gray-600 font-medium">Posts</div>
              </div>

              <div className="text-center group">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="text-lg font-bold text-gray-900">{profileData?.Likes_Count || 0}</div>
                <div className="text-xs text-gray-600 font-medium">Likes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
