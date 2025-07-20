'use client';

import React, { useState } from 'react';
import LoginForm from '@/app/components/organisms/LoginForm';
import RegisterForm from '@/app/components/organisms/SignupForm';
import { TextTiltleName } from '../../atoms/Titles';
import { TextSubTitleName } from '../../atoms/Titles';

const AuthContainer: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <div>

         {/* Header */}
      <header className="p-6">
        <TextTiltleName text="TaskDrive" />
        <TextSubTitleName text="Gestión de tareas" />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          {/* Tagline */}
          <div className="text-center">
            <h2 className="text-xl text-gray-700 font-medium">La productividad empieza aquí</h2>
          

          {isLogin ? (
        <LoginForm onSwitchToRegister={switchToRegister} />
      ) : (
        <RegisterForm onSwitchToLogin={switchToLogin} />
      )}
      </div>
        </div>
      </div>
      
    </div>
  );
};

export default AuthContainer;