import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Account, CreateAccountRequest } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  // Utilise le service dédié aux comptes (port 8082)
  private readonly ENDPOINT = `${environment.accountServiceUrl}/api/accounts`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les comptes
   */
  getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.ENDPOINT).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère un compte par son ID
   */
  getAccountById(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.ENDPOINT}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère un compte par son numéro
   */
  getAccountByNumber(accountNumber: string): Observable<Account> {
    return this.http.get<Account>(`${this.ENDPOINT}/number/${accountNumber}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère tous les comptes d'un client
   */
  getAccountsByClientId(clientId: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.ENDPOINT}/client/${clientId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère le solde d'un compte
   */
  getAccountBalance(id: number): Observable<number> {
    return this.http.get<number>(`${this.ENDPOINT}/${id}/balance`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crée un nouveau compte
   */
  createAccount(account: Account): Observable<Account> {
    const request = {
      clientId: account.clientId,
      accountType: account.accountType,
      balance: account.balance || 0,
      status: account.status || 'ACTIVE'
    };
    return this.http.post<Account>(this.ENDPOINT, request).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Met à jour un compte
   */
  updateAccount(id: number, account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.ENDPOINT}/${id}`, account).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crédite un compte
   */
  creditAccount(id: number, amount: number): Observable<void> {
    const params = new HttpParams().set('amount', amount.toString());
    return this.http.post<void>(`${this.ENDPOINT}/${id}/credit`, null, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Débite un compte
   */
  debitAccount(id: number, amount: number): Observable<void> {
    const params = new HttpParams().set('amount', amount.toString());
    return this.http.post<void>(`${this.ENDPOINT}/${id}/debit`, null, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Supprime un compte
   */
  deleteAccount(id: number): Observable<void> {
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

    console.error('Account service error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
