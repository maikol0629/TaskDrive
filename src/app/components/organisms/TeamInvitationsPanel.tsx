'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../utils/supabaseClient';
import Button from '../atoms/Buttons/Button';

interface Invitation {
  id: string;
  team_id: string;
  email: string;
  invited_by: string;
  role: string;
  status: string;
  expires_at: string;
  created_at: string;
  team?: { name: string };
}

const TABS = [
  { key: 'pending', label: 'Pendientes' },
  { key: 'history', label: 'Historial' }
];

const TeamInvitationsPanel: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'pending' | 'history'>('pending');
  const [pending, setPending] = useState<Invitation[]>([]);
  const [history, setHistory] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  

  const loadInvitations = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data, error } = await supabase
        .from('team_invitations')
        .select('*, team:teams(name)')
        .eq('email', user?.email ?? '')
        .order('created_at', { ascending: false });
      if (error) throw error;
      // Normalizar datos para evitar null en role/status
      const normalized = (data || []).map((inv: unknown) => {
        if (typeof inv === 'object' && inv !== null) {
          const obj = inv as Invitation;
          return {
            ...obj,
            role: obj.role ?? '',
            status: obj.status ?? '',
          };
        }
        return inv as Invitation;
      });
      setPending((normalized as Invitation[]).filter((inv) => inv.status === 'pending'));
      setHistory((normalized as Invitation[]).filter((inv) => inv.status !== 'pending'));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al cargar invitaciones');
      } else {
        setError('Error desconocido al cargar invitaciones');
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadInvitations();
    }
  }, [user, loadInvitations]);

  const handleAccept = async (invitation: Invitation) => {
    setError('');
    setSuccess('');
    try {
      // Llama a la función RPC o actualiza la invitación y agrega al usuario como miembro
      const { error: acceptError } = await supabase.rpc('accept_team_invitation', { invitation_id: invitation.id });
      if (acceptError) throw acceptError;
      setSuccess('¡Invitación aceptada!');
      loadInvitations();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al aceptar invitación');
      } else {
        setError('Error desconocido al aceptar invitación');
      }
    }
  };

  const handleReject = async (invitation: Invitation) => {
    setError('');
    setSuccess('');
    try {
      const { error: rejectError } = await supabase
        .from('team_invitations')
        .update({ status: 'rejected' })
        .eq('id', invitation.id);
      if (rejectError) throw rejectError;
      setSuccess('Invitación rechazada');
      loadInvitations();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al rechazar invitación');
      } else {
        setError('Error desconocido al rechazar invitación');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex space-x-4 mb-6 border-b pb-2">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`px-3 py-1 font-medium border-b-2 rounded-t transition-colors duration-200 ${tab === t.key ? 'border-[#5226A6] text-[#5226A6] bg-gray-100' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setTab(t.key as 'pending' | 'history')}
          >
            {t.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="text-center text-gray-500 py-8">Cargando invitaciones...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : (
        <>
          {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">{success}</div>}
          {tab === 'pending' && (
            pending.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No tienes invitaciones pendientes.</div>
            ) : (
              <ul className="space-y-4">
                {pending.map(inv => (
                  <li key={inv.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{inv.team?.name || 'Equipo'}</div>
                      <div className="text-sm text-gray-600">Rol: <span className="font-medium">{inv.role}</span></div>
                      <div className="text-xs text-gray-400">Invitado por: {inv.invited_by}</div>
                      <div className="text-xs text-gray-400">Expira: {new Date(inv.expires_at).toLocaleDateString()}</div>
                    </div>
                    <div className="flex space-x-2 mt-4 md:mt-0">
                      <Button onClick={() => handleAccept(inv)} color="primary">Aceptar</Button>
                      <Button onClick={() => handleReject(inv)} color="secondary">Rechazar</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}
          {tab === 'history' && (
            history.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No hay historial de invitaciones.</div>
            ) : (
              <ul className="space-y-4">
                {history.map(inv => (
                  <li key={inv.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{inv.team?.name || 'Equipo'}</div>
                      <div className="text-sm text-gray-600">Rol: <span className="font-medium">{inv.role}</span></div>
                      <div className="text-xs text-gray-400">Invitado por: {inv.invited_by}</div>
                      <div className="text-xs text-gray-400">Expiró: {new Date(inv.expires_at).toLocaleDateString()}</div>
                    </div>
                    <div className="flex space-x-2 mt-4 md:mt-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${inv.status === 'accepted' ? 'bg-green-100 text-green-700' : inv.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                        {inv.status === 'accepted' ? 'Aceptada' : inv.status === 'rejected' ? 'Rechazada' : 'Expirada'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}
        </>
      )}
    </div>
  );
};

export default TeamInvitationsPanel; 