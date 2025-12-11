import { useState, useEffect } from 'react';
import { authService, LoginResponse } from '@/services';

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  clientId: number | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  error: string | null;
}

/**
 * Hook personnalisé pour gérer l'authentification
 */
export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clientId, setClientId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const id = await authService.getClientId();
        setClientId(id);
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setError('Erreur de vérification de l\'authentification');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authService.login(email, password);
      setIsAuthenticated(true);
      setClientId(response.client.id);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur de connexion';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
      setIsAuthenticated(false);
      setClientId(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Erreur lors de la déconnexion');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    clientId,
    login,
    logout,
    error,
  };
};
