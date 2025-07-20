import React from 'react';
import TeamInvitationsPanel from '../../../components/organisms/TeamInvitationsPanel';

const TeamInvitationsPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Invitaciones a Equipos</h1>
      <TeamInvitationsPanel />
    </div>
  );
};

export default TeamInvitationsPage; 