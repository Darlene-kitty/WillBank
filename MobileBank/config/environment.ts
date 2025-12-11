/**
 * Configuration des environnements pour WillBank Mobile
 * URLs directes vers les microservices (sans passer par la gateway)
 */

import { Platform } from 'react-native';

// Détection de l'environnement de développement
const isDev = __DEV__;

// Base URL pour Android emulator: 10.0.2.2 -> localhost de la machine hôte
// Pour iOS simulator: localhost fonctionne directement
// Pour Web: localhost fonctionne directement
// Pour device physique: utiliser l'IP de la machine (ex: 192.168.1.x)
const getDevHost = () => {
  if (Platform.OS === 'web') {
    return 'localhost';
  } else if (Platform.OS === 'android') {
    // IMPORTANT: Changez selon votre environnement
    // Pour émulateur Android: utilisez '10.0.2.2'
    // Pour appareil physique: utilisez votre IP locale (ex: '192.168.43.26')
    // Pour Expo Go sur appareil physique: utilisez votre IP locale
    const USE_PHYSICAL_DEVICE = false; // Changez à true si vous testez sur un appareil physique
    
    if (USE_PHYSICAL_DEVICE) {
      return '192.168.43.26'; // Votre IP locale (modifiez selon votre réseau)
    } else {
      return '10.0.2.2'; // Émulateur Android
    }
  } else {
    // iOS Simulator peut utiliser localhost directement
    return 'localhost';
  }
};

const DEV_HOST = getDevHost();

// Configuration des URLs des microservices
export const API_CONFIG = {
  // Client Service - Authentification et gestion des clients
  CLIENT_SERVICE: {
    BASE_URL: isDev ? `http://${DEV_HOST}:8081` : 'https://client-api.willbank.com',
    ENDPOINTS: {
      // Auth endpoints
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      REFRESH_TOKEN: '/api/auth/refresh',
      CHANGE_PASSWORD: '/api/auth/change-password',
      ME: '/api/auth/me',
      // Client endpoints
      CLIENTS: '/api/clients',
      CLIENT_BY_ID: (id: number) => `/api/clients/${id}`,
    },
  },

  // Account Service - Gestion des comptes bancaires
  ACCOUNT_SERVICE: {
    BASE_URL: isDev ? `http://${DEV_HOST}:8082` : 'https://account-api.willbank.com',
    ENDPOINTS: {
      ACCOUNTS: '/api/accounts',
      ACCOUNT_BY_ID: (id: number) => `/api/accounts/${id}`,
      ACCOUNT_BY_NUMBER: (number: string) => `/api/accounts/number/${number}`,
      ACCOUNTS_BY_CLIENT: (clientId: number) => `/api/accounts/client/${clientId}`,
      BALANCE: (id: number) => `/api/accounts/${id}/balance`,
      CREDIT: (id: number) => `/api/accounts/${id}/credit`,
      DEBIT: (id: number) => `/api/accounts/${id}/debit`,
    },
  },

  // Transaction Service - Gestion des transactions
  TRANSACTION_SERVICE: {
    BASE_URL: isDev ? `http://${DEV_HOST}:8083` : 'https://transaction-api.willbank.com',
    ENDPOINTS: {
      TRANSACTIONS: '/api/transactions',
      TRANSACTION_BY_ID: (id: number) => `/api/transactions/${id}`,
      TRANSACTION_BY_REF: (ref: string) => `/api/transactions/reference/${ref}`,
      TRANSACTIONS_BY_ACCOUNT: (accountId: number) => `/api/transactions/account/${accountId}`,
      TRANSACTIONS_BY_DATE_RANGE: (accountId: number) => `/api/transactions/account/${accountId}/range`,
    },
  },

  // Notification Service - Gestion des notifications
  NOTIFICATION_SERVICE: {
    BASE_URL: isDev ? `http://${DEV_HOST}:8084` : 'https://notification-api.willbank.com',
    ENDPOINTS: {
      NOTIFICATIONS: '/api/notifications',
      NOTIFICATIONS_BY_RECIPIENT: (recipient: string) => `/api/notifications/recipient/${recipient}`,
    },
  },

  // Dashboard Composite Service - Données agrégées
  DASHBOARD_SERVICE: {
    BASE_URL: isDev ? `http://${DEV_HOST}:8085` : 'https://dashboard-api.willbank.com',
    ENDPOINTS: {
      DASHBOARD: (clientId: number) => `/api/dashboard/${clientId}`,
      STATEMENT: (accountId: number) => `/api/statements/${accountId}`,
    },
  },
};

// Configuration globale
export const APP_CONFIG = {
  APP_NAME: 'WillBank',
  VERSION: '1.0.0',
  TIMEOUT: 15000, // 15 secondes
  RETRY_ATTEMPTS: 3,
  TOKEN_KEY: 'authToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  CLIENT_ID_KEY: 'clientId',
};

export default { API_CONFIG, APP_CONFIG };
