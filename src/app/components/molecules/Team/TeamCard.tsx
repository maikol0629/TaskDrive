import React from 'react';
import { Tables } from '../../../../../types/supabase';

export interface TeamWithMembers extends Tables<'teams'> {
  memberCount: number;
  userRole?: string | null;
}

interface TeamCardProps {
  team: TeamWithMembers;
  memberCount: number;
  userRole?: string | null;
  onTeamClick: (team: TeamWithMembers) => void;
  onInviteClick?: (team: TeamWithMembers) => void;
  onManageClick?: (team: TeamWithMembers) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ 
  team, 
  memberCount, 
  userRole, 
  onTeamClick, 
  onInviteClick, 
  onManageClick 
}) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner': return 'Propietario';
      case 'admin': return 'Administrador';
      case 'member': return 'Miembro';
      case 'viewer': return 'Observador';
      default: return role;
    }
  };

  const canInvite = userRole === 'owner' || userRole === 'admin';
  const canManage = userRole === 'owner' || userRole === 'admin';

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div 
        className="p-6 cursor-pointer"
        onClick={() => onTeamClick(team)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {team.name}
            </h3>
            {team.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {team.description}
              </p>
            )}
          </div>
          
          {userRole && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(userRole)}`}>
              {getRoleLabel(userRole)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm text-gray-600">
                {memberCount} {memberCount === 1 ? 'miembro' : 'miembros'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${team.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-600">
                {team.is_active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            {team.created_at && new Date(team.created_at).toLocaleDateString('es-ES')}
          </div>
        </div>
      </div>

      {/* Acciones */}
      {(canInvite || canManage) && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex space-x-2">
          {canInvite && onInviteClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInviteClick(team);
              }}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-[#5226A6] bg-white border border-[#5226A6] rounded-md hover:bg-[#5226A6] hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Invitar
            </button>
          )}
          
          {canManage && onManageClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onManageClick(team);
              }}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Gestionar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamCard; 