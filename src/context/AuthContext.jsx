import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tokenStorage } from '../utils/tokenStorage';
import { setUnauthorizedHandler } from '../api/client';
import { getUser } from '../api/user';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() => tokenStorage.get());
  const userQuery = useQuery({ queryKey: ['user'], queryFn: getUser, enabled: Boolean(token), retry: false, staleTime: 60000 });
  const clearSession = () => {
    tokenStorage.set(null);
    setToken(null);
    queryClient.removeQueries({ queryKey: ['user'] });
  };
  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    return () => setUnauthorizedHandler(() => {});
  }, [queryClient]);
  const authenticate = async (mode, values) => {
    const response = await authApi[mode](values);
    if (!response?.token || typeof response.token !== 'string') throw new Error('Сервер не вернул токен авторизации.');
    tokenStorage.set(response.token);
    queryClient.removeQueries({ queryKey: ['user'] });
    setToken(response.token);
  };
  const logout = async () => {
    try { await authApi.logout(); } finally { clearSession(); }
  };
  return <AuthContext.Provider value={{ user: token ? userQuery.data : null, isAuthenticated: Boolean(token), isChecking: Boolean(token) && userQuery.isPending, userError: userQuery.error, refreshUser: userQuery.refetch, authenticate, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
