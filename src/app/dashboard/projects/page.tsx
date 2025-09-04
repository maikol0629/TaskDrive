'use client';

import React, { useState } from 'react';
import ProjectForm from '../../components/organisms/ProjectForm';

export default function ProjectsPage() {
  const [showProjectForm, setShowProjectForm] = useState(false);

  const handleAddProject = () => {
    setShowProjectForm(true);
  };

  const handleProjectCreated = () => {
    setShowProjectForm(false);
  };

  const handleBackFromProjectForm = () => {
    setShowProjectForm(false);
  };

  if (showProjectForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackFromProjectForm}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span>← Atrás</span>
          </button>
          <h2 className="text-xl font-semibold text-gray-900">Nuevo Proyecto</h2>
        </div>
        
        <div className="max-w-2xl">
          <ProjectForm onProjectCreated={handleProjectCreated} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Mis Proyectos</h1>
        <button
          onClick={handleAddProject}
          className="bg-[#5226A6] text-white px-4 py-2 rounded-lg hover:bg-[#3d1a8c] transition-colors"
        >
          + Nuevo Proyecto
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Lista de proyectos temporalmente deshabilitada</h3>
          <p className="text-gray-600 mb-4">
            Hay un problema de compilación con el componente ProjectList que estamos solucionando.
          </p>
          <p className="text-sm text-gray-500">
            Mientras tanto, puedes crear nuevos proyectos usando el botón de arriba.
          </p>
        </div>
      </div>
    </div>
  );
}
