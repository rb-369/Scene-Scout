'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { DashboardContent } from '@/components/DashboardContent';

export default function StudioPage() {
  const router = useRouter();

  return (
    <AuthProvider>
      <DashboardContent onBackToLanding={() => router.push('/')} />
    </AuthProvider>
  );
}
