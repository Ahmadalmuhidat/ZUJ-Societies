export default function Features() {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Platform Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start">
          <div className="bg-blue-100 p-3 rounded-lg mr-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Society Management</h3>
            <p className="text-gray-600">Create, manage, and grow student societies with comprehensive tools for member management, role assignments, and administrative controls.</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-green-100 p-3 rounded-lg mr-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Event Planning & Discovery</h3>
            <p className="text-gray-600">Plan, organize, and discover campus events with our integrated calendar system, RSVP management, and event promotion tools.</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-purple-100 p-3 rounded-lg mr-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Social Engagement</h3>
            <p className="text-gray-600">Connect with fellow Campusly friends through posts, comments, likes, and real-time notifications. Build meaningful campus relationships.</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-orange-100 p-3 rounded-lg mr-4">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Analytics & Insights</h3>
            <p className="text-gray-600">Track society growth, member engagement, and event success with detailed analytics and reporting tools for society administrators.</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-indigo-100 p-3 rounded-lg mr-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Privacy & Security</h3>
            <p className="text-gray-600">Advanced privacy controls, secure authentication, and role-based permissions ensure your data and society information remain protected.</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-pink-100 p-3 rounded-lg mr-4">
            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Personalized Experience</h3>
            <p className="text-gray-600">Get personalized recommendations for societies and events based on your interests, academic program, and campus activities.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 