import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SocietyHeader from '../Components/SocietyHeader';
import AxiosClient from '../../../config/axios';
import { useSocietyMembership } from '../../../context/MembershipContext';
import EventsList from './Components/EventsList';
import EventStats from './Components/EventStats';
import { getEventStatus } from '../../../utils/dateUtils';


export default function SocietyEvents() {
  const { id } = useParams();
  const [filter, setFilter] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const { isMember } = useSocietyMembership(id);
  const [mounted, setMounted] = useState(false);

  const getEventsBySociety = async () => {
    const response = await AxiosClient.get("/events/get_events_by_society", {
      params: { society_id: id }
    });

    if (response.status === 200) {
      setEvents(response.data.data);
    }
  };

  const handleEventDeleted = (deletedEventId) => {
    setEvents(prevEvents => prevEvents.filter(event => event.ID !== deletedEventId));
  };

  const isEventCompleted = (event) => {
    return getEventStatus(event);
  };

  useEffect(() => {
    getEventsBySociety();
    const idAnim = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(idAnim);
  }, []);

  return (
    <>
      <SocietyHeader
        societyId={id || '1'}
        actionButton={
          isMember ? (
            <Link
              to={`/societies/${id}/events/new`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Event
            </Link>
          ) : null
        }
      />

      <main className={`min-h-screen py-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="max-w-6xl mx-auto px-4">

          {/* Event Stats */}
          <EventStats events={events} isEventCompleted={isEventCompleted} />

          {/* Search and Filters */}
          {/* <Search filter={filter} setFilter={setFilter} searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}

          {/* Events List */}
          <EventsList
            id={id}
            events={events}
            searchTerm={searchTerm}
            isMember={isMember}
            isEventCompleted={isEventCompleted}
            onEventDeleted={handleEventDeleted}
          />
        </div>
      </main>
    </>
  );
}
