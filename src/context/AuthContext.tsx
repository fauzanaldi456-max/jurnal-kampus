import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

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

  // Restore session from API on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('cendraloka_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/v1/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('cendraloka_user', JSON.stringify(data.user));
          } else {
            // Invalid session
            setUser(null);
            setToken(null);
            localStorage.removeItem('cendraloka_user');
            localStorage.removeItem('cendraloka_token');
          }
        } else {
          // Token expired or invalid
          setUser(null);
          setToken(null);
          localStorage.removeItem('cendraloka_user');
          localStorage.removeItem('cendraloka_token');
        }
      } catch (err) {
        console.error('Failed to verify session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: { email: string; password: string; role?: string }) => {
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('cendraloka_user', JSON.stringify(data.user));
        localStorage.setItem('cendraloka_token', data.token);
        return { success: true, message: data.message || 'Login berhasil.', dashboardUrl: data.dashboardUrl };
      } else {
        return { success: false, message: data.message || 'Login gagal.' };
      }
    } catch (err) {
      console.error('Login network error:', err);
      return { success: false, message: 'Gagal terhubung ke server backend.' };
    }
  };

  const loginWithGoogle = async (googleData: { email: string; full_name?: string; role?: string }) => {
    try {
      const res = await fetch('/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('cendraloka_user', JSON.stringify(data.user));
        localStorage.setItem('cendraloka_token', data.token);
        return { success: true, message: data.message || 'Login Google berhasil.', dashboardUrl: data.dashboardUrl };
      } else {
        return { success: false, message: data.message || 'Login Google gagal.' };
      }
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
        });
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
    if (!token) return;
    try {
      const res = await fetch('/api/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('cendraloka_user', JSON.stringify(data.user));
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
