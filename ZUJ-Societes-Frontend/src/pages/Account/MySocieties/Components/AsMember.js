import SocietyCard from "../../../Societies/Components/SocietyCard";

export default function AsMemeber({ societies }) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">My Memberships</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {societies
          .filter(society => society.Role === 'member')
          .map(society => (
            <div key={society.ID} className="relative">
              <SocietyCard {...society} />
              <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-lg backdrop-blur-sm">
                Member
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
