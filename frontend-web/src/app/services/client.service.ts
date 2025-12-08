import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly ENDPOINT = `${environment.apiUrl}/api/clients`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les clients
   */
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.ENDPOINT).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère un client par son ID
   */
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.ENDPOINT}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crée un nouveau client
   */
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.ENDPOINT, client).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Met à jour un client
   */
  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.ENDPOINT}/${id}`, client).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Supprime un client
   */
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.ENDPOINT}/${id}`).pipe(
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

    console.error('Client service error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
