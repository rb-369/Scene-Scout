'use client';

import React, { useState, useEffect } from 'react';
import { LandingPage } from '@/components/LandingPage';
import { DashboardContent } from '@/components/DashboardContent';
import { AuthProvider } from '@/contexts/AuthContext';

export default function Home() {
  const [view, setView] = useState<'landing' | 'studio'>('landing');
  const [autoStartScout, setAutoStartScout] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'studio') {
        setView('studio');
      }
      if (params.get('scout') === 'start') {
        setAutoStartScout(true);
      }
    }
  }, []);

  const handleLaunchStudio = (options?: { autoStartScout?: boolean }) => {
    if (options?.autoStartScout) {
      setAutoStartScout(true);
    }
    setView('studio');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', options?.autoStartScout ? '?view=studio&scout=start' : '?view=studio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToLanding = () => {
    setAutoStartScout(false);
    setView('landing');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AuthProvider>
      {view === 'landing' ? (
        <LandingPage onLaunchStudio={handleLaunchStudio} />
      ) : (
        <DashboardContent
          onBackToLanding={handleBackToLanding}
          initialAutoStartScout={autoStartScout}
        />
      )}
    </AuthProvider>
  );
}
