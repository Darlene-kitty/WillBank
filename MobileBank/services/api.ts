import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, APP_CONFIG } from '@/config/environment';

// Types
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Création d'une instance Axios pour chaque microservice
const createApiInstance = (baseURL: string): AxiosInstance => {
  console.log('Creating API instance with baseURL:', baseURL);
  
  const instance = axios.create({
    baseURL,
    timeout: APP_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Intercepteur de requête - Ajoute le token JWT
  instance.interceptors.request.use(
    async (config) => {
      try {
        const token = await AsyncStorage.getItem(APP_CONFIG.TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Intercepteur de réponse - Gère le refresh token
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      // Log détaillé pour le débogage
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      } else if (error.request) {
        // La requête a été faite mais aucune réponse reçue
        console.error('API Network Error - No Response:', {
          message: error.message,
          baseURL: instance.defaults.baseURL,
          url: error.config?.url,
          method: error.config?.method,
        });
      } else {
        // Erreur lors de la configuration de la requête
        console.error('API Request Setup Error:', error.message);
      }

      const originalRequest = error.config as RetryConfig;

      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = await AsyncStorage.getItem(APP_CONFIG.REFRESH_TOKEN_KEY);
          
          if (refreshToken) {
            const response = await axios.post(
              `${API_CONFIG.CLIENT_SERVICE.BASE_URL}${API_CONFIG.CLIENT_SERVICE.ENDPOINTS.REFRESH_TOKEN}`,
              { refreshToken }
            );

            const { accessToken } = response.data;
            await AsyncStorage.setItem(APP_CONFIG.TOKEN_KEY, accessToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return instance(originalRequest);
          }
        } catch (refreshError) {
          await AsyncStorage.multiRemove([
            APP_CONFIG.TOKEN_KEY,
            APP_CONFIG.REFRESH_TOKEN_KEY,
            APP_CONFIG.CLIENT_ID_KEY,
          ]);
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Instances pour chaque microservice
export const clientApi = createApiInstance(API_CONFIG.CLIENT_SERVICE.BASE_URL);
export const accountApi = createApiInstance(API_CONFIG.ACCOUNT_SERVICE.BASE_URL);
export const transactionApi = createApiInstance(API_CONFIG.TRANSACTION_SERVICE.BASE_URL);
export const notificationApi = createApiInstance(API_CONFIG.NOTIFICATION_SERVICE.BASE_URL);
export const dashboardApi = createApiInstance(API_CONFIG.DASHBOARD_SERVICE.BASE_URL);

// Export par défaut (clientApi pour la rétrocompatibilité)
export default clientApi;

