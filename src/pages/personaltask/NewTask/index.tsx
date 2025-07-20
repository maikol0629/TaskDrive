import React from 'react';
import MainLayout from '@/pages/MainLayout';
import NewTaskPage from '@/app/components/organisms/NewTaskPage';

const NewPersonalTaskPage = () => {
  return (
    <MainLayout>
      <NewTaskPage />
    </MainLayout>
  );
};

export default NewPersonalTaskPage;
