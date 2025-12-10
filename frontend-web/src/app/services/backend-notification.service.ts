import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * Notification provenant du backend
 */
export interface BackendNotification {
  id: number;
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
  recipient: string;
  message: string;
  eventData?: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  createdAt: string;
  sentAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackendNotificationService {
  // Utilise le service dédié aux notifications (port 8084)
  private readonly ENDPOINT = `${environment.notificationServiceUrl}/api/notifications`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les notifications (admin)
   */
  getAllNotifications(): Observable<BackendNotification[]> {
    return this.http.get<BackendNotification[]>(this.ENDPOINT).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère les notifications d'un destinataire (email)
   */
  getNotificationsByRecipient(recipient: string): Observable<BackendNotification[]> {
    return this.http.get<BackendNotification[]>(`${this.ENDPOINT}/recipient/${recipient}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Compte les notifications non lues (dernières 24h)
   */
  getUnreadCount(recipient: string): Observable<number> {
    return this.getNotificationsByRecipient(recipient).pipe(
      map(notifications => {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        return notifications.filter(n => n.createdAt > oneDayAgo).length;
      }),
      catchError(() => {
        // En cas d'erreur, retourner 0
        return [0];
      })
    );
  }

  /**
   * Récupère les notifications récentes
   */
  getRecentNotifications(recipient: string, limit: number = 10): Observable<BackendNotification[]> {
    return this.getNotificationsByRecipient(recipient).pipe(
      map(notifications => 
        notifications
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit)
      ),
      catchError(this.handleError)
    );
  }

  /**
   * Gère les erreurs HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Erreur ${error.status}: ${error.statusText}`;
    }

    console.error('Backend notification service error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
