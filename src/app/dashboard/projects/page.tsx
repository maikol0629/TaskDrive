'use client';

import React, { useState } from 'react';
import ProjectList from '../../components/organisms/ProjectList';
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
            
      <ProjectList onAddProject={handleAddProject} />
    </div>
  );
} 