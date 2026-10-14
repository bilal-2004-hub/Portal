import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getMe } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('studentPortalToken') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getMe();
        setUser(response.data.data);
      } catch (error) {
        localStorage.removeItem('studentPortalToken');
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (credentials) => {
    const response = await import('../api/api').then((mod) => mod.login(credentials));
    const { token: newToken, user: newUser } = response.data.data;
    localStorage.setItem('studentPortalToken', newToken);
    setToken(newToken);
    setUser(newUser);
    return response;
  };

  const signup = async (payload) => {
    const response = await import('../api/api').then((mod) => mod.signup(payload));
    const { token: newToken, user: newUser } = response.data.data;
    localStorage.setItem('studentPortalToken', newToken);
    setToken(newToken);
    setUser(newUser);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('studentPortalToken');
    setToken('');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      loading,
      login,
      signup,
      logout,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
