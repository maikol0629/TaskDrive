'use client';

import React, { useState } from 'react';
import { Database } from '../../../../../types/supabase';
import { EditIcon, SaveIcon, XIcon, CalendarIcon, CheckIcon } from 'lucide-react';
import Input from '../../atoms/Inputs/Input';

type Task = Database['public']['Tables']['Task']['Row'];
type TaskStatus = Database['public']['Enums']['task_status_enum'];
type TaskPriority = Database['public']['Enums']['priority_enum'];

interface TaskItemProps {
  task: Task;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
  showDetails?: boolean;
  teamMembers?: { user_id: string; name: string | null; email: string | null }[];
}

interface TaskFormData {
  title: string;
  description: string;
  duedate: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to?: string;
}

const getPriorityColor = (priority: TaskPriority | null) => {
  switch (priority) {
    case 'HIGH': return 'bg-red-100 text-red-800';
    case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
    case 'LOW': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: TaskStatus | null) => {
  switch (status) {
    case 'TODO': return 'bg-blue-100 text-blue-800';
    case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800';
    case 'COMPLETED': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onStatusChange, onTaskUpdate, onDelete, showDetails = false, teamMembers }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: task.title,
    description: task.description || '',
    duedate: task.duedate || '',
    status: task.status,
    priority: task.priority
  });

  const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'TODO', label: 'Pendiente' },
    { value: 'IN_PROGRESS', label: 'En progreso' },
    { value: 'COMPLETED', label: 'Completada' },
  ];

  const priorityOptions: { value: TaskPriority; label: string }[] = [
    { value: 'HIGH', label: 'Alta' },
    { value: 'MEDIUM', label: 'Media' },
    { value: 'LOW', label: 'Baja' },
  ];

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que se abra el modo edición
    if (!onStatusChange) return;

    const nextStatus: TaskStatus =
      task.status === 'TODO'
        ? 'IN_PROGRESS'
        : task.status === 'IN_PROGRESS'
        ? 'COMPLETED'
        : 'TODO';

    onStatusChange(task.id, nextStatus);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Resetear formulario a valores originales
    setFormData({
      title: task.title,
      description: task.description || '',
      duedate: task.duedate || '',
      status: task.status,
      priority: task.priority
    });
  };

  const handleSaveEdit = async () => {
    if (!onTaskUpdate || !formData.title.trim()) return;

    setIsLoading(true);
    try {
      await onTaskUpdate(task.id, {
        title: formData.title,
        description: formData.description || null,
        duedate: formData.duedate || null,
        status: formData.status,
        priority: formData.priority,
        updatedat: new Date().toISOString()
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const assignedMember = teamMembers?.find(m => m.user_id === task.assigned_to);

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg border-2 border-[#5226A6] shadow-md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Título de la tarea"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción de la tarea"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6] min-h-[60px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6]"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6]"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Vencimiento
              </label>
              <Input
                type="date"
                value={formData.duedate}
                onChange={(e) => setFormData({ ...formData, duedate: e.target.value })}
                className="w-full"
              />
            </div>
          </div>

          {teamMembers && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asignar a
              </label>
              <select
                value={formData['assigned_to'] || ''}
                onChange={e => setFormData({ ...formData, assigned_to: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6]"
              >
                <option value="">Sin asignar</option>
                {teamMembers.map(member => (
                  <option key={member.user_id} value={member.user_id}>
                    {member.name || member.email || member.user_id}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancelEdit}
              disabled={isLoading}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5226A6] disabled:opacity-50"
            >
              <XIcon className="w-4 h-4 inline mr-1" />
              Cancelar
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={isLoading || !formData.title.trim()}
              className="px-3 py-2 text-sm font-medium text-white bg-[#5226A6] border border-transparent rounded-md hover:bg-[#4a1f94] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5226A6] disabled:opacity-50"
            >
              <SaveIcon className="w-4 h-4 inline mr-1" />
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white p-4 rounded-lg border border-gray-200 shadow-md group transition hover:shadow-lg relative"
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">{task.title}</h4>
          {task.description && <p className="text-sm text-gray-700">{task.description}</p>}
        </div>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onStatusChange && (
            <button
              onClick={handleStatusClick}
              className="p-2 text-green-600 hover:bg-green-100 rounded-full"
              title="Cambiar estado"
            >
              <CheckIcon className="w-4 h-4" />
            </button>
          )}
          {onTaskUpdate && (
            <button
              onClick={handleEditClick}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
              title="Editar tarea"
            >
              <EditIcon className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-red-600 hover:bg-red-100 rounded-full"
              title="Eliminar tarea"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {showDetails && (
        <div className="mt-2 space-y-1 text-xs text-gray-600 border-t pt-2">
          <div className="flex items-center gap-2">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>{task.status}</span>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>{task.priority}</span>
            <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {formatDate(task.duedate)}</span>
          </div>
          {teamMembers && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Asignado a:</span>
              {assignedMember ? (
                <span>{assignedMember.name || assignedMember.email || assignedMember.user_id}</span>
              ) : (
                <span className="italic text-gray-400">Sin asignar</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskItem;