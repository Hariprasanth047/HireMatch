import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { readStorage, writeStorage } from '../utils/storage';

const AuthContext = createContext(null);

export const roles = {
  seeker: 'JOB_SEEKER',
  recruiter: 'RECRUITER',
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => readStorage('hirematch_user', null));
  const [token, setToken] = useState(() => localStorage.getItem('hirematch_token') || null);
  const [loading, setLoading] = useState(true);

  // Verify and sync active user from backend on mount
  useEffect(() => {
    const syncUser = async () => {
      const storedToken = localStorage.getItem('hirematch_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            const userWithId = { ...res.user, id: res.user._id || res.user.id };
            setCurrentUser(userWithId);
            writeStorage('hirematch_user', userWithId);
          }
        } catch (err) {
          console.warn('[AuthContext] Session expired or invalid token:', err.message);
          localStorage.removeItem('hirematch_token');
          localStorage.removeItem('hirematch_user');
          setCurrentUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    syncUser();
  }, []);

  const login = async ({ email, password }) => {
    const data = await authService.login({ email, password });
    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }

    const userWithId = { ...data.user, id: data.user._id || data.user.id };
    setToken(data.token);
    setCurrentUser(userWithId);

    localStorage.setItem('hirematch_token', data.token);
    writeStorage('hirematch_user', userWithId);

    return userWithId;
  };

  const register = async ({ name, email, password, role, company, location, phone }) => {
    const data = await authService.register({ name, email, password, role, company, location, phone });
    if (!data.success) {
      throw new Error(data.message || 'Registration failed');
    }

    const userWithId = { ...data.user, id: data.user._id || data.user.id };
    setToken(data.token);
    setCurrentUser(userWithId);

    localStorage.setItem('hirematch_token', data.token);
    writeStorage('hirematch_user', userWithId);

    return userWithId;
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('hirematch_token');
    localStorage.removeItem('hirematch_user');
  };

  const refreshUser = (updatedUser) => {
    if (updatedUser) {
      const userWithId = { ...updatedUser, id: updatedUser._id || updatedUser.id };
      setCurrentUser(userWithId);
      writeStorage('hirematch_user', userWithId);
    }
  };

  const value = useMemo(() => ({
    currentUser,
    token,
    loading,
    isAuthenticated: Boolean(currentUser && token),
    userRole: currentUser?.role,
    roles,
    login,
    register,
    logout,
    refreshUser,
  }), [currentUser, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
