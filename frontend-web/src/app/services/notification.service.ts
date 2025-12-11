import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  private toastSubject = new BehaviorSubject<Notification | null>(null);
  public toast$ = this.toastSubject.asObservable();

  constructor() {
    // Charger les notifications depuis le localStorage au démarrage
    this.loadNotifications();
  }

  private loadNotifications(): void {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      try {
        const notifications = JSON.parse(stored);
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount();
      } catch (e) {
        // Erreur silencieuse
      }
    }
  }

  private saveNotifications(): void {
    const notifications = this.notificationsSubject.value;
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  private updateUnreadCount(): void {
    const unreadCount = this.notificationsSubject.value.filter(n => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }

  // Ajouter une notification
  add(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };

    const notifications = [newNotification, ...this.notificationsSubject.value];
    
    // Limiter à 50 notifications
    if (notifications.length > 50) {
      notifications.splice(50);
    }

    this.notificationsSubject.next(notifications);
    this.updateUnreadCount();
    this.saveNotifications();

    // Afficher le toast
    this.showToast(newNotification);
  }

  // Notifications rapides
  success(title: string, message: string, duration = 5000): void {
    this.add({ type: 'success', title, message, duration });
  }

  error(title: string, message: string, duration = 7000): void {
    this.add({ type: 'error', title, message, duration });
  }

  warning(title: string, message: string, duration = 6000): void {
    this.add({ type: 'warning', title, message, duration });
  }

  info(title: string, message: string, duration = 5000): void {
    this.add({ type: 'info', title, message, duration });
  }

  // Marquer comme lu
  markAsRead(id: string): void {
    const notifications = this.notificationsSubject.value.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(notifications);
    this.updateUnreadCount();
    this.saveNotifications();
  }

  // Marquer toutes comme lues
  markAllAsRead(): void {
    const notifications = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(notifications);
    this.updateUnreadCount();
    this.saveNotifications();
  }

  // Supprimer une notification
  remove(id: string): void {
    const notifications = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(notifications);
    this.updateUnreadCount();
    this.saveNotifications();
  }

  // Supprimer toutes les notifications
  clearAll(): void {
    this.notificationsSubject.next([]);
    this.updateUnreadCount();
    this.saveNotifications();
  }

  // Obtenir toutes les notifications
  getAll(): Notification[] {
    return this.notificationsSubject.value;
  }

  // Obtenir les notifications non lues
  getUnread(): Notification[] {
    return this.notificationsSubject.value.filter(n => !n.read);
  }

  // Afficher un toast
  private showToast(notification: Notification): void {
    this.toastSubject.next(notification);

    // Auto-masquer après la durée spécifiée
    if (notification.duration) {
      setTimeout(() => {
        if (this.toastSubject.value?.id === notification.id) {
          this.toastSubject.next(null);
        }
      }, notification.duration);
    }
  }

  // Masquer le toast actuel
  hideToast(): void {
    this.toastSubject.next(null);
  }

  private generateId(): string {
    return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
