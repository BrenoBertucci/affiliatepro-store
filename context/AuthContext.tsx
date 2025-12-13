import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  role?: 'admin' | 'user';
}

interface AuthContextType {
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Convert Supabase user to our AuthUser format
  const formatUser = (supabaseUser: SupabaseUser | null): AuthUser | null => {
    if (!supabaseUser) return null;
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      role: 'admin',
    };
  };

  useEffect(() => {
    if (!supabase) {
      console.error('Supabase não está configurado');
      setLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(formatUser(session?.user ?? null));
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(formatUser(session?.user ?? null));
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase não está configurado');
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      setUser(formatUser(data.user));
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Falha ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!supabase) {
      setUser(null);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};