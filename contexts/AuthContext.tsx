'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { UserProfile, FilmmakerType } from '@/lib/supabase/types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
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
  // Demo / local preview mode support
  demoPersona: FilmmakerType | null;
  setDemoPersona: (role: FilmmakerType | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_PERSONA_KEY = 'scenescout_filmmaker_persona_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [demoPersona, setDemoPersonaState] = useState<FilmmakerType | null>(null);

  const configured = isSupabaseConfigured();

  // Fetch or create profile row in Supabase
  const fetchProfile = useCallback(async (userId: string, userEmail?: string, metadata?: Record<string, unknown>) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist yet, insert a basic record
        const fallbackName = (metadata?.full_name as string) || (metadata?.name as string) || userEmail?.split('@')[0] || 'Filmmaker';
        const initialRole = (metadata?.filmmaker_type as FilmmakerType) || null;

        const newProfile: UserProfile = {
          id: userId,
          email: userEmail || null,
          full_name: fallbackName,
          avatar_url: (metadata?.avatar_url as string) || (metadata?.picture as string) || null,
          filmmaker_type: initialRole,
          production_house: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: inserted } = await supabase
          .from('profiles')
          .insert(newProfile as unknown as never)
          .select()
          .single();

        return (inserted as unknown as UserProfile) || newProfile;
      }

      return (data as unknown as UserProfile) || null;
    } catch (err) {
      console.error('Error loading Supabase profile:', err);
      return null;
    }
  }, []);

  // Initialize Auth state
  useEffect(() => {
    // Load local persona preference if present
    if (typeof window !== 'undefined') {
      const storedPersona = localStorage.getItem(LOCAL_PERSONA_KEY) as FilmmakerType | null;
      if (storedPersona) {
        setDemoPersonaState(storedPersona);
      }
    }

    if (!configured) {
      setIsLoading(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Get current session
    const initAuth = async () => {
      try {
        const { data } = await (supabase.auth as any).getSession();
        const currentSession = (data?.session as Session | null) ?? null;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          const p = await fetchProfile(currentSession.user.id, currentSession.user.email, currentSession.user.user_metadata);
          setProfile(p);
          // If user has no filmmaker type chosen yet, prompt onboarding
          if (!p?.filmmaker_type) {
            setShowOnboardingModal(true);
          }
        }
      } catch (err) {
        console.error('Failed to retrieve Supabase session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const authListener = (supabase.auth as any).onAuthStateChange(async (_event: string, newSession: Session | null) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        const p = await fetchProfile(newSession.user.id, newSession.user.email, newSession.user.user_metadata);
        setProfile(p);
        if (!p?.filmmaker_type) {
          setShowOnboardingModal(true);
        }
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      authListener?.data?.subscription?.unsubscribe?.();
    };
  }, [configured, fetchProfile]);

  const setDemoPersona = (role: FilmmakerType | null) => {
    setDemoPersonaState(role);
    if (typeof window !== 'undefined') {
      if (role) {
        localStorage.setItem(LOCAL_PERSONA_KEY, role);
      } else {
        localStorage.removeItem(LOCAL_PERSONA_KEY);
      }
    }
  };

  // Google OAuth
  const signInWithGoogle = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return { error: 'Supabase credentials are not yet configured in .env.' };
    }

    const redirectTo = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback` 
      : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) {
      return { error: error.message };
    }
    return {};
  };

  // Email & Password Sign In
  const signInWithEmail = async (email: string, pass: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return { error: 'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL to your .env file.' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      const p = await fetchProfile(data.user.id, data.user.email, data.user.user_metadata);
      setProfile(p);
      if (!p?.filmmaker_type) {
        setShowOnboardingModal(true);
      }
    }

    return {};
  };

  // Email & Password Sign Up with Persona
  const signUpWithEmail = async (email: string, pass: string, fullName: string, role?: FilmmakerType) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return { error: 'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL to your .env file.' };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: fullName,
          filmmaker_type: role || null
        }
      }
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      const p = await fetchProfile(data.user.id, data.user.email, { full_name: fullName, filmmaker_type: role });
      setProfile(p);
      if (!role && !p?.filmmaker_type) {
        setShowOnboardingModal(true);
      }
    }

    return {};
  };

  // Update Filmmaker Type Persona
  const updateFilmmakerType = async (type: FilmmakerType) => {
    // Also save in local state for immediate feedback
    setDemoPersona(type);

    if (!user) {
      return {};
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return {};
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ filmmaker_type: type, updated_at: new Date().toISOString() } as unknown as never)
        .eq('id', user.id);

      if (error) {
        return { error: error.message };
      }

      setProfile(prev => prev ? { ...prev, filmmaker_type: type } : null);
      return {};
    } catch (err) {
      console.error('Failed to update filmmaker type:', err);
      return { error: 'Failed to update filmmaker profile.' };
    }
  };

  // Sign Out
  const signOut = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isConfigured: configured,
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
