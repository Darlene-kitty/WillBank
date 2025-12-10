import { notificationApi } from './api';
import { API_CONFIG } from '@/config/environment';

// Types
export interface NotificationDTO {
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

// Alias pour rétrocompatibilité
export type Notification = NotificationDTO;

const ENDPOINTS = API_CONFIG.NOTIFICATION_SERVICE.ENDPOINTS;

export const notificationService = {
  /**
   * Récupération des notifications d'un utilisateur par email/recipient
   */
  getNotificationsByRecipient: async (recipient: string): Promise<NotificationDTO[]> => {
    const response = await notificationApi.get<NotificationDTO[]>(
      ENDPOINTS.NOTIFICATIONS_BY_RECIPIENT(recipient)
    );
    return response.data;
  },

  /**
   * Récupération de toutes les notifications (admin)
   */
  getAllNotifications: async (): Promise<NotificationDTO[]> => {
    const response = await notificationApi.get<NotificationDTO[]>(ENDPOINTS.NOTIFICATIONS);
    return response.data;
  },

  /**
   * Compte le nombre de notifications non lues
   * Note: Cette logique est côté client car l'API ne gère pas encore le statut lu/non lu
   */
  getUnreadCount: async (recipient: string): Promise<number> => {
    try {
      const notifications = await notificationService.getNotificationsByRecipient(recipient);
      // Pour l'instant, considérer les notifications des dernières 24h comme "non lues"
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      return notifications.filter(n => n.createdAt > oneDayAgo).length;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  },

  /**
   * Récupération des notifications récentes
   */
  getRecentNotifications: async (recipient: string, limit: number = 10): Promise<NotificationDTO[]> => {
    const notifications = await notificationService.getNotificationsByRecipient(recipient);
    return notifications
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },
};

export default notificationService;
