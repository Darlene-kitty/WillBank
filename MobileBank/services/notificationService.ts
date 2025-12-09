import api from './api';

export interface Notification {
  id: number;
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
  recipient: string;
  message: string;
  eventData?: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  createdAt: string;
  sentAt?: string;
}

export interface NotificationPreferences {
  // Types de notifications
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  
  // Catégories
  transactions: boolean;
  security: boolean;
  marketing: boolean;
  updates: boolean;
  
  // Paramètres avancés
  transactionThreshold: number;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export const notificationService = {
  /**
   * Récupération des notifications d'un utilisateur
   */
  getNotificationsByRecipient: async (recipient: string): Promise<Notification[]> => {
    const response = await api.get(`/api/notifications/recipient/${recipient}`);
    return response.data;
  },

  /**
   * Récupération de toutes les notifications (admin only)
   */
  getAllNotifications: async (): Promise<Notification[]> => {
    const response = await api.get('/api/notifications');
    return response.data;
  },

  /**
   * Récupération des préférences de notifications
   */
  getPreferences: async (clientId: number): Promise<NotificationPreferences> => {
    const response = await api.get(`/api/notifications/preferences/${clientId}`);
    return response.data;
  },

  /**
   * Mise à jour des préférences de notifications
   */
  updatePreferences: async (
    clientId: number,
    preferences: NotificationPreferences
  ): Promise<NotificationPreferences> => {
    const response = await api.put(
      `/api/notifications/preferences/${clientId}`,
      preferences
    );
    return response.data;
  },

  /**
   * Envoi d'une notification de test
   */
  sendTestNotification: async (clientId: number): Promise<{ message: string }> => {
    const response = await api.post('/api/notifications/test', { clientId });
    return response.data;
  },
};
