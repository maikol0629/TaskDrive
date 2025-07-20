'use client';

import React, { useState } from 'react';
import { Database } from '../../../../../types/supabase';
import { ChevronDownIcon, CalendarIcon, UsersIcon, MoreVerticalIcon, TrashIcon, EditIcon, FolderIcon } from 'lucide-react';

type Project = Database['public']['Tables']['project']['Row'];
type ProjectStatus = Database['public']['Enums']['project_status'];

interface ProjectItemProps {
  project: Project;
  onStatusChange: (projectId: string, status: ProjectStatus) => void;
  onDelete?: (projectId: string) => void;
  onEdit?: (project: Project) => void;
  onClick?: (project: Project) => void; // Nueva prop para hacer clickable
  progress?: number; // Nueva prop
  isOwn?: boolean; // Nueva prop
}

const ProjectItem: React.FC<ProjectItemProps> = ({ 
  project, 
  onStatusChange, 
  onDelete,
  onEdit,
  onClick,
  progress = 0, // Usar la prop, default 0
  isOwn = false
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const getStatusConfig = (status: ProjectStatus | null) => {
    switch (status) {
      case 'active':
        return {
          label: 'Activo',
          color: 'bg-green-100 text-green-800 border-green-200',
          dot: 'bg-green-400'
        };
      case 'completed':
        return {
          label: 'Completado',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          dot: 'bg-blue-400'
        };
      case 'on_hold':
        return {
          label: 'En Pausa',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          dot: 'bg-yellow-400'
        };
      case 'cancelled':
        return {
          label: 'Cancelado',
          color: 'bg-red-100 text-red-800 border-red-200',
          dot: 'bg-red-400'
        };
      case null:
      default:
        return {
          label: 'Sin Estado',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          dot: 'bg-gray-400'
        };
    }
  };

  const getPriorityConfig = (priority: string | null) => {
    switch (priority) {
      case 'urgent':
        return { label: 'Urgente', color: 'text-red-700 font-bold' };
      case 'high':
        return { label: 'Alta', color: 'text-red-600' };
      case 'medium':
        return { label: 'Media', color: 'text-yellow-600' };
      case 'low':
        return { label: 'Baja', color: 'text-green-600' };
      case null:
      default:
        return { label: 'Sin Prioridad', color: 'text-gray-500' };
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

  const statusConfig = getStatusConfig(project.status);
  const priorityConfig = getPriorityConfig(project.priority);

  const handleStatusChange = (newStatus: ProjectStatus) => {
    onStatusChange(project.id, newStatus);
    setShowDropdown(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se dispare el click del proyecto
    if (onDelete && window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      onDelete(project.id);
    }
    setShowActionsMenu(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se dispare el click del proyecto
    if (onEdit) {
      onEdit(project);
    }
    setShowActionsMenu(false);
  };

  const handleProjectClick = () => {
    if (onClick) {
      onClick(project);
    }
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se dispare el click del proyecto
    setShowDropdown(!showDropdown);
  };

  const handleActionsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se dispare el click del proyecto
    setShowActionsMenu(!showActionsMenu);
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 relative ${
        onClick ? 'hover:shadow-md hover:border-[#5226A6] cursor-pointer' : 'hover:shadow-md'
      }`}
      onClick={handleProjectClick}
    >
      {/* Header del proyecto */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#5226A6] bg-opacity-10 rounded-lg flex items-center justify-center">
            <FolderIcon className="w-5 h-5 text-[#5226A6]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg leading-tight flex items-center">
              {project.name}
              {isOwn ? (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-[#5226A6] text-white">Propio</span>
              ) : (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-gray-300 text-gray-700">Equipo</span>
              )}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {project.description || 'Sin descripción'}
            </p>
          </div>
        </div>
        
        {/* Menú de acciones */}
        <div className="relative">
          <button
            onClick={handleActionsClick}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVerticalIcon className="w-4 h-4 text-gray-500" />
          </button>
          
          {showActionsMenu && (
            <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <EditIcon className="w-4 h-4" />
                  <span>Editar</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span>Eliminar</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progreso</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#5226A6] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Información del proyecto */}
      <div className="space-y-3 mb-4">
        {/* Fechas */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <CalendarIcon className="w-4 h-4" />
            <span>Inicio: {formatDate(project.startdate)}</span>
          </div>
          {project.enddate && (
            <div className="flex items-center space-x-1">
              <CalendarIcon className="w-4 h-4" />
              <span>Fin: {formatDate(project.enddate)}</span>
            </div>
          )}
        </div>

        {/* Prioridad */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Prioridad:</span>
          <span className={`text-sm font-medium ${priorityConfig.color}`}>
            {priorityConfig.label}
          </span>
        </div>
      </div>

      {/* Estado y acciones */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <button
            onClick={handleDropdownClick}
            className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${statusConfig.color}`}
          >
            <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
            <span>{statusConfig.label}</span>
            <ChevronDownIcon className="w-3 h-3" />
          </button>

          {showDropdown && (
            <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[140px]">
              {(['planning', 'active', 'completed', 'on_hold', 'cancelled'] as ProjectStatus[]).map((status) => {
                const config = getStatusConfig(status);
                return (
                  <button
                    key={status}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(status);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <div className={`w-2 h-2 rounded-full ${config.dot}`} />
                    <span>{config.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center text-xs text-gray-500">
          <UsersIcon className="w-3 h-3 mr-1" />
          <span>0 miembros</span>
        </div>
      </div>

      {/* Indicador visual de que es clickable */}
      {onClick && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-[#5226A6] rounded-full opacity-50"></div>
        </div>
      )}
    </div>
  );
};

export default ProjectItem;