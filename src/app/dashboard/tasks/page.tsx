'use client';

import React, { useState } from 'react';
import TaskList from '../../components/organisms/TaskList';
import TaskForm from '../../components/organisms/TaskForm';
import Button from '../../components/atoms/Buttons/Button';

export default function TasksPage() {
  const [showTaskForm, setShowTaskForm] = useState(false);

  const handleAddTask = () => {
    setShowTaskForm(true);
  };

  const handleTaskCreated = () => {
    setShowTaskForm(false);
  };

  const handleBackFromTaskForm = () => {
    setShowTaskForm(false);
  };

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
          <h2 className="text-xl font-semibold text-gray-900">Nueva Tarea</h2>
        </div>
        
        <div className="max-w-2xl">
          <TaskForm onTaskCreated={handleTaskCreated} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 mt-1">
            Gestiona tus tareas personales
          </p>
        </div>
        <Button
          onClick={handleAddTask}
          variant="primary"
        >
          + Añadir nueva tarea
        </Button>
      </div>
      
      <TaskList onAddTask={handleAddTask} />
    </div>
  );
} 