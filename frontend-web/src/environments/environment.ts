/**
 * Configuration des environnements pour WillBank Web
 * URLs directes vers les microservices (sans passer par la gateway)
 */
export const environment = {
  production: false,
  
  // URLs des microservices
  clientServiceUrl: 'http://localhost:8081',
  accountServiceUrl: 'http://localhost:8082',
  transactionServiceUrl: 'http://localhost:8083',
  notificationServiceUrl: 'http://localhost:8084',
  dashboardServiceUrl: 'http://localhost:8085',
  
  // URL par défaut (pour rétrocompatibilité)
  apiUrl: 'http://localhost:8081',
  
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
