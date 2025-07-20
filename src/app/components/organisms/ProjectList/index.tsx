'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ProjectItem from '../../../components/molecules/Project/ProjectItem';
import EmptyState from '../../molecules/EmptyState';
import { useAuth } from '../../../../contexts/AuthContext';
import { supabase } from '../../../../utils/supabaseClient';
import ProjectDetailView from '../../molecules/Project/ProjectDetailView';
import { Database } from '../../../../../types/supabase';
type Project = Database['public']['Tables']['project']['Row'];
type ProjectStatus = Database['public']['Enums']['project_status'];

interface ProjectListProps {
  onAddProject?: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ onAddProject }) => {

  
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectProgress, setProjectProgress] = useState<{ [projectId: string]: number }>({});

  const fetchProjects = useCallback(async () => {
    if (!user) return;
  
    try {
      setLoading(true);
      
      // Usar rpc para evitar problemas de RLS y tipos complejos
      const { data, error } = await supabase
        .rpc('get_user_projects', { user_id: user.id });
      
      if (error) throw error;
      
      if (data && Array.isArray(data)) {
        setProjects(data as Project[]);
      } else {
        setProjects([]);
      }
      
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchProjectsProgress = useCallback(async () => {
    const progressMap: { [projectId: string]: number } = {};
    await Promise.all(projects.map(async (project) => {
      const { data: tasks, error } = await supabase
        .from('Task')
        .select('status')
        .eq('projectid', project.id);
      if (!error && tasks) {
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'COMPLETED').length;
        progressMap[project.id] = total > 0 ? Math.round((completed / total) * 100) : 0;
      } else {
        progressMap[project.id] = 0;
      }
    }));
    setProjectProgress(progressMap);
  }, [projects]);

  useEffect(() => {
    fetchProjects();
  }, [user, fetchProjects]);

  useEffect(() => {
    if (projects.length > 0) {
      fetchProjectsProgress();
    }
  }, [projects, fetchProjectsProgress]);

  const handleStatusChange = async (projectId: string, status: ProjectStatus) => {
    try {
      const { error } = await supabase
        .from('project')
        .update({ status })
        .eq('id', projectId);

      if (error) throw error;

      setProjects(prev =>
        prev.map(project =>
          project.id === projectId ? { ...project, status } : project
        )
      );
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('project')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(prev => prev.filter(project => project.id !== projectId));
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };
  const handleBackFromDetail = () => {
    setSelectedProject(null);
  };
  const handleProjectUpdate = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    setSelectedProject(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5226A6]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={fetchProjects}
          className="mt-4 text-[#5226A6] hover:text-[#3d1a8c]"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (selectedProject) {
    return (
      <ProjectDetailView
        project={selectedProject}
        onBack={handleBackFromDetail}
        onProjectUpdate={handleProjectUpdate}
      />
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-start w-full h-full bg-[#f4edf9] p-10">
        <EmptyState
          title="No tienes proyectos. ¡Crea uno para comenzar!"
          description="Los proyectos te ayudan a organizar tareas relacionadas y colaborar con tu equipo."
          actionText="+ Crear nuevo proyecto"
          onAction={onAddProject}
        />
        
        <button className="mt-6 text-[#5226A6] hover:underline">
          Ver plantillas de proyectos
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f4edf9] min-h-full p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Mis Proyectos</h1>
          <button
            onClick={onAddProject}
            className="bg-[#5226A6] text-white px-4 py-2 rounded-lg hover:bg-[#3d1a8c] transition-colors"
          >
            + Nuevo Proyecto
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteProject}
              onClick={() => handleProjectClick(project)}
              progress={projectProgress[project.id] || 0}
              isOwn={Boolean(user && project.userid === user.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;