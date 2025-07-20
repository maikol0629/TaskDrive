'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { supabase } from '../../../../utils/supabaseClient';
import { Tables } from '../../../../../types/supabase';
import Button from '../../atoms/Buttons/Button';

interface ProjectTeamAssignmentProps {
  project: Tables<'project'>;
  onAssignmentChange: () => void;
  onCancel?: () => void;
}

type Team = Tables<'teams'>;

interface TeamWithAssignment extends Team {
  isAssigned: boolean;
  assignedBy?: string | null;
  assignedAt?: string | null;
}

const ProjectTeamAssignment: React.FC<ProjectTeamAssignmentProps> = ({ 
  project, 
  onAssignmentChange, 
  onCancel 
}) => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<TeamWithAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadUserTeamsAndAssignments = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Obtener equipos donde el usuario tiene permisos de admin/owner
      const { data: teamMemberships, error: memberError } = await supabase
        .from('team_members')
        .select(`
          role,
          teams (
            id,
            name,
            description,
            created_by,
            is_active
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .in('role', ['owner', 'admin']);

      if (memberError) throw memberError;

      if (!teamMemberships || teamMemberships.length === 0) {
        setTeams([]);
        return;
      }

      // Obtener asignaciones actuales del proyecto
      const teamIds = teamMemberships.map(m => (m.teams as Team).id);
      const { data: assignments, error: assignError } = await supabase
        .from('project_teams')
        .select('team_id, assigned_by, assigned_at')
        .eq('project_id', project.id)
        .in('team_id', teamIds);

      if (assignError) throw assignError;

      // Combinar equipos con estado de asignación
      const teamsWithAssignments: TeamWithAssignment[] = teamMemberships.map(membership => {
        const team = membership.teams as Team;
        const assignment = assignments?.find(a => a.team_id === team.id);
        
        return {
          ...team,
          isAssigned: !!assignment,
          assignedBy: assignment?.assigned_by,
          assignedAt: assignment?.assigned_at
        };
      });

      setTeams(teamsWithAssignments);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al cargar los equipos:', error.message);
      } else {
        console.error('Error desconocido al cargar los equipos:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [user, project.id]);

  useEffect(() => {
    if (user) {
      loadUserTeamsAndAssignments();
    }
  }, [user, project.id, loadUserTeamsAndAssignments]);

  const handleToggleAssignment = async (team: TeamWithAssignment) => {
    if (!user) return;

    setUpdating(team.id);

    try {
      if (team.isAssigned) {
        // Desasignar equipo
        const { error } = await supabase
          .from('project_teams')
          .delete()
          .eq('project_id', project.id)
          .eq('team_id', team.id);

        if (error) throw error;
      } else {
        // Asignar equipo
        const { error } = await supabase
          .from('project_teams')
          .insert({
            project_id: project.id,
            team_id: team.id,
            assigned_by: user.id,
            assigned_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      // Actualizar estado local
      setTeams(prev => prev.map(t => 
        t.id === team.id 
          ? { 
              ...t, 
              isAssigned: !t.isAssigned,
              assignedBy: !t.isAssigned ? undefined : user.id,
              assignedAt: !t.isAssigned ? undefined : new Date().toISOString()
            }
          : t
      ));

      onAssignmentChange();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al actualizar la asignación:', error.message);
      } else {
        console.error('Error desconocido al actualizar la asignación:', error);
      }
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5226A6]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Asignar equipos al proyecto
        </h3>
        <p className="text-sm text-gray-600">
          Selecciona qué equipos tendrán acceso a este proyecto: &quot;{project.name}&quot;
        </p>
      </div>

      {/* Elimino error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      ) */}

      {teams.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No tienes equipos disponibles
          </h4>
          <p className="text-gray-600">
            Solo puedes asignar equipos donde tengas rol de administrador o propietario.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {teams.map((team) => (
            <div 
              key={team.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${team.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <div>
                    <h4 className="font-medium text-gray-900">{team.name}</h4>
                    {team.description && (
                      <p className="text-sm text-gray-600 mt-1">{team.description}</p>
                    )}
                    {team.isAssigned && team.assignedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Asignado el {new Date(team.assignedAt).toLocaleDateString('es-ES')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleToggleAssignment(team)}
                variant={team.isAssigned ? "danger" : "primary"}
                size="sm"
                disabled={updating === team.id}
                className="ml-4"
              >
                {updating === team.id ? (
                  'Actualizando...'
                ) : team.isAssigned ? (
                  'Desasignar'
                ) : (
                  'Asignar'
                )}
              </Button>
            </div>
          ))}
        </div>
      )}

      {onCancel && (
        <div className="mt-6 flex justify-end">
          <Button
            onClick={onCancel}
            variant="secondary"
          >
            Cerrar
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectTeamAssignment; 