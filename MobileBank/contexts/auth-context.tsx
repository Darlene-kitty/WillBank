import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, clientService, LoginResponse, ClientProfile } from '@/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  clientId: number | null;
  client: ClientProfile | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  cin: string;
  fcmToken?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clientId, setClientId] = useState<number | null>(null);
  const [client, setClient] = useState<ClientProfile | null>(null);

  // Vérifier l'authentification au démarrage
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
        
        if (id) {
          const profile = await clientService.getProfile(id);
          setClient(profile);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // En cas d'erreur, on déconnecte l'utilisateur
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await authService.login(email, password);
      setIsAuthenticated(true);
      setClientId(response.client.id);
      
      // Récupérer le profil complet
      const profile = await clientService.getProfile(response.client.id);
      setClient(profile);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setClientId(null);
      setClient(null);
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (!clientId) return;
    
    try {
      const profile = await clientService.getProfile(clientId);
      setClient(profile);
    } catch (error) {
      console.error('Refresh profile error:', error);
    }
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      
      // Store tokens and authentication info
      await AsyncStorage.setItem('accessToken', response.accessToken);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
      await AsyncStorage.setItem('clientId', response.client.id.toString());
      await AsyncStorage.setItem('client', JSON.stringify(response.client));
      
      // Update state
      setIsAuthenticated(true);
      setClientId(response.client.id);
      setClient(response.client);
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        clientId,
        client,
        login,
        logout,
        refreshProfile,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
