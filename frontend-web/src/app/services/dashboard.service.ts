import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, delay, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Dashboard, Statement } from '../models/dashboard.model';
import { environment } from '../../environments/environment';

/**
 * Interface pour le dashboard enrichi avec plus de détails
 */
export interface EnrichedDashboard extends Dashboard {
  lastLoginAt?: string;
  pendingTransactionsCount?: number;
  monthlySpending?: number;
  monthlyIncome?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // Utilise le service dashboard-composite (port 8085)
  private readonly ENDPOINT = `${environment.dashboardServiceUrl}/api/dashboard`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère le dashboard complet d'un client
   */
  getClientDashboard(clientId: number): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.ENDPOINT}/${clientId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère le dashboard enrichi avec plus de détails
   */
  getEnrichedDashboard(clientId: number): Observable<EnrichedDashboard> {
    return this.http.get<EnrichedDashboard>(`${this.ENDPOINT}/${clientId}/enriched`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère le relevé de compte
   */
  getAccountStatement(accountId: number, from: string, to: string): Observable<Statement> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);

    return this.http.get<Statement>(`${this.ENDPOINT}/statements/${accountId}`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère les statistiques mensuelles
   */
  getMonthlyStats(clientId: number, year: number, month: number): Observable<{
    income: number;
    expenses: number;
    savings: number;
    transactionCount: number;
  }> {
    return this.http.get<{
      income: number;
      expenses: number;
      savings: number;
      transactionCount: number;
    }>(`${this.ENDPOINT}/${clientId}/stats/${year}/${month}`).pipe(
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

    console.error('Dashboard service error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
