/**
 * Configuration des environnements pour WillBank Web - Production
 * URLs vers les services en production
 */
export const environment = {
  production: true,
  
  // URLs des microservices en production
  clientServiceUrl: 'https://client-api.willbank.com',
  accountServiceUrl: 'https://account-api.willbank.com',
  transactionServiceUrl: 'https://transaction-api.willbank.com',
  notificationServiceUrl: 'https://notification-api.willbank.com',
  dashboardServiceUrl: 'https://dashboard-api.willbank.com',
  
  // URL par défaut (pour rétrocompatibilité)
  apiUrl: 'https://client-api.willbank.com',
  
  // Configuration de l'application
  appName: 'WillBank',
  version: '1.0.0',
  
  // Configuration des tokens
  tokenKey: 'authToken',
  refreshTokenKey: 'refreshToken',
  clientIdKey: 'clientId',
  
  // Timeouts
  requestTimeout: 15000,
};
