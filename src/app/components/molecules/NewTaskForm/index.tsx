import React, { useState } from 'react';
import { TextInput, TextArea, DateInput } from '@/app/components/atoms/Inputs';
import { NewTaskButton, SecondaryButton } from '@/app/components/atoms/Buttons';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  return (
    <form
      className="
        bg-white p-10 rounded-[8px] shadow-md w-full max-w-[700px]
        flex flex-col gap-y-6
      "
    >
      {/* Campo: Título */}
      <div>
        <label className="block mb-2 text-[18px] font-semibold text-[#2B222C]">
          Título de la tarea
        </label>
        <TextInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Terminar informe"
        />
      </div>

      {/* Campo: Descripción */}
      <div>
        <label className="block mb-2 text-[18px] font-semibold text-[#2B222C]">
          Descripción
        </label>
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalles de la tarea..."
        />
      </div>

      {/* Campo: Fecha */}
      <div>
        <label className="block mb-2 text-[18px] font-semibold text-[#2B222C]">
          Fecha límite
        </label>
        <DateInput
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-4 mt-6">
        <SecondaryButton text="Cancelar" />
        <NewTaskButton text="Guardar tarea" />
      </div>
    </form>
  );
};

export default TaskForm;




