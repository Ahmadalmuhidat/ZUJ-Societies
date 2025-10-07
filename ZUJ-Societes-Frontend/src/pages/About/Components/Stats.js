export default function Stats() {
  return (
    <div className="bg-white rounded-2xl shadow-card p-8 mb-8 border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Campusly Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:shadow-lg transition-all duration-300">
          <div className="text-4xl font-bold text-blue-600 mb-3">25+</div>
          <div className="text-gray-700 font-medium">Active Societies</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:shadow-lg transition-all duration-300">
          <div className="text-4xl font-bold text-green-600 mb-3">1,200+</div>
          <div className="text-gray-700 font-medium">ZUJ Students</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:shadow-lg transition-all duration-300">
          <div className="text-4xl font-bold text-purple-600 mb-3">150+</div>
          <div className="text-gray-700 font-medium">Monthly Events</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl hover:shadow-lg transition-all duration-300">
          <div className="text-4xl font-bold text-orange-600 mb-3">8+</div>
          <div className="text-gray-700 font-medium">Academic Departments</div>
        </div>
      </div>
      <div className="mt-8 p-8 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl border border-primary-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Platform Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl">
            <div className="text-3xl font-bold text-primary-600 mb-2">99.9%</div>
            <div className="text-sm font-medium text-gray-600">Uptime</div>
          </div>
          <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl">
            <div className="text-3xl font-bold text-primary-600 mb-2">&lt;2s</div>
            <div className="text-sm font-medium text-gray-600">Average Load Time</div>
          </div>
          <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl">
            <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
            <div className="text-sm font-medium text-gray-600">Support Available</div>
          </div>
        </div>
      </div>
    </div>
  );
} 