import { useState, useEffect, useCallback } from 'react';
import { notificationService, Notification } from '@/services';

interface UseNotificationsReturn {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  refreshNotifications: () => Promise<void>;
  unreadCount: number;
}

/**
 * Hook personnalisé pour gérer les notifications
 */
export const useNotifications = (recipient: string | null): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!recipient) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await notificationService.getNotificationsByRecipient(recipient);
      // Trier par date décroissante
      const sorted = data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sorted);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la récupération des notifications';
      setError(errorMessage);
      console.error('Fetch notifications error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [recipient]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  const unreadCount = notifications.filter(n => n.status === 'PENDING').length;

  return {
    notifications,
    isLoading,
    error,
    refreshNotifications,
    unreadCount,
  };
};
