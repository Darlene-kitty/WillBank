import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface WebSocketNotification {
  id?: number;
  type: 'TRANSACTION' | 'ACCOUNT' | 'SECURITY' | 'INFO';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket?: WebSocket;
  private notificationSubject = new Subject<WebSocketNotification>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;

  connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.socket = new WebSocket('ws://localhost:8080/ws/notifications');

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        try {
          const notification: WebSocketNotification = JSON.parse(event.data);
          notification.timestamp = new Date();
          notification.read = false;
          this.notificationSubject.next(notification);
          this.showToast(notification);
        } catch (error) {
          // Erreur silencieuse
        }
      };

      this.socket.onerror = () => {
        // Erreur silencieuse
      };

      this.socket.onclose = () => {
        this.attemptReconnect();
      };
    } catch (error) {
      this.attemptReconnect();
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = undefined;
    }
  }

  getNotifications(): Observable<WebSocketNotification> {
    return this.notificationSubject.asObservable();
  }

  private showToast(notification: WebSocketNotification): void {
    // Ne rien faire ici - les notifications sont gérées par le NotificationService
    // Cette méthode peut être supprimée ou laissée vide pour compatibilité
  }
}
