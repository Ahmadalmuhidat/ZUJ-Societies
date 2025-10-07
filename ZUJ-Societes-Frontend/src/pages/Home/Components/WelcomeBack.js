import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function WelcomeBack() {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Welcome back, {user?.Name}! 👋
      </h2>
      <p className="text-gray-600 mb-4">
        Here's what's happening in your communities today.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/my-societies"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          My Societies
        </Link>
        <Link
          to="/events"
          className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm"
        >
          Upcoming Events
        </Link>
      </div>
    </div>
  );
}
