import { useEffect, useState } from 'react';
import EventCard from './Components/EventCard';
import EventCalendar from '../../shared/components/EventCalendar';
import AdvancedEventFilters from '../../shared/components/AdvancedEventFilters';
import GlobalSearch from '../../shared/components/GlobalSearch';
import AxiosClient from '../../config/axios';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const getEvents = async () => {
    try {
      setLoading(true);
      const response = await AxiosClient.get("/events/get_all_events");
      if (response.status === 200) {
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventDeleted = (deletedEventId) => {
    setEvents(prevEvents => prevEvents.filter(event => event.ID !== deletedEventId));
  };

  useEffect(() => {
    getEvents();
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <main className={`min-h-screen py-10 sm:py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="mb-6">
              <AdvancedEventFilters events={events} />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-md p-4 animate-pulse">
                    <div className="h-48 w-full bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                  <EventCard key={event.ID} {...event} onEventDeleted={handleEventDeleted} />
                ))}
                </div>

                {events.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            <EventCalendar events={events} />
          </div>
        </div>
      </div>
    </main>
  );
}
