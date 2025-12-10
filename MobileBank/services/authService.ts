import { clientApi } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, APP_CONFIG } from '@/config/environment';
import { firebaseService } from './firebaseService';

// Types
export interface LoginRequest {
  email: string;
  password: string;
  fcmToken?: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  cin: string;
  fcmToken?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ClientDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  cin: string;
  role: 'CLIENT' | 'ADMIN';
  status?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  client: ClientDTO;
}

const ENDPOINTS = API_CONFIG.CLIENT_SERVICE.ENDPOINTS;

export const authService = {
  /**
   * Connexion utilisateur
   */
  login: async (email: string, password: string, fcmToken?: string): Promise<LoginResponse> => {
    // Si pas de token fourni, essayer de le récupérer
    if (!fcmToken) {
      try {
        fcmToken = await firebaseService.getFCMToken();
      } catch (error) {
        console.warn('Could not get FCM token for login:', error);
      }
    }
    
    const response = await clientApi.post<LoginResponse>(ENDPOINTS.LOGIN, { 
      email, 
      password,
      fcmToken 
    });
    
    const { accessToken, refreshToken, client } = response.data;
    
    // Sauvegarde des tokens et clientId
    await AsyncStorage.multiSet([
      [APP_CONFIG.TOKEN_KEY, accessToken],
      [APP_CONFIG.REFRESH_TOKEN_KEY, refreshToken],
      [APP_CONFIG.CLIENT_ID_KEY, client.id.toString()],
    ]);
    
    return response.data;
  },

  /**
   * Inscription utilisateur
   */
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    // Si pas de token fourni, essayer de le récupérer ou utiliser le token par défaut
    if (!data.fcmToken) {
      try {
        data.fcmToken = await firebaseService.getFCMToken();
      } catch (error) {
        console.warn('Could not get FCM token for registration:', error);
        // Utiliser le token par défaut
        data.fcmToken = '6w088Q-tg6lOvFDlIM81GxI7oFXGZvczzNs2O8aHYA8';
      }
    }
    
    const response = await clientApi.post<LoginResponse>(ENDPOINTS.REGISTER, data);
    
    const { accessToken, refreshToken, client } = response.data;
    
    // Sauvegarde automatique après inscription
    await AsyncStorage.multiSet([
      [APP_CONFIG.TOKEN_KEY, accessToken],
      [APP_CONFIG.REFRESH_TOKEN_KEY, refreshToken],
      [APP_CONFIG.CLIENT_ID_KEY, client.id.toString()],
    ]);
    
    return response.data;
  },

  /**
   * Déconnexion utilisateur
   */
  logout: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        APP_CONFIG.TOKEN_KEY,
        APP_CONFIG.REFRESH_TOKEN_KEY,
        APP_CONFIG.CLIENT_ID_KEY,
      ]);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  /**
   * Refresh du token JWT
   */
  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await clientApi.post<LoginResponse>(ENDPOINTS.REFRESH_TOKEN, { 
      refreshToken 
    });
    
    const { accessToken } = response.data;
    await AsyncStorage.setItem(APP_CONFIG.TOKEN_KEY, accessToken);
    
    return response.data;
  },

  /**
   * Changement de mot de passe
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await clientApi.put<{ message: string }>(ENDPOINTS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Récupération de l'utilisateur courant
   */
  getCurrentUser: async (): Promise<string> => {
    const response = await clientApi.get<string>(ENDPOINTS.ME);
    return response.data;
  },

  /**
   * Vérification si l'utilisateur est connecté
   */
  isAuthenticated: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem(APP_CONFIG.TOKEN_KEY);
    return !!token;
  },

  /**
   * Récupération du clientId stocké
   */
  getClientId: async (): Promise<number | null> => {
    const clientId = await AsyncStorage.getItem(APP_CONFIG.CLIENT_ID_KEY);
    return clientId ? parseInt(clientId, 10) : null;
  },

  /**
   * Récupération du token d'accès
   */
  getAccessToken: async (): Promise<string | null> => {
    return AsyncStorage.getItem(APP_CONFIG.TOKEN_KEY);
  },

  /**
   * Récupération du refresh token
   */
  getRefreshToken: async (): Promise<string | null> => {
    return AsyncStorage.getItem(APP_CONFIG.REFRESH_TOKEN_KEY);
  },
};

export default authService;
