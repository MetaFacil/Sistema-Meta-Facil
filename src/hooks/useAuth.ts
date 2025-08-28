'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  plan: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
}

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(status === 'loading');
  }, [status]);

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao fazer login' 
      };
    }
  };

  const logout = async () => {
    try {
      await signOut({ callbackUrl: '/auth/signin' });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao fazer logout' 
      };
    }
  };

  const redirectToLogin = () => {
    router.push('/auth/signin');
  };

  const redirectToSignup = () => {
    router.push('/auth/signup');
  };

  const user: User | null = session?.user ? {
    id: session.user.id || '',
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: (session.user as any).role || 'USER',
    plan: (session.user as any).plan || 'FREE',
  } : null;

  return {
    user,
    session,
    loading,
    isAuthenticated: !!session,
    login,
    logout,
    redirectToLogin,
    redirectToSignup,
  };
}