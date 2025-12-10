import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration de base
const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:8081'  // Development (Android emulator) - utilisez localhost:8080 pour iOS
  : 'https://api.willbank.com'; // Production

// Création de l'instance Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur de requête - Ajoute le token JWT
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse - Gère le refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 et pas déjà tenté de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        
        if (refreshToken) {
          // Appel au endpoint de refresh
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken,
          });

          const { token: newToken } = response.data;

          // Sauvegarde du nouveau token
          await AsyncStorage.setItem('authToken', newToken);

          // Retry la requête originale avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si le refresh échoue, déconnexion
        await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'clientId']);
        // Redirection vers login (à gérer dans l'app)
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
