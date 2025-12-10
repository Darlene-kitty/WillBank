// Export des instances API
export { 
  clientApi, 
  accountApi, 
  transactionApi, 
  notificationApi, 
  dashboardApi 
} from './api';

// Export par défaut (clientApi pour rétrocompatibilité)
export { default as api } from './api';

// Export des services
export * from './authService';
export * from './clientService';
export * from './accountService';
export * from './transactionService';
export * from './notificationService';
export * from './dashboardService';

// Export des services par défaut
export { default as authService } from './authService';
export { default as clientService } from './clientService';
export { default as accountService } from './accountService';
export { default as transactionService } from './transactionService';
export { default as notificationService } from './notificationService';
export { default as dashboardService } from './dashboardService';
