'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SignupForm from '../../components/organisms/SignupForm';

export default function RegisterPage() {
  const router = useRouter();

  const handleSwitchToLogin = () => {
    router.push('/auth/login');
  };

  return <SignupForm onSwitchToLogin={handleSwitchToLogin} />;
} 