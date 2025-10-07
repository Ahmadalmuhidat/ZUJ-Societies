export default function QuickStats({ societies }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Impact</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:shadow-lg transition-all duration-300">
          <div className="text-4xl font-bold text-blue-600 mb-3">
            {societies.filter(soc => soc.Role === 'member').length}
          </div>
          <div className="text-gray-700 font-medium">Memberships</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:shadow-lg transition-all duration-300">
          <div className="text-4xl font-bold text-green-600 mb-3">
            {societies.filter(soc => soc.Role === 'admin').length}
          </div>
          <div className="text-gray-700 font-medium">Managed Societies</div>
        </div>
      </div>
    </div>
  );
}
