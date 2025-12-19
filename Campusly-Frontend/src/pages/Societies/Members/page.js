import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SocietyHeader from '../Components/SocietyHeader';
import AxiosClient from '../../../config/axios';
import MembersList from './Components/MembersList';
import MembersStats from './Components/MembersStats';
import InviteModal from './Components/InviteModal';
import SentInvitations from './Components/SentInvitations';
import { useSocietyMembership } from '../../../context/MembershipContext';

export default function SocietyMembers() {
  const { id } = useParams();
  const { isAdmin, isModerator, canInvite } = useSocietyMembership(id);
  const [members, setMembers] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSentInvitations, setShowSentInvitations] = useState(false);

  const getAllSocietyMembers = async () => {
    try {
      const response = await AxiosClient.get("/societies/members", {
        params: { society_id: id }
      });

      if (response.status === 200) {
        setMembers(response.data.data);
      } else {
        console.error("Failed to fetch members", response);
      }
    } catch (error) {
      console.error("Error fetching society members:", error);
    }
  };

  const handleInviteSent = () => {
    getAllSocietyMembers();
  };

  useEffect(() => {
    if (id) getAllSocietyMembers();
    const idAnim = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(idAnim);
  }, [id]);

  return (
    <>
      <SocietyHeader societyId={id || '1'} />
      <main className={`min-h-screen py-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Members</h2>
            {canInvite() && (
              <div className="flex gap-3">
                {(isAdmin || isModerator) && (
                  <button
                    onClick={() => setShowSentInvitations(true)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    Sent Invitations
                  </button>
                )}
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Invite Member
                </button>
              </div>
            )}
          </div>
          <MembersStats members={members} />
          <MembersList id={id} members={members} setMembers={setMembers} />
        </div>
      </main >

      {/* Invite Modal */}
      < InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)
        }
        societyId={id}
        onInviteSent={handleInviteSent}
      />

      {/* Sent Invitations Modal */}
      < SentInvitations
        isOpen={showSentInvitations}
        onClose={() => setShowSentInvitations(false)}
        societyId={id}
      />
    </>
  );
}
