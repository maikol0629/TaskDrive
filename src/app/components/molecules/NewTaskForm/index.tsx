import React, { useState, ChangeEvent, FC } from 'react';
import Input from '@/app/components/atoms/Inputs';
import Button from '@/app/components/atoms/Buttons';

const TaskForm: FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');

  return (
    <form className="bg-white p-10 rounded-[8px] shadow-md w-full max-w-[700px] flex flex-col gap-y-6">
      {/* Campo: Título */}
      <div>
        <label className="block mb-2 text-[18px] font-semibold text-[#2B222C]">
          Título de la tarea
        </label>
        <Input
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder="Ej: Terminar informe"
        />
      </div>

      {/* Campo: Descripción */}
      <div>
        <label className="block mb-2 text-[18px] font-semibold text-[#2B222C]">
          Descripción
        </label>
        <textarea
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#5226A6] focus:ring-[#5226A6] focus:ring-1"
          value={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          placeholder="Detalles de la tarea..."
        />
      </div>

      {/* Campo: Fecha */}
      <div>
        <label className="block mb-2 text-[18px] font-semibold text-[#2B222C]">
          Fecha límite
        </label>
        <Input
          type="date"
          value={dueDate}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)}
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-4 mt-6">
        <Button variant="secondary" type="button">Cancelar</Button>
        <Button variant="primary" type="submit">Guardar tarea</Button>
      </div>
    </form>
  );
};

export default TaskForm;




