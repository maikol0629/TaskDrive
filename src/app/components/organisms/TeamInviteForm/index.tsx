'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { supabase } from '../../../../utils/supabaseClient';
import { Tables } from '../../../../../types/supabase';
import Button from '../../atoms/Buttons/Button';

interface TeamInviteFormProps {
  team: Tables<'teams'>;
  onInviteSent: () => void;
  onCancel?: () => void;
}

type TeamRole = Tables<'team_members'>['role'];

const TeamInviteForm: React.FC<TeamInviteFormProps> = ({ team, onInviteSent, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    role: 'member' as TeamRole
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const roles = [
    { value: 'viewer', label: 'Viewer - Solo puede ver' },
    { value: 'member', label: 'Member - Puede colaborar' },
    { value: 'admin', label: 'Admin - Puede gestionar' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setError('El email es requerido');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    if (!user) {
      setError('Debes estar autenticado para enviar invitaciones');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Verificar si el usuario ya está invitado
      const { data: existingInvitation, error: checkError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('team_id', team.id)
        .eq('email', formData.email.toLowerCase())
        .eq('status', 'pending')
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingInvitation) {
        setError('Ya existe una invitación pendiente para este email');
        return;
      }

      // Verificar si el usuario ya es miembro del equipo
      const { data: existingMember } = await supabase
        .from('profiles')
        .select(`
          id,
          team_members!inner(
            team_id,
            status
          )
        `)
        .eq('email', formData.email.toLowerCase())
        .eq('team_members.team_id', team.id)
        .eq('team_members.status', 'active')
        .single();

      if (existingMember) {
        setError('Este usuario ya es miembro del equipo');
        return;
      }

      // Crear la invitación (expira en 7 días)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error: inviteError } = await supabase
        .from('team_invitations')
        .insert({
          team_id: team.id,
          email: formData.email.toLowerCase(),
          invited_by: user.id,
          role: formData.role,
          status: 'pending',
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString()
        });

      if (inviteError) throw inviteError;

      setSuccess(`Invitación enviada a ${formData.email}`);
      setFormData({ email: '', role: 'member' });
      
      // Notificar al componente padre
      setTimeout(() => {
        onInviteSent();
      }, 2000);

    } catch (error: unknown) {
      console.error('Error sending invitation:', error);
      setError(typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message?: string }).message === 'string'
        ? (error as { message: string }).message
        : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ email: '', role: 'member' });
    setError('');
    setSuccess('');
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Invitar al equipo &quot;{team.name}&quot;
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Envía una invitación por email para unirse al equipo
        </p>
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email del usuario *
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5226A6] focus:border-transparent"
              placeholder="usuario@ejemplo.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Rol en el equipo *
            </label>
            <select
              id="role"
              value={formData.role || 'member'}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as TeamRole }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5226A6] focus:border-transparent"
              disabled={loading}
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          type="submit"
          variant="primary"
          disabled={loading || !!success}
          className="flex-1"
        >
          {loading ? 'Enviando...' : success ? 'Invitación enviada' : 'Enviar invitación'}
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

export default TeamInviteForm; 