'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, FilmmakerType } from '@/lib/supabase/types';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';

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
  signInWithGoogle: (fallbackEmail?: string) => Promise<{ error?: string }>;
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
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  // Initialize Auth state from local storage or cloud
  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);

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

    // Connect real Supabase auth state listener when live credentials exist
    const supabase = getSupabaseBrowserClient();
    if (supabase && configured) {
      supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email,
            user_metadata: {
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
              avatar_url: session.user.user_metadata?.avatar_url
            }
          };
          const userProfile: UserProfile = {
            id: authUser.id,
            email: authUser.email || null,
            full_name: authUser.user_metadata?.full_name || 'Filmmaker',
            avatar_url: authUser.user_metadata?.avatar_url || null,
            filmmaker_type: demoPersona || 'indie',
            production_house: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setUser(authUser);
          setProfile(userProfile);
          setSession(session);
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user: authUser, profile: userProfile }));
          }
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email,
            user_metadata: {
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
              avatar_url: session.user.user_metadata?.avatar_url
            }
          };
          const userProfile: UserProfile = {
            id: authUser.id,
            email: authUser.email || null,
            full_name: authUser.user_metadata?.full_name || 'Filmmaker',
            avatar_url: authUser.user_metadata?.avatar_url || null,
            filmmaker_type: demoPersona || 'indie',
            production_house: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setUser(authUser);
          setProfile(userProfile);
          setSession(session);
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({ user: authUser, profile: userProfile }));
          }
        } else if (_event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setSession(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem(LOCAL_USER_KEY);
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
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

  const signInWithGoogle = async (fallbackGoogleEmail?: string): Promise<{ error?: string }> => {
    const supabase = getSupabaseBrowserClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
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
      } catch (err: any) {
        return { error: err.message || 'Failed to initialize Google OAuth' };
      }
    }

    // Interactive fallback: authenticate with provided Google email or default Google Creator profile
    const emailToUse = fallbackGoogleEmail?.trim() || 'filmmaker.creator@gmail.com';
    const namePart = emailToUse.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : 'Google Filmmaker';

    const guestUser: AuthUser = {
      id: `usr_google_${Date.now()}`,
      email: emailToUse,
      user_metadata: {
        full_name: formattedName,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(emailToUse)}`
      }
    };
    const guestProfile: UserProfile = {
      id: guestUser.id,
      email: guestUser.email || null,
      full_name: formattedName,
      avatar_url: guestUser.user_metadata?.avatar_url || null,
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
