import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SocietyHeader from '../Components/SocietyHeader';
import AxiosClient from '../../../config/axios';
import { useSocietyMembership } from '../../../context/MembershipContext';
import EventsList from './Components/EventsList';
import EventStats from './Components/EventStats';
import Search from './Components/Search';
import { getEventStatus } from '../../../utils/dateUtils';

export default function SocietyEvents() {
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('upcoming');
  const { isMember, canCreateEvents } = useSocietyMembership(id);
  const [mounted, setMounted] = useState(false);

  const getEventsBySociety = async () => {
    const response = await AxiosClient.get("/societies/events", {
      params: { society_id: id }
    });

    if (response.status === 200) {
      setEvents(response.data.data);
    }
  };

  const handleEventDeleted = (deletedEventId) => {
    setEvents(prevEvents => prevEvents.filter(event => event.ID !== deletedEventId));
  };


  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    getEventsBySociety();
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <SocietyHeader societyId={id} showJoinButton={!isMember} actionButton={
        canCreateEvents() && (
          <Link
            to={`/societies/${id}/events/new`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-md flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Event
          </Link>
        )
      } />

      <main className={`max-w-6xl mx-auto px-4 py-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="space-y-6">
          {/* Event Stats */}
          <EventStats events={events} />

          {/* Search and Filters */}
          <Search filter={filter} setFilter={setFilter} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* Events List */}
          <EventsList
            id={id}
            events={events}
            searchTerm={searchTerm}
            filter={filter}
            isMember={isMember}
            onEventDeleted={handleEventDeleted}
          />
        </div>
      </main>
    </>
  );
}
