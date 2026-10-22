import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string; role?: string }) => Promise<{ success: boolean; message: string; dashboardUrl?: string }>;
  loginWithGoogle: (data: { email: string; full_name?: string; role?: string }) => Promise<{ success: boolean; message: string; dashboardUrl?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('cendraloka_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('cendraloka_token');
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session from API or Supabase on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('cendraloka_token');
      const savedUserStr = localStorage.getItem('cendraloka_user');

      if (!storedToken && !savedUserStr) {
        setIsLoading(false);
        return;
      }

      try {
        // Try verifying with API
        const res = await fetch('/api/v1/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            if (data.success && data.user) {
              setUser(data.user);
              localStorage.setItem('cendraloka_user', JSON.stringify(data.user));
              setIsLoading(false);
              return;
            }
          }
        }

        // If API is unreachable or returned non-JSON, fallback to saved localStorage or Supabase
        if (savedUserStr) {
          try {
            const parsed = JSON.parse(savedUserStr);
            setUser(parsed);
          } catch (e) {
            // invalid json
          }
        }
      } catch (err) {
        console.warn('Session verification fallback to offline state:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: { email: string; password: string; role?: string }) => {
    try {
      // 1. First attempt login via API endpoint
      try {
        const res = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (res.ok && data.success) {
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('cendraloka_user', JSON.stringify(data.user));
            localStorage.setItem('cendraloka_token', data.token);
            return { success: true, message: data.message || 'Login berhasil.', dashboardUrl: data.dashboardUrl };
          } else if (res.status === 401 || res.status === 403) {
            // Definite auth rejection
            return { success: false, message: data.message || 'Email atau kata sandi tidak sesuai.' };
          }
        }
      } catch (apiErr) {
        console.warn('API login request error, trying Supabase direct check...', apiErr);
      }

      // 2. Direct Supabase Fallback Check
      const cleanEmail = credentials.email.trim().toLowerCase();
      const { data: supaUser, error } = await supabase
        .from('users')
        .select('*')
        .ilike('email', cleanEmail)
        .single();

      if (supaUser && !error) {
        if (credentials.role && credentials.role !== supaUser.role) {
          return {
            success: false,
            message: `Role yang dipilih tidak sesuai dengan hak akses akun Anda (${supaUser.role}). Silakan pilih role yang tepat.`,
          };
        }

        const fallbackToken = 'cendraloka_jwt_' + btoa(JSON.stringify({ id: supaUser.id, role: supaUser.role, time: Date.now() }));
        const profileObj: UserProfile = {
          id: supaUser.id,
          email: supaUser.email,
          full_name: supaUser.full_name,
          role: supaUser.role,
          institution: supaUser.institution || undefined,
          orcid: supaUser.orcid || undefined,
          phone: supaUser.phone || undefined,
          bio: supaUser.bio || undefined,
        };

        setUser(profileObj);
        setToken(fallbackToken);
        localStorage.setItem('cendraloka_user', JSON.stringify(profileObj));
        localStorage.setItem('cendraloka_token', fallbackToken);

        return {
          success: true,
          message: 'Login berhasil.',
          dashboardUrl: `/${supaUser.role}/dashboard`,
        };
      }

      return { success: false, message: 'Kombinasi email dan kata sandi tidak ditemukan di sistem.' };
    } catch (err: any) {
      console.error('Login error:', err);
      return { success: false, message: err?.message || 'Gagal terhubung ke server autentikasi.' };
    }
  };

  const loginWithGoogle = async (googleData: { email: string; full_name?: string; role?: string }) => {
    try {
      try {
        const res = await fetch('/api/v1/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(googleData),
        });

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (res.ok && data.success) {
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('cendraloka_user', JSON.stringify(data.user));
            localStorage.setItem('cendraloka_token', data.token);
            return { success: true, message: data.message || 'Login Google berhasil.', dashboardUrl: data.dashboardUrl };
          }
        }
      } catch (e) {
        console.warn('API Google login error, fallback to Supabase direct...', e);
      }

      // Direct Supabase Google SSO sync
      const targetRole = googleData.role || 'author';
      const cleanEmail = googleData.email.trim().toLowerCase();
      
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .ilike('email', cleanEmail)
        .single();

      let activeProfile: UserProfile;

      if (existingUser) {
        activeProfile = {
          id: existingUser.id,
          email: existingUser.email,
          full_name: existingUser.full_name,
          role: existingUser.role,
          institution: existingUser.institution || undefined,
          orcid: existingUser.orcid || undefined,
        };
      } else {
        const newId = 'usr-google-' + Date.now();
        const newUser = {
          id: newId,
          email: cleanEmail,
          password_hash: 'GOOGLE_SSO',
          full_name: googleData.full_name || cleanEmail.split('@')[0],
          role: targetRole,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        await supabase.from('users').insert(newUser);
        activeProfile = {
          id: newId,
          email: cleanEmail,
          full_name: newUser.full_name,
          role: targetRole,
        };
      }

      const googleToken = 'cendraloka_gtoken_' + btoa(JSON.stringify({ id: activeProfile.id, email: activeProfile.email }));
      setUser(activeProfile);
      setToken(googleToken);
      localStorage.setItem('cendraloka_user', JSON.stringify(activeProfile));
      localStorage.setItem('cendraloka_token', googleToken);

      return {
        success: true,
        message: 'Login Google berhasil.',
        dashboardUrl: `/${activeProfile.role}/dashboard`,
      };
    } catch (err) {
      console.error('Google login error:', err);
      return { success: false, message: 'Gagal menghubungkan otentikasi Google.' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => {});
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('cendraloka_user');
      localStorage.removeItem('cendraloka_token');
    }
  };

  const refreshUser = async () => {
    if (!token && !user) return;
    try {
      if (token) {
        const res = await fetch('/api/v1/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            if (data.success && data.user) {
              setUser(data.user);
              localStorage.setItem('cendraloka_user', JSON.stringify(data.user));
              return;
            }
          }
        }
      }

      if (user?.email) {
        const { data: supaUser } = await supabase
          .from('users')
          .select('*')
          .ilike('email', user.email)
          .single();

        if (supaUser) {
          const updated: UserProfile = {
            id: supaUser.id,
            email: supaUser.email,
            full_name: supaUser.full_name,
            role: supaUser.role,
            institution: supaUser.institution || undefined,
            orcid: supaUser.orcid || undefined,
            phone: supaUser.phone || undefined,
            bio: supaUser.bio || undefined,
          };
          setUser(updated);
          localStorage.setItem('cendraloka_user', JSON.stringify(updated));
        }
      }
    } catch (err) {
      console.error('Refresh user error:', err);
    }
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const allowed = Array.isArray(roles) ? roles : [roles];
    return allowed.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        loginWithGoogle,
        logout,
        refreshUser,
        hasRole,
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
