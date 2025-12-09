import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  cin: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  client: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export const authService = {
  /**
   * Connexion utilisateur
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/api/auth/login', { email, password });
    const { token, refreshToken, client } = response.data;
    
    // Sauvegarde des tokens et clientId
    await AsyncStorage.multiSet([
      ['authToken', token],
      ['refreshToken', refreshToken],
      ['clientId', client.id.toString()],
    ]);
    
    return response.data;
  },

  /**
   * Inscription utilisateur
   */
  register: async (data: RegisterRequest) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  /**
   * Déconnexion utilisateur
   */
  logout: async () => {
    try {
      // Appel au backend pour invalider le token (optionnel)
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Suppression des données locales
      await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'clientId']);
    }
  },

  /**
   * Refresh du token JWT
   */
  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/api/auth/refresh', { refreshToken });
    const { token: newToken } = response.data;
    
    await AsyncStorage.setItem('authToken', newToken);
    
    return response.data;
  },

  /**
   * Changement de mot de passe
   */
  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await api.post('/api/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Vérification si l'utilisateur est connecté
   */
  isAuthenticated: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  },

  /**
   * Récupération du clientId
   */
  getClientId: async (): Promise<number | null> => {
    const clientId = await AsyncStorage.getItem('clientId');
    return clientId ? parseInt(clientId) : null;
  },
};
