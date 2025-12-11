/**
 * Configuration pour appareil physique
 * Copiez ce fichier vers environment.ts pour tester sur un appareil physique
 */

import { Platform } from 'react-native';

const isDev = __DEV__;

const getDevHost = () => {
  if (Platform.OS === 'web') {
    return 'localhost';
  } else {
    // IP réelle de votre machine pour appareil physique
    return '172.17.8.245';
  }
};

const DEV_HOST = getDevHost();

export const API_CONFIG = {
  CLIENT_SERVICE: {
    BASE_URL: isDev ? `http://${DEV_HOST}:8081` : 'https://client-api.willbank.com',
    ENDPOINTS: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      REFRESH_TOKEN: '/api/auth/refresh',
      CHANGE_PASSWORD: '/api/auth/change-password',
      ME: '/api/auth/me',
      CLIENTS: '/api/clients',
      CLIENT_BY_ID: (id: number) => `/api/clients/${id}`,
    },
  },

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

  NOTIFICATION_SERVICE: {
    BASE_URL: isDev ? `http://${DEV_HOST}:8084` : 'https://notification-api.willbank.com',
    ENDPOINTS: {
      NOTIFICATIONS: '/api/notifications',
      NOTIFICATIONS_BY_RECIPIENT: (recipient: string) => `/api/notifications/recipient/${recipient}`,
    },
  },

  DASHBOARD_SERVICE: {
    BASE_URL: isDev ? `http://${DEV_HOST}:8085` : 'https://dashboard-api.willbank.com',
    ENDPOINTS: {
      DASHBOARD: (clientId: number) => `/api/dashboard/${clientId}`,
      STATEMENT: (accountId: number) => `/api/statements/${accountId}`,
    },
  },
};

export const APP_CONFIG = {
  APP_NAME: 'WillBank',
  VERSION: '1.0.0',
  TIMEOUT: 15000,
  RETRY_ATTEMPTS: 3,
  TOKEN_KEY: 'authToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  CLIENT_ID_KEY: 'clientId',
};

export default { API_CONFIG, APP_CONFIG };