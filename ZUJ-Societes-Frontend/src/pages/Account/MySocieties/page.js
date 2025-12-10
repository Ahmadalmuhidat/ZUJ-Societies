import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AxiosClient from '../../../config/axios';
import AsAdmin from './Components/AsAdmin';
import AsMemeber from './Components/AsMember';
import QuickStats from './Components/QuickStats';
import { useAuth } from '../../../context/AuthContext';

export default function MySocieties() {
  const [societies, setSocieties] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const getSocietiesByUser = async () => {
    try {
      const response = await AxiosClient.get("/user/societies");

      if (response.status === 200) {
        const unique = Array.from(new Map(response.data.data.map(s => [s.ID, s])).values());
        setSocieties(unique);
      }
    } catch (error) {
      console.error("Failed to fetch societies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSocietiesByUser();
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const adminSocieties = societies.filter(soc => soc.Role === 'admin');

  return (
    <main className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Societies</h1>
          <Link
            to="/societies"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Discover More
          </Link>
        </div>
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-24 bg-white rounded-lg shadow-sm"></div>
            <div className="h-40 bg-white rounded-lg shadow-sm"></div>
            <div className="h-40 bg-white rounded-lg shadow-sm"></div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Welcome back, {user?.Name}!
              </h2>
              <p className="text-gray-600">
                Here's what's happening in your societies and communities.
              </p>
            </div>
            {adminSocieties.length > 0 && <AsAdmin societies={societies} />}
            <AsMemeber societies={societies} />
            <QuickStats societies={societies} />
          </>
        )}
      </div>
    </main>
  );
}
