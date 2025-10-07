import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SearchHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
    <header className="bg-white py-4 border-b shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-900">
          Society
        </Link>

        <form onSubmit={handleSearch} className="flex flex-grow max-w-md mx-4">
          <input
            type="text"
            placeholder="Search for events or societies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        <Link
          to="/account"
          className="text-sm font-medium text-gray-700 hover:text-black"
        >
          Account
        </Link>
      </div>
    </header>
  );
}
