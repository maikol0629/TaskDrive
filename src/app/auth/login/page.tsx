'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '../../components/organisms/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  const handleSwitchToRegister = () => {
    router.push('/auth/register');
  };

  return <LoginForm onSwitchToRegister={handleSwitchToRegister} />;
} 