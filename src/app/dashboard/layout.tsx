'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useProfileCheck } from '../hooks/useProfileCheck';
import Sidebar from '../components/organisms/Sidebar';
import Header from '../components/organisms/Header';
import ProfileSetup from '../components/organisms/ProfileSetup';

// Mapeo de rutas a títulos
const getPageTitle = (pathname: string): string => {
  if (pathname === '/dashboard' || pathname === '/dashboard/tasks') return 'Tareas Personales';
  if (pathname === '/dashboard/projects') return 'Proyectos';
  if (pathname.startsWith('/dashboard/projects/')) return 'Detalle del Proyecto';
  if (pathname === '/dashboard/teams') return 'Equipos';
  if (pathname === '/dashboard/profile') return 'Perfil';
  return 'Dashboard';
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isProfileComplete, loading: profileLoading, createProfile } = useProfileCheck();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // Mostrar loading mientras se verifican la auth y el perfil
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5226A6]"></div>
      </div>
    );
  }

  // Redirigir si no hay usuario
  if (!user) {
    return null;
  }

  // Mostrar configuración de perfil si no está completo
  if (!isProfileComplete) {
    return <ProfileSetup onProfileCreated={createProfile} />;
  }

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full">
          <Sidebar />
        </div>
        
        {/* Main content */}
        <div className="flex-1 ml-64">
          {/* Header */}
          <Header title={pageTitle} />
          
          {/* Page content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 