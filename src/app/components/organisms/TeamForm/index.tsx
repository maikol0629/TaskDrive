'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { supabase } from '../../../../utils/supabaseClient';
import Button from '../../atoms/Buttons/Button';
import type { TeamWithMembers } from '../../molecules/Team/TeamCard';
import TeamInviteForm from '../TeamInviteForm';
interface TeamFormProps {
  onTeamCreated?: () => void;
  onTeamUpdated?: () => void;
  onCancel?: () => void;
  team?: TeamWithMembers;
  isEditMode?: boolean;
}

interface Member {
  user_id: string;
  role: string;
  profiles: { name: string | null; email: string | null };
}

const TeamForm: React.FC<TeamFormProps> = ({ onTeamCreated, onTeamUpdated, onCancel, team, isEditMode }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: team?.name || '',
    description: team?.description || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [showInvite, setShowInvite] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!team) return;
    const { data } = await supabase
      .from('team_members')
      .select('user_id, role, profiles:profiles!team_members_user_id_fkey(name, email)')
      .eq('team_id', team.id)
      .eq('status', 'active');
    setMembers((data as Member[]) || []);
  }, [team]);

  useEffect(() => {
    if (isEditMode && team) {
      setFormData({ name: team.name, description: team.description || '' });
      fetchMembers();
    }
  }, [isEditMode, team, fetchMembers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('El nombre del equipo es requerido');
      return;
    }

    if (!user) {
      setError('Debes estar autenticado para crear/editar un equipo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEditMode && team) {
        const { error: updateError } = await supabase
          .from('teams')
          .update({
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', team.id);
        if (updateError) throw updateError;
        if (onTeamUpdated) onTeamUpdated();
      } else {
        // OPCIÓN 1: Usar la función SQL segura
        const { error: functionError } = await supabase
          .rpc('create_team_with_owner', {
            team_name: formData.name.trim(),
            team_description: formData.description.trim() 
          });

        if (functionError) throw functionError;

        // Reset form
        setFormData({ name: '', description: '' });
        if (onTeamCreated) onTeamCreated();
        
      }
    } catch (error: unknown) {
      // Si la función RPC no existe, usar el método manual
      if (error instanceof Error && error.message.includes('42883')) { // función no existe
        try {
          await createTeamManually();
        } catch (manualError: unknown) {
          setError((manualError as Error).message || 'Error al crear el equipo');
        }
      } else {
        setError((error as Error).message || 'Error al crear/editar el equipo');
      }
    } finally {
      setLoading(false);
    }
  };

  // Método manual como fallback
  const createTeamManually = async () => {
    // Deshabilitar RLS temporalmente para esta operación
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .insert({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        created_by: user!.id,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (teamError) throw teamError;

    // Insertar el miembro usando el service role o deshabilitando RLS
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: teamData.id,
        user_id: user!.id,
        invited_by: user!.id,
        role: 'owner',
        status: 'active',
        joined_at: new Date().toISOString()
      });

    if (memberError) throw memberError;

    // Reset form
    setFormData({ name: '', description: '' });
    if (onTeamCreated) onTeamCreated();
  };

  const handleRemoveMember = async (userId: string) => {
    if (!team) return;
    if (!window.confirm('¿Seguro que quieres quitar este miembro del equipo?')) return;
    await supabase
      .from('team_members')
      .delete()
      .eq('team_id', team.id)
      .eq('user_id', userId);
    fetchMembers();
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setError('');
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{isEditMode ? 'Editar equipo' : 'Crear nuevo equipo'}</h3>
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del equipo *
            </label>
            <input
              id="teamName"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5226A6] focus:border-transparent"
              placeholder="Equipo de Desarrollo"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="teamDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="teamDescription"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5226A6] focus:border-transparent"
              placeholder="Describe el propósito de este equipo..."
              disabled={loading}
            />
          </div>
        </div>
      </div>
      {isEditMode && team && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Integrantes</h4>
          <ul className="divide-y divide-gray-200">
            {members.map((member) => (
              <li key={member.user_id} className="flex items-center justify-between py-2">
                <span>{member.profiles?.name || member.profiles?.email || member.user_id}</span>
                <span className="text-xs text-gray-500 ml-2">{member.role}</span>
                {(user?.id !== member.user_id && (team.userRole === 'owner' || team.userRole === 'admin')) && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.user_id)}
                    className="ml-4 text-red-500 hover:underline text-xs"
                  >
                    Quitar
                  </button>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowInvite(true)}
              className="text-[#5226A6] hover:underline text-sm"
            >
              Invitar miembro
            </button>
          </div>
          {showInvite && (
            <div className="mt-4">
              <TeamInviteForm team={team} onInviteSent={() => setShowInvite(false)} />
            </div>
          )}
        </div>
      )}
      <div className="flex space-x-3">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="flex-1"
        >
          {loading ? (isEditMode ? 'Guardando...' : 'Creando...') : (isEditMode ? 'Guardar cambios' : 'Crear equipo')}
        </Button>
        
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

export default TeamForm;