import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={`space-y-6 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-6 border border-gray-100">
        <div className="space-y-4">
          {isAuthenticated ? (
            <Link
              to="/societies/new"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <span className="text-blue-800 font-semibold text-sm">Create Society</span>
                <p className="text-blue-600 text-xs">Start your own community</p>
              </div>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <span className="text-blue-800 font-semibold text-sm">Login to Create Society</span>
                <p className="text-blue-600 text-xs">Sign in to get started</p>
              </div>
            </Link>
          )}

          <Link to="/events" className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 group">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="text-green-800 font-semibold text-sm">Browse Events</span>
              <p className="text-green-600 text-xs">Discover upcoming events</p>
            </div>
          </Link>

          <Link to="/support" className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 group">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
              </svg>
            </div>
            <div>
              <span className="text-purple-800 font-semibold text-sm">Get Help</span>
              <p className="text-purple-600 text-xs">Support and assistance</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
