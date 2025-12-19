import { createContext, useContext, useState, useEffect } from 'react';
import AxiosClient from '../config/axios';
import { useAuth } from './AuthContext';

const MembershipContext = createContext();

export function MembershipProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [memberships, setMemberships] = useState({});

  const fetchMembership = async (societyId) => {
    if (!isAuthenticated || !user) {
      return;
    }

    if (!societyId) {
      return;
    }

    if (memberships[societyId]) {
      return;
    }

    try {
      const [memberRes, adminRes, societyRes] = await Promise.all([
        AxiosClient.get('/societies/members/check', {
          params: {
            society_id: societyId
          }
        }),
        AxiosClient.get('/societies/admin/check', {
          params: {
            society_id: societyId
          }
        }),
        AxiosClient.get('/societies/info', {
          params: {
            society_id: societyId
          }
        }),
      ]);

      const society = societyRes.data.data;
      const isMember = memberRes.data.data ?? false;
      const isAdmin = adminRes.data.data ?? false;
      const isOwner = society?.User === user?.ID;

      let userRole = null;
      let isModerator = false;

      if (isMember && society?.Members) {
        const memberData = society.Members.find(m => m.User === user.ID);
        userRole = memberData?.Role || 'member';
        isModerator = userRole === 'moderator';
      }

      setMemberships((prev) => ({
        ...prev,
        [societyId]: {
          isMember,
          isAdmin,
          isOwner,
          isModerator,
          userRole,
          permissions: society?.Permissions || {
            whoCanPost: 'all-members',
            whoCanCreateEvents: 'moderators',
            whoCanInvite: 'all-members'
          },
          privacy: society?.Privacy || {
            visibility: 'public',
            joinApproval: true,
            memberListVisible: true,
            eventsVisible: true
          }
        },
      }));
    } catch (error) {
      console.error('Error fetching membership:', error);
      setMemberships((prev) => ({
        ...prev,
        [societyId]: {
          isMember: false,
          isAdmin: false,
          isOwner: false,
          isModerator: false,
          userRole: null,
          permissions: {
            whoCanPost: 'all-members',
            whoCanCreateEvents: 'moderators',
            whoCanInvite: 'all-members'
          },
          privacy: {
            visibility: 'public',
            joinApproval: true,
            memberListVisible: true,
            eventsVisible: true
          }
        },
      }));
    }
  };

  const clearMembership = async (societyId) => {
    try {
      await AxiosClient.post('/societies/leave', {
        society_id: societyId
      });

      setMemberships((prev) => ({
        ...prev,
        [societyId]: {
          isMember: false,
          isAdmin: false,
          isOwner: false,
          isModerator: false,
          userRole: null
        },
      }));
    } catch (error) {
      console.error('Error leaving society:', error);
    }
  };

  return (
    <MembershipContext.Provider value={{
      memberships,
      fetchMembership,
      clearMembership
    }}
    >
      {children}
    </MembershipContext.Provider>
  );
}

export const useSocietyMembership = (societyId) => {
  const { memberships, fetchMembership } = useContext(MembershipContext);
  const membership = memberships[societyId] || {
    isMember: false,
    isAdmin: false,
    isOwner: false,
    isModerator: false,
    userRole: null,
    permissions: {
      whoCanPost: 'all-members',
      whoCanCreateEvents: 'moderators',
      whoCanInvite: 'all-members'
    },
    privacy: {
      visibility: 'public',
      joinApproval: true,
      memberListVisible: true,
      eventsVisible: true
    }
  };

  useEffect(() => {
    fetchMembership(societyId);
  }, [societyId]);

  const canPost = () => {
    if (!membership.isMember) {
      return false;
    }
    const whoCanPost = membership.permissions.whoCanPost;
    if (whoCanPost === 'all-members') {
      return true;
    }
    if (whoCanPost === 'moderators') {
      return membership.isModerator || membership.isAdmin;
    }
    if (whoCanPost === 'admins') {
      return membership.isAdmin;
    }
    return false;
  };

  const canCreateEvents = () => {
    if (!membership.isMember) {
      return false;
    }
    const whoCanCreateEvents = membership.permissions.whoCanCreateEvents;
    if (whoCanCreateEvents === 'all-members') {
      return true;
    }
    if (whoCanCreateEvents === 'moderators') {
      return membership.isModerator || membership.isAdmin;
    }
    if (whoCanCreateEvents === 'admins') {
      return membership.isAdmin;
    }
    return false;
  };

  const canInvite = () => {
    if (!membership.isMember) return false;
    const whoCanInvite = membership.permissions.whoCanInvite;
    if (whoCanInvite === 'all-members') {
      return true;
    }
    if (whoCanInvite === 'moderators') {
      return membership.isModerator || membership.isAdmin;
    }
    if (whoCanInvite === 'admins') {
      return membership.isAdmin;
    }
    return false;
  };

  return {
    ...membership,
    canPost,
    canCreateEvents,
    canInvite
  };
};
