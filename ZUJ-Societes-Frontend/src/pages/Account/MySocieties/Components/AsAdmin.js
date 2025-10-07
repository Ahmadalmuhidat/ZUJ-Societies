import SocietyCard from "../../../Societies/Components/SocietyCard";

export default function AsAdmin({ societies }) {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Societies I Manage</h2>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          Admin
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {societies
          .filter(society => society.Role === 'admin')
          .map(society => (
            <div key={society.ID} className="relative">
              <SocietyCard {...society} />
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                Manager
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
