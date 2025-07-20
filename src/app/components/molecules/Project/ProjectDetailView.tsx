// ProjectDetailView.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Database } from '../../../../../types/supabase';
import { supabase } from '../../../../utils/supabaseClient';
import { 
  ArrowLeftIcon, 
  EditIcon, 
  PlusIcon, 
  CalendarIcon,
  FlagIcon,
  ClockIcon,
} from 'lucide-react';
import Button from '../../atoms/Buttons/Button';
import Input from '../../atoms/Inputs/Input';
import { useAuth } from '@/contexts/AuthContext';
import ProjectTeamAssignment from '../../organisms/ProjectTeamAssignment';
import TaskItem from '../../molecules/Task/TaskItem';

type Project = Database['public']['Tables']['project']['Row'];
type Task = Database['public']['Tables']['Task']['Row'];
type TaskInsert = Database['public']['Tables']['Task']['Insert'];
type ProjectStatus = Database['public']['Enums']['project_status'];
type ProjectPriority = Database['public']['Enums']['project_priority'];
type TaskStatus = Database['public']['Enums']['TaskStatus'];

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onProjectUpdate: (updatedProject: Project) => void;
}

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus | '';
  assigned_to?: string;
}

// Nuevo tipo para miembros
interface TeamMember {
  user_id: string;
  name: string | null;
  email: string | null;
}

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  onBack,
  onProjectUpdate
}) => {
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);
  const {user} = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  // Determinar si el usuario puede asignar equipos
  const [canAssignTeams, setCanAssignTeams] = useState(false);
  // Estados para edición del proyecto
  const [projectForm, setProjectForm] = useState({
    name: project.name,
    description: project.description || '',
    startdate: project.startdate || '',
    enddate: project.enddate || '',
    priority: project.priority || '',
    status: project.status || ''
  });

  // Estados para formulario de tareas
  const [taskForm, setTaskForm] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: '',
    status: ''
  });

  // Opciones para los selects
  const priorityOptions: { value: ProjectPriority; label: string }[] = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
  ];

  const statusOptions: { value: ProjectStatus; label: string }[] = [
    { value: 'active', label: 'Activo' },
    { value: 'on_hold', label: 'En pausa' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  const taskStatusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'TODO', label: 'Pendiente' },
    { value: 'IN_PROGRESS', label: 'En progreso' },
    { value: 'COMPLETED', label: 'Completada' },

  ];

  const checkAssignTeamsPermission = useCallback(async () => {
    if (!user) return setCanAssignTeams(false);
    // Es owner del proyecto
    if (project.userid === user.id) return setCanAssignTeams(true);
    // O admin/owner de algún equipo asignado
    const { data: projectTeams } = await supabase
      .from('project_teams')
      .select('team_id')
      .eq('project_id', project.id);
    const teamIds = (projectTeams || []).map(pt => pt.team_id);
    if (teamIds.length === 0) return setCanAssignTeams(false);
    const { data: memberships } = await supabase
      .from('team_members')
      .select('team_id, role')
      .in('team_id', teamIds)
      .eq('user_id', user.id)
      .eq('status', 'active');
    const isAdmin = (memberships || []).some(m => m.role === 'owner' || m.role === 'admin');
    setCanAssignTeams(isAdmin);
  }, [user, project.id, project.userid]);

  const loadTasks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('Task')
        .select('*')
        .eq('projectid', project.id)
        .order('createdat', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }, [project.id]);

  const loadTeamMembers = useCallback(async () => {
    try {
      // 1. Obtener los equipos asignados al proyecto
      const { data: projectTeams, error: ptError } = await supabase
        .from('project_teams')
        .select('team_id')
        .eq('project_id', project.id);
      if (ptError) throw ptError;
      const teamIds = (projectTeams || []).map(pt => pt.team_id);
      if (teamIds.length === 0) {
        setTeamMembers([]);
        return;
      }
      // 2. Obtener miembros activos de esos equipos
      const { data: members, error: tmError } = await supabase
        .from('team_members')
        .select('user_id, profiles:profiles!team_members_user_id_fkey(name, email)')
        .in('team_id', teamIds)
        .eq('status', 'active');
      if (tmError) throw tmError;
      // 3. Normalizar miembros únicos
      const uniqueMembers: { [userId: string]: TeamMember } = {};
      (members || []).forEach((m: unknown) => {
        const member = m as { user_id: string; profiles: { name: string | null; email: string | null } };
        if (!uniqueMembers[member.user_id]) {
          uniqueMembers[member.user_id] = {
            user_id: member.user_id,
            name: member.profiles?.name || null,
            email: member.profiles?.email || null
          };
        }
      });
      setTeamMembers(Object.values(uniqueMembers));
    } catch (error) {
      setTeamMembers([]);
      console.error('Error loading team members:', error);
    }
  }, [project.id]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    loadTeamMembers();
  }, [loadTeamMembers]);

  useEffect(() => {
    checkAssignTeamsPermission();
  }, [checkAssignTeamsPermission]);

  // Actualizar proyecto
  const handleUpdateProject = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('project')
        .update({
          name: projectForm.name,
          description: projectForm.description || null,
          startdate: projectForm.startdate || null,
          enddate: projectForm.enddate || null,
          priority: (projectForm.priority || null) as ProjectPriority,
          status: (projectForm.status || null) as ProjectStatus,
          updatedat: new Date().toISOString()
        })
        .eq('id', project.id)
        .select()
        .single();

      if (error) throw error;
      
      onProjectUpdate(data);
      setIsEditingProject(false);
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setLoading(false);
    }
  };

  // Crear tarea
  const handleCreateTask = async () => {
    if (!taskForm.title.trim()) return;
    
    setTaskLoading(true);
    try {
      const taskData: TaskInsert = {
        title: taskForm.title,
        description: taskForm.description || null,
        projectid: project.id,
        duedate: taskForm.dueDate || null,
        status: taskForm.status || 'TODO',
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString(),
        userid: user?.id || '',
        assigned_to: taskForm['assigned_to'] || null
      };

      const { error } = await supabase
        .from('Task')
        .insert([taskData]);

      if (error) throw error;

      setTaskForm({ title: '', description: '', dueDate: '', status: '', assigned_to: '' });
      setIsAddingTask(false);
      await loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setTaskLoading(false);
    }
  };

  // Actualizar tarea
  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('Task')
        .update(updates)
        .eq('id', taskId);

      if (error) throw error;
      await loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;
    
    try {
      const { error } = await supabase
        .from('Task')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      await loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusConfig = (status: ProjectStatus | null) => {
    switch (status) {
      case 'active':
        return { label: 'Activo', color: 'bg-green-100 text-green-800' };
      case 'completed':
        return { label: 'Completado', color: 'bg-blue-100 text-blue-800' };
      case 'on_hold':
        return { label: 'En Pausa', color: 'bg-yellow-100 text-yellow-800' };
      case 'cancelled':
        return { label: 'Cancelado', color: 'bg-red-100 text-red-800' };
      default:
        return { label: 'Sin Estado', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getPriorityConfig = (priority: string | null) => {
    switch (priority) {
      case 'high':
        return { label: 'Alta', color: 'text-red-600' };
      case 'medium':
        return { label: 'Media', color: 'text-yellow-600' };
      case 'low':
        return { label: 'Baja', color: 'text-green-600' };
      default:
        return { label: 'Sin Prioridad', color: 'text-gray-500' };
    }
  };

  const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statusConfig = getStatusConfig(project.status);
  const priorityConfig = getPriorityConfig(project.priority);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600">{project.description || 'Sin descripción'}</p>
          </div>
        </div>
        <Button
          onClick={() => setIsEditingProject(!isEditingProject)}
          className="flex items-center space-x-2"
        >
          <EditIcon className="w-4 h-4" />
          <span>{isEditingProject ? 'Cancelar' : 'Editar Proyecto'}</span>
        </Button>
      </div>

      {/* Editar Proyecto */}
      {isEditingProject && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Editar Proyecto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Proyecto
              </label>
              <Input
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                placeholder="Nombre del proyecto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={projectForm.status}
                onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6]"
              >
                <option value="">Seleccionar estado</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                placeholder="Descripción del proyecto"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6] min-h-[80px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio
              </label>
              <Input
                type="date"
                value={projectForm.startdate}
                onChange={(e) => setProjectForm({ ...projectForm, startdate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Fin
              </label>
              <Input
                type="date"
                value={projectForm.enddate}
                onChange={(e) => setProjectForm({ ...projectForm, enddate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select
                value={projectForm.priority}
                onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6]"
              >
                <option value="">Seleccionar prioridad</option>
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <Button
              onClick={() => setIsEditingProject(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateProject}
              loading={loading}
              className="bg-[#5226A6] text-white"
            >
              Guardar Cambios
            </Button>
          </div>
        </div>
      )}

      {/* Información del Proyecto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CalendarIcon className="w-5 h-5 text-[#5226A6]" />
            <h3 className="font-semibold">Fechas</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Inicio: </span>
              <span>{formatDate(project.startdate)}</span>
            </div>
            <div>
              <span className="text-gray-600">Fin: </span>
              <span>{formatDate(project.enddate)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FlagIcon className="w-5 h-5 text-[#5226A6]" />
            <h3 className="font-semibold">Estado y Prioridad</h3>
          </div>
          <div className="space-y-3">
            <div>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Prioridad: </span>
              <span className={`text-sm font-medium ${priorityConfig.color}`}>
                {priorityConfig.label}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <ClockIcon className="w-5 h-5 text-[#5226A6]" />
            <h3 className="font-semibold">Progreso</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Tareas Completadas: </span>
              <span>{completedTasks} de {totalTasks}</span>
            </div>
            <div>
              <span className="text-gray-600">Progreso: </span>
              <span>{progressPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tareas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Tareas</h3>
          <Button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Nueva Tarea</span>
          </Button>
        </div>
        {isAddingTask && (
          <div className="bg-gray-50 rounded-md p-4 mb-4">
            <h4 className="text-lg font-semibold mb-2">Nueva Tarea</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <Input
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Título de la tarea"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Vencimiento
                </label>
                <Input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Descripción de la tarea"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6] min-h-[80px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asignar a
                </label>
                <select
                  value={taskForm.assigned_to || ''}
                  onChange={(e) => setTaskForm({ ...taskForm, assigned_to: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6]"
                >
                  <option value="">Sin asignar</option>
                  {teamMembers.map(member => (
                    <option key={member.user_id} value={member.user_id}>
                      {member.name || member.email || 'Desconocido'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={taskForm.status}
                  onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value as TaskStatus })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6]"
                >
                  <option value="">Seleccionar estado</option>
                  {taskStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                onClick={() => setIsAddingTask(false)}
                className="bg-gray-200 text-gray-800"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateTask}
                loading={taskLoading}
                className="bg-[#5226A6] text-white"
              >
                Crear Tarea
              </Button>
            </div>
          </div>
        )}
        {tasks.length === 0 && !isAddingTask && (
          <p className="text-center text-gray-500">No hay tareas para este proyecto.</p>
        )}
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onTaskUpdate={handleUpdateTask}
            onStatusChange={(taskId: string, status: TaskStatus) => handleUpdateTask(taskId, { status })}
            showDetails={true}
            teamMembers={teamMembers}
            {...(canAssignTeams ? { onDelete: handleDeleteTask } : {})}
          />
        ))}
      </div>

      {/* Asignar Equipos */}
      {canAssignTeams && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <PlusIcon className="w-5 h-5 text-[#5226A6]" />
            <h3 className="font-semibold">Asignar Equipos</h3>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Asigna equipos al proyecto para que los miembros puedan trabajar juntos.
          </p>
          <ProjectTeamAssignment
            project={project}
            onAssignmentChange={loadTeamMembers}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectDetailView;