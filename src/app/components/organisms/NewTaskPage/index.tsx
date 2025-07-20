import React from 'react';
import { InPageTitle, InPageSubTitle } from '@/app/components/atoms/Titles';
import TaskForm from '@/app/components/molecules/NewTaskForm';

const NewTaskPage = () => {
  return (
    <div className="w-full min-h-[100vh] flex flex-col items-center justify-between px-4 py-6">
      {/* Contenido superior */}
      <div className="flex flex-col items-center w-full gap-8 max-w-[700px]">
        <InPageTitle text="Tareas Personales" />
        <TaskForm />
      </div>

      {/* Subtítulo */}
      <div className="mt-6 max-w-[700px] text-center px-4">
        <InPageSubTitle text="Recuerda que puedes editar o eliminar esta tarea más adelante desde el panel principal." />
      </div>
    </div>
  );
};

export default NewTaskPage;


