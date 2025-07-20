'use client';

import React, { useState, useEffect, useCallback } from 'react';
import TaskItem from '../../molecules/Task/TaskItem';
import EmptyState from '../../molecules/EmptyState';
import { useAuth } from '../../../../contexts/AuthContext';
import { supabase } from '../../../../utils/supabaseClient';
import { Database } from '../../../../../types/supabase';

type Task = Database['public']['Tables']['Task']['Row'];
type TaskStatus = Database['public']['Enums']['TaskStatus'];

interface TaskListProps {
  onAddTask?: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ onAddTask }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Task')
        .select('*')
        .eq('userid', user.id)
        .is('projectid', null)
        .order('createdat', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [user, fetchTasks]);

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      const { error } = await supabase
        .from('Task')
        .update({ 
          status,
          updatedat: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;

      // Update local state
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, status, updatedat: new Date().toISOString() } : task
        )
      );
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      // Prepare the update data
      const updateData = {
        ...updates,
        updatedat: new Date().toISOString()
      };

      const { error } = await supabase
        .from('Task')
        .update(updateData)
        .eq('id', taskId);

      if (error) throw error;

      // Update local state
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, ...updateData } : task
        )
      );

      return { success: true };
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;
    try {
      const { error } = await supabase
        .from('Task')
        .delete()
        .eq('id', taskId);
      if (error) throw error;
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
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
          onClick={fetchTasks}
          className="mt-4 text-[#5226A6] hover:text-[#3d1a8c]"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tienes tareas personales. ¡Añade una para comenzar!"
        actionText="Añadir primera tarea"
        onAction={onAddTask}
      />
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={handleStatusChange}
          onTaskUpdate={handleTaskUpdate}
          onDelete={handleDeleteTask}
          showDetails={false}
        />
      ))}
    </div>
  );
};

export default TaskList;
