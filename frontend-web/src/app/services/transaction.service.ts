import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Transaction, TransactionRequest } from '../models/transaction.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  // Utilise le service dédié aux transactions (port 8083)
  private readonly ENDPOINT = `${environment.transactionServiceUrl}/api/transactions`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les transactions (admin)
   */
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.ENDPOINT).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère une transaction par son ID
   */
  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.ENDPOINT}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère une transaction par sa référence
   */
  getTransactionByReference(reference: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.ENDPOINT}/reference/${reference}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère toutes les transactions d'un compte
   */
  getTransactionsByAccountId(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.ENDPOINT}/account/${accountId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère les transactions d'un compte par plage de dates
   */
  getTransactionsByDateRange(accountId: number, startDate: string, endDate: string): Observable<Transaction[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<Transaction[]>(`${this.ENDPOINT}/account/${accountId}/range`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crée une nouvelle transaction
   */
  createTransaction(transaction: TransactionRequest): Observable<Transaction> {
    return this.http.post<Transaction>(this.ENDPOINT, transaction).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crée un virement
   */
  createTransfer(
    sourceAccountId: number,
    destinationAccountId: number | undefined,
    amount: number,
    description: string,
    destinationIban?: string
  ): Observable<Transaction> {
    return this.createTransaction({
      type: 'TRANSFER',
      sourceAccountId,
      destinationAccountId,
      destinationIban,
      amount,
      description
    });
  }

  /**
   * Crée un dépôt
   */
  createDeposit(accountId: number, amount: number, description: string): Observable<Transaction> {
    return this.createTransaction({
      type: 'DEPOSIT',
      sourceAccountId: accountId,
      amount,
      description
    });
  }

  /**
   * Crée un retrait
   */
  createWithdrawal(accountId: number, amount: number, description: string): Observable<Transaction> {
    return this.createTransaction({
      type: 'WITHDRAWAL',
      sourceAccountId: accountId,
      amount,
      description
    });
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

    console.error('Transaction service error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
