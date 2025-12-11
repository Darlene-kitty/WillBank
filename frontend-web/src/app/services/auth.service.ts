import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Client,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RefreshTokenRequest,
  ChangePasswordRequest
} from '../models/client.model';

// Re-export pour compatibilité
export type { Client as User, LoginRequest } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Utilise le client-service directement (port 8081) pour l'authentification
  private readonly AUTH_ENDPOINT = `${environment.clientServiceUrl}/api/auth`;
  private currentUserSubject = new BehaviorSubject<Client | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Restaure l'utilisateur depuis le localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  /**
   * Authentifie un utilisateur
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.AUTH_ENDPOINT}/login`, credentials).pipe(
      tap(response => this.saveAuthData(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Enregistre un nouveau client
   */
  register(data: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.AUTH_ENDPOINT}/register`, data).pipe(
      tap(response => this.saveAuthData(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Rafraîchit le token d'accès
   */
  refreshToken(refreshToken: string): Observable<LoginResponse> {
    const request: RefreshTokenRequest = { refreshToken };
    return this.http.post<LoginResponse>(`${this.AUTH_ENDPOINT}/refresh`, request).pipe(
      tap(response => this.saveAuthData(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Récupère le profil de l'utilisateur connecté
   */
  getCurrentUser(): Observable<Client> {
    return this.http.get<Client>(`${this.AUTH_ENDPOINT}/me`).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Change le mot de passe de l'utilisateur connecté
   */
  changePassword(request: ChangePasswordRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.AUTH_ENDPOINT}/change-password`, request).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Récupère l'utilisateur courant depuis le BehaviorSubject
   */
  getCurrentUserValue(): Client | null {
    return this.currentUserSubject.value;
  }

  /**
   * Récupère le token d'accès
   */
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Récupère le refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Sauvegarde les données d'authentification
   */
  private saveAuthData(response: LoginResponse): void {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('currentUser', JSON.stringify(response.client));
    this.currentUserSubject.next(response.client);
  }

  /**
   * Gère les erreurs HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = error.error?.message || `Erreur ${error.status}: ${error.statusText}`;
    }

    console.error('Auth error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
