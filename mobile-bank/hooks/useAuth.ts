import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services';
import { Client, LoginRequest, RegisterRequest } from '../types';

/**
 * Hook personnalisé pour gérer l'authentification
 * Facilite l'utilisation du service d'authentification dans les composants
 */
export const useAuth = () => {
  const [user, setUser] = useState<Client | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifie l'authentification au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const isAuth = await authService.isAuthenticated();
      setIsAuthenticated(isAuth);

      if (isAuth) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (err: any) {
      console.error('Check auth error:', err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Connexion
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      setUser(response.client);
      setIsAuthenticated(true);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur de connexion';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Inscription
   */
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.register(data);
      setUser(response.client);
      setIsAuthenticated(true);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Déconnexion
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err: any) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Rafraîchir les informations de l'utilisateur
   */
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err: any) {
      console.error('Refresh user error:', err);
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
    checkAuth,
  };
};
