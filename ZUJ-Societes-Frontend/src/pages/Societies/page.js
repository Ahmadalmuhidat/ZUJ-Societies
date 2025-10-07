import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SocietyCard from './Components/SocietyCard';
import { useAuth } from '../../context/AuthContext';
import SocietyInsights from '../../shared/components/SocietyInsights';
import GlobalSearch from '../../shared/components/GlobalSearch';
import AxiosClient from '../../config/axios';

export default function Societies() {
  const [societies, setSocieties] = useState([]);
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const getSocieties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await AxiosClient.get("/societies/get_all_societies", {
        params: { token },
      });

      if (response.status === 200) {
        setSocieties(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch societies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSocieties();
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <main className={`min-h-screen py-10 sm:py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Main Content */}
          <div className="xl:w-3/4">
            <div className="mb-6">
              <GlobalSearch />
            </div>

            <div className="mb-12">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                      <div className="h-44 w-full bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {societies.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg">No societies available.</p>
                      <p className="text-gray-400 text-sm mt-2">Check back later or create a new society.</p>
                    </div>
                  ) : (
                    societies.map((society) => <SocietyCard key={society.ID} {...society} />)
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:w-1/4 space-y-6">
            <div className="sticky top-8">
              <SocietyInsights societies={societies} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
