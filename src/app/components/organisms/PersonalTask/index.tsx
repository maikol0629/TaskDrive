import React from 'react';
import { BackButton } from '../../atoms/Buttons';
import Link from 'next/link';
import { InPageTitle } from '../../atoms/Titles';
import { NewTaskButton } from '../../atoms/Buttons';
import { InPageSubTitle } from '../../atoms/Titles';

const PersonalTask = () => {
  return (
    <div>
      <Link href={'/mainpage'}>
        <BackButton text='← Atrás'></BackButton>
      </Link>
      <div className='ml-55'>
        <InPageTitle text='Tareas Personales'></InPageTitle>
        <NewTaskButton className='mt-[20px]' text=' + Anadir nueva tarea '></NewTaskButton>
      </div>
      <div className='ml-70 mt-20'>
        <InPageSubTitle text=' No tienes tareas personales. ¡Añade una para comenzar! '></InPageSubTitle>
      </div>
    </div>
  );
};

export default PersonalTask;