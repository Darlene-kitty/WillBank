/**
 * Configuration de l'API pour l'application mobile WillBank
 * 
 * Modifiez API_BASE_URL selon votre environnement :
 * - Développement local avec émulateur Android : http://10.0.2.2:8080
 * - Développement local avec iOS Simulator : http://localhost:8080
 * - Appareil physique : http://[VOTRE_IP_LOCALE]:8080
 * - Production : https://api.willbank.ma
 */

export const API_CONFIG = {
  // URL de base de l'API Gateway
  BASE_URL: 'http://10.0.2.2:8080', // Changez selon votre environnement
  
  // Timeout des requêtes (en millisecondes)
  TIMEOUT: 15000,
  
  // Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      REFRESH: '/api/auth/refresh',
      ME: '/api/auth/me',
      CHANGE_PASSWORD: '/api/auth/change-password',
    },
    CLIENTS: {
      BASE: '/api/clients',
      BY_ID: (id: number) => `/api/clients/${id}`,
    },
    ACCOUNTS: {
      BASE: '/api/accounts',
      BY_ID: (id: number) => `/api/accounts/${id}`,
      BY_NUMBER: (number: string) => `/api/accounts/number/${number}`,
      BY_CLIENT: (clientId: number) => `/api/accounts/client/${clientId}`,
      BALANCE: (id: number) => `/api/accounts/${id}/balance`,
      CREDIT: (id: number) => `/api/accounts/${id}/credit`,
      DEBIT: (id: number) => `/api/accounts/${id}/debit`,
    },
  },
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

/**
 * Configurations prédéfinies pour différents environnements
 */
export const ENVIRONMENT_CONFIGS = {
  // Émulateur Android
  ANDROID_EMULATOR: {
    ...API_CONFIG,
    BASE_URL: 'http://10.0.2.2:8080',
  },
  
  // iOS Simulator
  IOS_SIMULATOR: {
    ...API_CONFIG,
    BASE_URL: 'http://localhost:8080',
  },
  
  // Appareil physique (à adapter avec votre IP locale)
  PHYSICAL_DEVICE: {
    ...API_CONFIG,
    BASE_URL: 'http://192.168.1.100:8080', // Remplacez par votre IP
  },
  
  // Production
  PRODUCTION: {
    ...API_CONFIG,
    BASE_URL: 'https://api.willbank.ma',
    TIMEOUT: 30000,
  },
};

/**
 * Obtient la configuration selon l'environnement
 */
export const getApiConfig = () => {
  // Vous pouvez détecter automatiquement l'environnement ici
  // ou utiliser une variable d'environnement
  return API_CONFIG;
};
