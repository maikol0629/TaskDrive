'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import { supabase } from '../../../../utils/supabaseClient';
import { Tables } from '../../../../../types/supabase';
import TaskForm from '../../../components/organisms/TaskForm';
import Button from '../../../components/atoms/Buttons/Button';
import ProjectTeamAssignment from '../../../components/organisms/ProjectTeamAssignment';

type Project = Tables<'project'>;
type Task = Tables<'Task'>;

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTeamAssignment, setShowTeamAssignment] = useState(false);
  const [error, setError] = useState('');

  const projectId = params.id as string;


  const loadProjectAndTasks = useCallback(async () => {
    try {
      setLoading(true);
      
      // Cargar proyecto
      const { data: projectData, error: projectError } = await supabase
        .from('project')
        .select('*')
        .eq('id', projectId)
        .eq('userid', user!.id)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Cargar tareas del proyecto
      const { data: tasksData, error: tasksError } = await supabase
        .from('Task')
        .select('*')
        .eq('projectid', projectId)
        .eq('userid', user!.id)
        .order('createdat', { ascending: false });

      if (tasksError) throw tasksError;
      setTasks(tasksData || []);

    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [projectId, user]);

  useEffect(() => {
    if (user && projectId) {
      loadProjectAndTasks();
    }
  }, [user, projectId, loadProjectAndTasks]);

  const handleAddTask = () => {
    setShowTaskForm(true);
  };

  const handleTaskCreated = () => {
    setShowTaskForm(false);
    loadProjectAndTasks(); // Recargar tareas
  };

  const handleBackFromTaskForm = () => {
    setShowTaskForm(false);
  };

  const handleTeamAssignmentChange = () => {
    // Podrías recargar información de equipos asignados si es necesario
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5226A6]"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">
          {error || 'Proyecto no encontrado'}
        </p>
        <Button
          onClick={() => router.push('/dashboard/projects')}
          variant="secondary"
        >
          Volver a Proyectos
        </Button>
      </div>
    );
  }

  if (showTaskForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackFromTaskForm}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span>← Atrás</span>
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            Nueva Tarea para {project.name}
          </h2>
        </div>
        
        <div className="max-w-2xl">
          <TaskForm 
            onTaskCreated={handleTaskCreated}
            projectId={projectId}
          />
        </div>
      </div>
    );
  }

  if (showTeamAssignment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowTeamAssignment(false)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span>← Atrás</span>
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            Gestionar equipos del proyecto
          </h2>
        </div>
        
        <ProjectTeamAssignment
          project={project}
          onAssignmentChange={handleTeamAssignmentChange}
          onCancel={() => setShowTeamAssignment(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <button
              onClick={() => router.push('/dashboard/projects')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span>← Volver a Proyectos</span>
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          {project.description && (
            <p className="text-gray-600 mt-1">{project.description}</p>
          )}
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span className={`px-2 py-1 rounded-full text-xs ${
              project.status === 'active' ? 'bg-green-100 text-green-800' :
              project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {project.status === 'active' ? 'Activo' :
               project.status === 'completed' ? 'Completado' :
               project.status === 'on_hold' ? 'En pausa' : 'Cancelado'}
            </span>
            {project.priority && (
              <span className={`px-2 py-1 rounded-full text-xs ${
                project.priority === 'high' ? 'bg-red-100 text-red-800' :
                project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.priority === 'high' ? 'Alta' :
                 project.priority === 'medium' ? 'Media' : 'Baja'}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowTeamAssignment(true)}
            variant="secondary"
          >
            👥 Gestionar equipos
          </Button>
          <Button
            onClick={handleAddTask}
            variant="primary"
          >
            + Añadir tarea
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tareas del Proyecto ({tasks.length})
        </h3>
        
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              No hay tareas en este proyecto aún
            </p>
            <Button
              onClick={handleAddTask}
              variant="secondary"
            >
              Añadir primera tarea
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    {task.description && (
                      <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    task.status === 'TODO' ? 'bg-gray-100 text-gray-800' :
                    task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.status === 'TODO' ? 'Pendiente' :
                     task.status === 'IN_PROGRESS' ? 'En progreso' : 'Completada'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 