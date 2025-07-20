'use client';

import React, { useState, useEffect } from 'react';
import Button from '../../atoms/Buttons/Button';
import { useAuth } from '../../../../contexts/AuthContext';
import { supabase } from '../../../../utils/supabaseClient';
import { Database } from '../../../../../types/supabase';

type TaskInsert = Database['public']['Tables']['Task']['Insert'];
type TaskStatus = Database['public']['Enums']['TaskStatus'];
type TaskPriority = Database['public']['Enums']['Priority'];
type Task = Database['public']['Tables']['Task']['Row'];
interface TaskFormProps {
  onTaskCreated: () => void;
  task?: Task | null; // For editing existing tasks
  onCancel?: () => void; // For canceling edit mode
  projectId?: string; // For creating tasks within a project
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated, task, onCancel, projectId }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dueDate, setDueDate] = useState('');

  const isEditing = !!task;

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'TODO');
      setPriority(task.priority || 'MEDIUM');
      setDueDate(task.duedate || '');
    }
  }, [task]);

  const statusOptions = [
    { value: 'TODO', label: 'Por Hacer' },
    { value: 'IN_PROGRESS', label: 'En Progreso' },
    { value: 'COMPLETED', label: 'Completado' }
  ] as const;

  const priorityOptions = [
    { value: 'LOW', label: 'Baja' },
    { value: 'MEDIUM', label: 'Media' },
    { value: 'HIGH', label: 'Alta' }
  ] as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }
    if (!description.trim()) {
      setError('La descripción es obligatoria');
      return;
    }
    if (!dueDate) {
      setError('La fecha límite es obligatoria');
      return;
    }
    if (!status) {
      setError('El estado es obligatorio');
      return;
    }
    if (!priority) {
      setError('La prioridad es obligatoria');
      return;
    }
    if (!user) {
      setError('Debes estar autenticado para crear/editar tareas');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEditing && task) {
        // Update existing task
        const { error } = await supabase
          .from('Task')
          .update({
            title: title.trim(),
            description: description.trim(),
            status,
            priority,
            duedate: dueDate,
            updatedat: new Date().toISOString()
          })
          .eq('id', task.id);

        if (error) throw error;
      } else {
        // Create new task
        const taskData: TaskInsert = {
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          duedate: dueDate,
          userid: user.id,
          projectid: projectId || null, // Include projectId if provided
          createdat: new Date().toISOString(),
          updatedat: new Date().toISOString()
        };

        const { error } = await supabase
          .from('Task')
          .insert([taskData]);

        if (error) throw error;
      }

      // Reset form
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setPriority('MEDIUM');
      setDueDate('');
      
      onTaskCreated();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    // Reset form
    setTitle('');
    setDescription('');
    setStatus('TODO');
    setPriority('MEDIUM');
    setDueDate('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título de la tarea"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6]"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción de la tarea"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6] min-h-[100px]"
          required
        />
      </div>

      <div>
        <label htmlFor="duedate" className="block text-sm font-medium text-gray-700">
          Fecha límite <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="duedate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6]"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Estado <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6] bg-white"
            required
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Prioridad <span className="text-red-500">*</span>
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6] bg-white"
            required
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          loading={loading}
          className="flex-1 bg-[#5226A6] text-white py-2 px-4 rounded-md hover:bg-[#3d1a8c] transition-colors"
        >
          {loading ? (isEditing ? 'Actualizando...' : 'Creando...') : (isEditing ? 'Actualizar Tarea' : 'Crear Tarea')}
        </Button>
        
        {(isEditing || onCancel) && (
          <Button
            type="button"
            onClick={handleCancel}
            variant="secondary"
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
