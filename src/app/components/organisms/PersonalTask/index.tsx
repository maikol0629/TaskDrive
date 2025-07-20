import React from 'react';
import Button from '../../atoms/Buttons';
import Link from 'next/link';
import { InPageTitle } from '../../atoms/Titles';
import { InPageSubTitle } from '../../atoms/Titles';

const PersonalTask = () => {
  return (
    <div>
      <Link href={'/mainpage'}>
        <Button variant="secondary">Atrás</Button>
      </Link>
      <div className='ml-55'>
        <InPageTitle text='Tareas Personales'></InPageTitle>
        <Button variant="primary">Nueva tarea</Button>
      </div>
      <div className='ml-70 mt-20'>
        <InPageSubTitle text=' No tienes tareas personales. ¡Añade una para comenzar! '></InPageSubTitle>
      </div>
    </div>
  );
};

export default PersonalTask;