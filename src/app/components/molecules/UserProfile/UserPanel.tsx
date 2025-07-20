import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { supabase } from '../../../../utils/supabaseClient';
import { Tables } from '../../../../../types/supabase';
import Avatar from '../../atoms/Avatar';
import Button from '../../atoms/Buttons/Button';

interface UserPanelProps {
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
}

type Profile = Tables<'profiles'>;

const UserPanel: React.FC<UserPanelProps> = ({ isOpen, onClose, position }) => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: ''
  });
  const panelRef = useRef<HTMLDivElement>(null);

  const loadProfile = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        return;
      }

      setProfile(data);
      setFormData({
        name: data?.name || '',
        username: data?.username || ''
      });
    } catch {
      // Elimino logs innecesarios
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Cargar perfil del usuario
  useEffect(() => {
    if (user && isOpen) {
      loadProfile();
    }
  }, [user, isOpen, loadProfile]);

  // Cerrar panel al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const profileData = {
        id: user.id,
        email: user.email || null,
        name: formData.name.trim() || null,
        username: formData.username.trim() || null,
        avatar_url: null,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (error) throw error;

      await loadProfile();
      setEditing(false);
    } catch {
      // Elimino logs innecesarios
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      onClose();
    } catch {
      // Elimino logs innecesarios
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 w-72 z-50"
      style={{
        top: Math.max(10, Math.min(position.top - 150, window.innerHeight - 400)),
        left: Math.max(10, position.left - 290),
      }}
    >
      {editing ? (
        /* Modo edición */
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Editar perfil</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5226A6] focus:border-transparent"
                placeholder="Tu nombre completo"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nombre de usuario
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5226A6] focus:border-transparent"
                placeholder="usuario123"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <Button
                onClick={handleSaveProfile}
                variant="primary"
                size="sm"
                className="flex-1"
                disabled={loading}
              >
                Guardar
              </Button>
              <Button
                onClick={() => setEditing(false)}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Modo vista */
        <div className="p-4">
          {/* Header compacto */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar 
                name={profile?.name}
                email={user?.email}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.name || 'Usuario'}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Información adicional solo si existe */}
          {profile?.username && (
            <div className="mb-4 px-3 py-2 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Usuario:</span> @{profile.username}
              </p>
            </div>
          )}

          {/* Acciones */}
          <div className="space-y-2">
            <button
              onClick={() => setEditing(true)}
              className="w-full flex items-center justify-center px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar perfil
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5226A6]"></div>
        </div>
      )}
    </div>
  );
};

export default UserPanel; 