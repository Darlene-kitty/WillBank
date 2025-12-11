import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Type des microservices disponibles
 */
export type ServiceType = 'client' | 'account' | 'transaction' | 'notification' | 'dashboard';

/**
 * Service API générique pour les appels HTTP vers les microservices
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URLs des microservices
  private serviceUrls: Record<ServiceType, string> = {
    client: environment.clientServiceUrl,
    account: environment.accountServiceUrl,
    transaction: environment.transactionServiceUrl,
    notification: environment.notificationServiceUrl,
    dashboard: environment.dashboardServiceUrl,
  };

  // URL par défaut (client service)
  private defaultUrl = environment.clientServiceUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtient l'URL de base pour un service donné
   */
  private getBaseUrl(service?: ServiceType): string {
    return service ? this.serviceUrls[service] : this.defaultUrl;
  }

  /**
   * Requête GET
   */
  get<T>(endpoint: string, params?: any, service?: ServiceType): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get<T>(`${this.getBaseUrl(service)}${endpoint}`, { params: httpParams });
  }

  /**
   * Requête POST
   */
  post<T>(endpoint: string, data: any, service?: ServiceType): Observable<T> {
    return this.http.post<T>(`${this.getBaseUrl(service)}${endpoint}`, data);
  }

  /**
   * Requête PUT
   */
  put<T>(endpoint: string, data: any, service?: ServiceType): Observable<T> {
    return this.http.put<T>(`${this.getBaseUrl(service)}${endpoint}`, data);
  }

  /**
   * Requête DELETE
   */
  delete<T>(endpoint: string, service?: ServiceType): Observable<T> {
    return this.http.delete<T>(`${this.getBaseUrl(service)}${endpoint}`);
  }

  /**
   * Requête POST avec paramètres URL
   */
  postWithParams<T>(endpoint: string, params?: any, service?: ServiceType): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.post<T>(`${this.getBaseUrl(service)}${endpoint}`, null, { params: httpParams });
  }
}

