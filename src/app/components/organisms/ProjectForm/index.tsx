'use client';

import React, { useState } from 'react';
import Input from '../../atoms/Inputs/Input';
import Button from '../../atoms/Buttons/Button';
import { useAuth } from '../../../../contexts/AuthContext';
import { supabase } from '../../../../utils/supabaseClient';
import { Database } from '../../../../../types/supabase';
type ProjectInsert = Database['public']['Tables']['project']['Insert'];
type ProjectPriority = Database['public']['Enums']['project_priority'];
type ProjectStatus = Database['public']['Enums']['project_status'];

interface ProjectFormProps {
  onProjectCreated: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onProjectCreated }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState<ProjectPriority | ''>('');
  const [status, setStatus] = useState<ProjectStatus | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTeamProject, setIsTeamProject] = useState(false);

  // Opciones para los enums (ajusta según tus valores reales)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }
    if (!description.trim()) {
      setError('La descripción es obligatoria');
      return;
    }
    if (!startDate) {
      setError('La fecha de inicio es obligatoria');
      return;
    }
    if (!endDate) {
      setError('La fecha de fin es obligatoria');
      return;
    }
    if (!priority) {
      setError('La prioridad es obligatoria');
      return;
    }
    if (!status) {
      setError('El estado es obligatorio');
      return;
    }
    // is_team_project siempre tiene valor (checkbox booleano)
    if (!user) {
      setError('Debes estar autenticado para crear un proyecto');
      return;
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('La fecha de inicio no puede ser posterior a la fecha de fin');
      return;
    }
    setLoading(true);
    try {
      const projectData: ProjectInsert = {
        name: title.trim(),
        description: description.trim(),
        userid: user.id,
        startdate: startDate,
        enddate: endDate,
        priority: priority,
        status: status,
        is_team_project: isTeamProject,
      };
      const { error: insertError } = await supabase.from('project').insert([projectData]);
      if (insertError) throw insertError;
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setPriority('');
      setStatus('');
      setIsTeamProject(false);
      onProjectCreated();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Título del Proyecto *
        </label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nombre del proyecto"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6]"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción del proyecto"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6] min-h-[100px]"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Fecha de Inicio
          </label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6]"
            required
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            Fecha de Fin
          </label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6]"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Prioridad
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as ProjectPriority)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6] bg-white"
            required
          >
            <option value="">Seleccionar prioridad</option>
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6] bg-white"
            required
          >
            <option value="">Seleccionar estado</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="isTeamProject"
          type="checkbox"
          checked={isTeamProject}
          onChange={e => setIsTeamProject(e.target.checked)}
          className="h-4 w-4 text-[#5226A6] border-gray-300 rounded focus:ring-[#5226A6]"
          required
        />
        <label htmlFor="isTeamProject" className="text-sm text-gray-700 select-none">
          Proyecto de equipo
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        loading={loading}
        className="w-full bg-[#5226A6] text-white py-2 px-4 rounded-md hover:bg-[#3d1a8c] transition-colors"
      >
        {loading ? 'Creando...' : 'Crear Proyecto'}
      </Button>
    </form>
  );
};

export default ProjectForm;