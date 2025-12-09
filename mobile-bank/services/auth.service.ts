import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './api.service';
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RefreshTokenRequest,
  ChangePasswordRequest,
  Client,
} from '../types/client.types';

class AuthService {
  private readonly AUTH_ENDPOINT = '/api/auth';
  private readonly CLIENTS_ENDPOINT = '/api/clients';

  /**
   * Authentifie un utilisateur
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        `${this.AUTH_ENDPOINT}/login`,
        credentials
      );

      // Sauvegarde les tokens et les infos utilisateur
      await this.saveAuthData(response);

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Enregistre un nouveau client
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        `${this.AUTH_ENDPOINT}/register`,
        data
      );

      // Sauvegarde les tokens et les infos utilisateur
      await this.saveAuthData(response);

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Rafraîchit le token d'accès
   */
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        `${this.AUTH_ENDPOINT}/refresh`,
        { refreshToken } as RefreshTokenRequest
      );

      await this.saveAuthData(response);

      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupère le profil de l'utilisateur connecté
   */
  async getCurrentUser(): Promise<Client> {
    try {
      // D'abord, essaie de récupérer depuis le cache
      const cachedUser = await AsyncStorage.getItem('currentUser');
      if (cachedUser) {
        return JSON.parse(cachedUser);
      }

      // Sinon, récupère depuis l'API
      const user = await apiClient.get<Client>(`${this.AUTH_ENDPOINT}/me`);
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Change le mot de passe de l'utilisateur connecté
   */
  async changePassword(request: ChangePasswordRequest): Promise<void> {
    try {
      await apiClient.put(`${this.AUTH_ENDPOINT}/change-password`, request);
    } catch (error) {
      console.error('Change password error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Déconnecte l'utilisateur
   */
  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'currentUser']);
    } catch (error) {
      console.error('Logout error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  /**
   * Récupère le token d'accès
   */
  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('accessToken');
    } catch (error) {
      return null;
    }
  }

  /**
   * Récupère le refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('refreshToken');
    } catch (error) {
      return null;
    }
  }

  /**
   * Sauvegarde les données d'authentification
   */
  private async saveAuthData(response: LoginResponse): Promise<void> {
    await AsyncStorage.multiSet([
      ['accessToken', response.accessToken],
      ['refreshToken', response.refreshToken],
      ['currentUser', JSON.stringify(response.client)],
    ]);
  }

  /**
   * Gère les erreurs API
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Erreur avec réponse du serveur
      const message = error.response.data?.message || 'Une erreur est survenue';
      return new Error(message);
    } else if (error.request) {
      // Erreur réseau
      return new Error('Impossible de contacter le serveur. Vérifiez votre connexion.');
    } else {
      // Autre erreur
      return new Error(error.message || 'Une erreur inattendue est survenue');
    }
  }
}

export default new AuthService();
