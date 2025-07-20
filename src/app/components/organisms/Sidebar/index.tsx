'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import { supabase } from '../../../../utils/supabaseClient';
import NavItem from '../../molecules/Navigation/NavItem';
import TaskIcon from '../../atoms/Icons/TaskIcon';
import ProjectIcon from '../../atoms/Icons/ProjectIcon';
import TeamIcon from '../../atoms/Icons/TeamIcon';
import EnvelopeIcon from '../../atoms/Icons/EnvelopeIcon';
import { TextTiltleName, TextSubTitleName } from '../../atoms/Titles';
import UserPanel from '../../molecules/UserProfile/UserPanel';
import { Tables } from '../../../../../types/supabase';
type Profile = Tables<'profiles'>;

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 });
  const [pendingInvites, setPendingInvites] = useState<number>(0);

  // Cargar perfil del usuario
  

  const loadProfile = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { 
        return;
      }

      setProfile(data);
    } catch {
      // Elimino logs innecesarios
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, loadProfile]);

 

  const loadPendingInvites = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('team_invitations')
        .select('id')
        .eq('email', user?.email ?? '')
        .eq('status', 'pending');
      if (error) throw error;
      setPendingInvites(data?.length || 0);
    } catch {
      setPendingInvites(0);
    }
  }, [user]);
   // Cargar cantidad de invitaciones pendientes
   useEffect(() => {
    if (user) {
      loadPendingInvites();
    }
  }, [user, loadPendingInvites]);

  const navigationItems = [
    {
      id: 'tasks',
      label: 'Tareas Personales',
      icon: <TaskIcon />,
      href: '/dashboard/tasks'
    },
    {
      id: 'projects',
      label: 'Proyectos',
      icon: <ProjectIcon />,
      href: '/dashboard/projects'
    },
    {
      id: 'teams',
      label: 'Equipos',
      icon: <TeamIcon />,
      href: '/dashboard/teams'
    },
    {
      id: 'invitations',
      label: 'Invitaciones',
      icon: <EnvelopeIcon />,
      href: '/dashboard/teams/invitations',
      badge: pendingInvites
    }
  ];

  // Determinar qué sección está activa basándose en la ruta
  const getActiveSection = () => {
    if (pathname === '/dashboard' || pathname === '/dashboard/tasks') return 'tasks';
    if (pathname.startsWith('/dashboard/projects')) return 'projects';
    if (pathname.startsWith('/dashboard/teams/invitations')) return 'invitations';
    if (pathname.startsWith('/dashboard/teams')) return 'teams';
    return 'tasks';
  };

  const activeSection = getActiveSection();

  const handleAvatarClick = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPanelPosition({
      top: rect.top,
      left: rect.right + 10
    });
    setShowUserPanel(true);
  };

  return (
    <>
      <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <TextTiltleName text="TaskDrive" />
          <TextSubTitleName text="Gestión de Tareas" />
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <NavItem
              key={item.id}
              isActive={activeSection === item.id}
              icon={item.icon}
              label={item.label}
              href={item.href}
              badge={item.badge}
            />
          ))}
        </nav>

        {/* Usuario en la parte inferior */}
        <div className="p-4 border-t border-gray-200">
          <div 
            onClick={handleAvatarClick}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile?.name || 'Usuario'}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {user?.email}
              </p>
            </div>
            <div className="text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de usuario */}
      <UserPanel 
        isOpen={showUserPanel}
        onClose={() => setShowUserPanel(false)}
        position={panelPosition}
      />
    </>
  );
};

export default Sidebar; 