'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../utils/supabaseClient';
import { Tables } from '../../../../types/supabase';
import Button from '../../components/atoms/Buttons/Button';
import TeamCard from '../../components/molecules/Team/TeamCard';
import TeamForm from '../../components/organisms/TeamForm';
import TeamInviteForm from '../../components/organisms/TeamInviteForm';
import EmptyState from '../../components/molecules/EmptyState';

type Team = Tables<'teams'>;

interface TeamWithMembers extends Team {
  memberCount: number;
  userRole?: string | null;
}

export default function TeamsPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<TeamWithMembers[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTeamForInvite, setSelectedTeamForInvite] = useState<Team | null>(null);
  const [selectedTeamForEdit, setSelectedTeamForEdit] = useState<TeamWithMembers | null>(null);
  const [error, setError] = useState('');

  const loadUserTeams = useCallback(async () => {
    if (!user) return;
  
    try {
      setLoading(true);
      setError('');
  
      // ESTRATEGIA 1: Consultar equipos directamente donde el usuario es creador
      const { data: ownedTeams } = await supabase
        .from('teams')
        .select('*')
        .eq('created_by', user.id)
        .eq('is_active', true);
  
      // ESTRATEGIA 2: Consultar membresías del usuario
      const { data: teamMemberships } = await supabase
        .from('team_members')
        .select(`
          team_id,
          role,
          status
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');
  
      // ESTRATEGIA 3: Obtener información de equipos donde es miembro (pero no creador)
      let memberTeams: Team[] = [];
      if (teamMemberships && teamMemberships.length > 0) {
        const memberTeamIds = teamMemberships
          .map(tm => tm.team_id)
          .filter(teamId => !ownedTeams?.some(ot => ot.id === teamId)); // Excluir equipos propios
  
        if (memberTeamIds.length > 0) {
          const { data: memberTeamsData, error: memberTeamsError } = await supabase
            .from('teams')
            .select('*')
            .in('id', memberTeamIds)
            .eq('is_active', true);
  
          if (!memberTeamsError) {
            memberTeams = memberTeamsData || [];
          }
        }
      }
  
      // Combinar todos los equipos
      const allTeams = [
        ...(ownedTeams || []),
        ...memberTeams
      ];
  
      // Obtener conteos de miembros y roles para cada equipo
      const teamsWithCounts = await Promise.all(
        allTeams.map(async (team) => {
          // Encontrar el rol del usuario en este equipo
          let userRole = null;
          if (team.created_by === user.id) {
            userRole = 'owner';
          } else {
            const membership = teamMemberships?.find(tm => tm.team_id === team.id);
            userRole = membership?.role || null;
          }
  
          // Contar miembros activos usando una consulta directa
          const { count, error: countError } = await supabase
            .from('team_members')
            .select('*', { count: 'exact', head: true })
            .eq('team_id', team.id)
            .eq('status', 'active');
  
          if (countError) {
            console.error('Error counting members:', countError);
          }
  
          return {
            ...team,
            memberCount: count || 0,
            userRole
          };
        })
      );
  
      setTeams(teamsWithCounts);
    } catch (error) {
      setError(`Error al cargar los equipos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      loadUserTeams();
    }
  }, [user, loadUserTeams]);

  const handleTeamCreated = () => {
    setShowCreateForm(false);
    loadUserTeams();
  };

  const handleInviteSent = () => {
    setSelectedTeamForInvite(null);
    // Podrías recargar datos si es necesario
  };

  const handleInviteClick = (team: Team) => {
    setSelectedTeamForInvite(team);
  };

  const handleManageClick = (team: TeamWithMembers) => {
    if (team.userRole === 'owner' || team.userRole === 'admin') {
      setSelectedTeamForEdit(team);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5226A6]"></div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCreateForm(false)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span>← Atrás</span>
          </button>
          <h2 className="text-xl font-semibold text-gray-900">Crear nuevo equipo</h2>
        </div>
        
        <TeamForm 
          onTeamCreated={handleTeamCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    );
  }

  if (selectedTeamForInvite) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedTeamForInvite(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span>← Atrás</span>
          </button>
          <h2 className="text-xl font-semibold text-gray-900">Invitar miembro</h2>
        </div>
        
        <TeamInviteForm 
          team={selectedTeamForInvite}
          onInviteSent={handleInviteSent}
          onCancel={() => setSelectedTeamForInvite(null)}
        />
      </div>
    );
  }

  if (selectedTeamForEdit) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedTeamForEdit(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span>← Atrás</span>
          </button>
          <h2 className="text-xl font-semibold text-gray-900">Editar equipo</h2>
        </div>
        <TeamForm
          team={selectedTeamForEdit}
          onTeamUpdated={() => { setSelectedTeamForEdit(null); loadUserTeams(); }}
          onCancel={() => setSelectedTeamForEdit(null)}
          isEditMode={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 mt-1">
            Colabora con tu equipo de trabajo
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          variant="primary"
        >
          + Crear equipo
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {teams.length === 0 ? (
        <EmptyState
          title="No perteneces a ningún equipo aún"
          description="Crea tu primer equipo o espera a que te inviten a uno existente"
          actionText="Crear primer equipo"
          onAction={() => setShowCreateForm(true)}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              memberCount={team.memberCount}
              userRole={team.userRole}
              onTeamClick={() => {}}
              onInviteClick={handleInviteClick}
              onManageClick={handleManageClick}
            />
          ))}
        </div>
      )}
    </div>
  );
} 