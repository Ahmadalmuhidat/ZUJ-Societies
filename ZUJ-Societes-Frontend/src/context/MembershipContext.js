import { createContext, useContext, useState, useEffect } from 'react';
import AxiosClient from '../config/axios';
import { useAuth } from './AuthContext';

const MembershipContext = createContext();

export function MembershipProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [memberships, setMemberships] = useState({});

  const fetchMembership = async (societyId) => {
    if (!isAuthenticated || !user) return;

    if (memberships[societyId]) return;

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      const [memberRes, adminRes] = await Promise.all([
        AxiosClient.get('/societies/check_membership', { params: { token, society_id: societyId } }),
        AxiosClient.get('/societies/check_admin', { params: { token, society_id: societyId } }),
      ]);

      setMemberships((prev) => ({
        ...prev,
        [societyId]: {
          isMember: memberRes.data.data ?? false,
          isAdmin: adminRes.data.data ?? false,
        },
      }));
    } catch (error) {
      console.error('Error fetching membership:', error);
      setMemberships((prev) => ({
        ...prev,
        [societyId]: { isMember: false, isAdmin: false },
      }));
    }
  };

  return (
    <MembershipContext.Provider value={{ memberships, fetchMembership }}>
      {children}
    </MembershipContext.Provider>
  );
}

export const useSocietyMembership = (societyId) => {
  const { memberships, fetchMembership } = useContext(MembershipContext);
  const membership = memberships[societyId] || { isMember: false, isAdmin: false };

  useEffect(() => {
    fetchMembership(societyId);
  }, [societyId]);

  return membership;
};
