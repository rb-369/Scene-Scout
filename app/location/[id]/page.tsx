import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { LocationDetailPage } from '@/components/LocationDetailPage';

export default async function LocationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AuthProvider>
      <LocationDetailPage locationId={id} />
    </AuthProvider>
  );
}
