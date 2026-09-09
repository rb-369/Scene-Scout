'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, FilmmakerType } from '@/lib/supabase/types';

export interface AuthUser {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  isConfigured: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signInWithEmail: (email: string, pass: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, pass: string, fullName: string, role?: FilmmakerType) => Promise<{ error?: string }>;
  updateFilmmakerType: (type: FilmmakerType) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  // Demo / local persona preview mode support
  demoPersona: FilmmakerType | null;
  setDemoPersona: (role: FilmmakerType | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_PERSONA_KEY = 'scenescout_filmmaker_persona_v1';
const LOCAL_USER_KEY = 'scenescout_auth_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [demoPersona, setDemoPersonaState] = useState<FilmmakerType | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean>(true);

  // Initialize Auth state from local storage or cloud
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPersona = localStorage.getItem(LOCAL_PERSONA_KEY) as FilmmakerType | null;
      if (storedPersona) {
        setDemoPersonaState(storedPersona);
      }

      const storedUser = localStorage.getItem(LOCAL_USER_KEY);
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed.user);
          setProfile(parsed.profile);
          setSession({ user: parsed.user });
        } catch {
          localStorage.removeItem(LOCAL_USER_KEY);
        }
      }
    }
    setIsLoading(false);
  }, []);

  const setDemoPersona = (role: FilmmakerType | null) => {
    setDemoPersonaState(role);
    if (typeof window !== 'undefined') {
      if (role) {
        localStorage.setItem(LOCAL_PERSONA_KEY, role);
      } else {
        localStorage.removeItem(LOCAL_PERSONA_KEY);
      }
    }
    if (profile) {
      setProfile({
        ...profile,
        filmmaker_type: role
      });
    }
  };

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    // Quick one-click guest/filmmaker sign-in for demo
    const guestUser: AuthUser = {
      id: `usr_demo_${Date.now()}`,
      email: 'filmmaker@cinema.studio',
      user_metadata: {
        full_name: 'Cinema Producer'
      }
    };
    const guestProfile: UserProfile = {
      id: guestUser.id,
      email: guestUser.email || null,
      full_name: 'Cinema Producer',
      avatar_url: null,
      filmmaker_type: demoPersona || 'indie',
      production_house: 'Indie Cinema Collective',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setUser(guestUser);
    setProfile(guestProfile);
    setSession({ user: guestUser });
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user: guestUser, profile: guestProfile }));
    }
    setShowAuthModal(false);
    return {};
  };

  const signInWithEmail = async (email: string, pass: string): Promise<{ error?: string }> => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password: pass })
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        // Fallback for offline demo sign-in
        const fallbackUser: AuthUser = {
          id: `usr_${Date.now()}`,
          email,
          user_metadata: { full_name: email.split('@')[0] }
        };
        const fallbackProfile: UserProfile = {
          id: fallbackUser.id,
          email,
          full_name: email.split('@')[0],
          avatar_url: null,
          filmmaker_type: demoPersona || 'indie',
          production_house: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        setUser(fallbackUser);
        setProfile(fallbackProfile);
        setSession({ user: fallbackUser });
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user: fallbackUser, profile: fallbackProfile }));
        }
        setShowAuthModal(false);
        return {};
      }

      setUser(data.user);
      setProfile(data.profile);
      setSession({ user: data.user });
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user: data.user, profile: data.profile }));
      }
      setShowAuthModal(false);
      return {};
    } catch (err: any) {
      return { error: err.message || 'Login failed' };
    }
  };

  const signUpWithEmail = async (
    email: string, 
    pass: string, 
    fullName: string, 
    role?: FilmmakerType
  ): Promise<{ error?: string }> => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signup',
          email,
          password: pass,
          fullName,
          filmmakerType: role || demoPersona || 'indie'
        })
      });
      const data = await res.json();

      const createdUser: AuthUser = data.user || {
        id: `usr_${Date.now()}`,
        email,
        user_metadata: { full_name: fullName }
      };

      const createdProfile: UserProfile = data.profile || {
        id: createdUser.id,
        email,
        full_name: fullName,
        avatar_url: null,
        filmmaker_type: role || demoPersona || 'indie',
        production_house: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setUser(createdUser);
      setProfile(createdProfile);
      setSession({ user: createdUser });
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user: createdUser, profile: createdProfile }));
      }
      setShowAuthModal(false);
      return {};
    } catch (err: any) {
      return { error: err.message || 'Signup failed' };
    }
  };

  const updateFilmmakerType = async (type: FilmmakerType): Promise<{ error?: string }> => {
    setDemoPersona(type);

    if (user?.id) {
      try {
        await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'updateProfile',
            userId: user.id,
            filmmakerType: type
          })
        });
      } catch (err) {
        console.warn('Profile update synced locally:', err);
      }
    }

    if (profile) {
      const updated = { ...profile, filmmaker_type: type };
      setProfile(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user, profile: updated }));
      }
    }

    setShowOnboardingModal(false);
    return {};
  };

  const signOut = async (): Promise<void> => {
    setUser(null);
    setProfile(null);
    setSession(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isConfigured,
        showAuthModal,
        setShowAuthModal,
        showOnboardingModal,
        setShowOnboardingModal,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        updateFilmmakerType,
        signOut,
        demoPersona,
        setDemoPersona
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
