'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import Button from '../../atoms/Buttons/Button';
import Avatar from '../../atoms/Avatar';

interface ProfileSetupProps {
  onProfileCreated: (data: { name: string; username?: string }) => Promise<boolean>;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onProfileCreated }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; username?: string }>({});

  const validateField = (field: string, value: string) => {
    let error = '';
    if (field === 'name') {
      if (!value.trim()) {
        error = 'El nombre es requerido';
      } else if (value.trim().length < 3) {
        error = 'El nombre debe tener al menos 3 caracteres';
      }
    }
    if (field === 'username') {
      if (value && value.trim().length < 3) {
        error = 'El nombre de usuario debe tener al menos 3 caracteres';
      }
    }
    setErrors(prev => ({ ...prev, [field]: error }));
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }
    if (formData.name.trim().length < 3) {
      return;
    }
    if (formData.username && formData.username.trim().length < 3) {
      return;
    }
    setLoading(true);

    try {
      const success = await onProfileCreated({
        name: formData.name,
        username: formData.username || undefined
      });

      if (!success) {
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Avatar 
              name={formData.name}
              email={user?.email}
              size="lg"
            />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            ¡Bienvenido!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Completa tu perfil para comenzar a usar GestionTareas
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* {error && ( // This block was removed
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )} */}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre completo *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#5226A6] focus:border-[#5226A6] focus:z-10 sm:text-sm"
                placeholder="Tu nombre completo"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Nombre de usuario (opcional)
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#5226A6] focus:border-[#5226A6] focus:z-10 sm:text-sm"
                placeholder="usuario123"
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-500">{errors.username}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Puedes cambiarlo más tarde en la configuración
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Tu cuenta:</p>
                <p>{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
              disabled={loading || !!errors.name || !!errors.username || !formData.name.trim()}
            >
              {loading ? 'Creando perfil...' : 'Crear perfil'}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Podrás completar tu perfil más tarde desde la configuración
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup; 