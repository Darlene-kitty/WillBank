import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ApiService } from './api.service';
import { Transaction, TransactionRequest } from '../models/transaction.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private endpoint = '/api/transactions';
  private useMockData = !environment.production;

  private mockTransactions: Transaction[] = [
    {
      id: 1,
      type: 'DEPOSIT',
      sourceAccountId: 1,
      amount: 3200.00,
      description: 'Salaire Novembre',
      status: 'COMPLETED',
      createdAt: new Date('2024-12-01')
    },
    {
      id: 2,
      type: 'WITHDRAWAL',
      sourceAccountId: 1,
      amount: 100.00,
      description: 'Retrait ATM',
      status: 'COMPLETED',
      createdAt: new Date('2024-12-02')
    },
    {
      id: 3,
      type: 'WITHDRAWAL',
      sourceAccountId: 1,
      amount: 85.40,
      description: 'Supermarché Carrefour',
      status: 'COMPLETED',
      createdAt: new Date('2024-12-03')
    }
  ];

  constructor(private api: ApiService) {}

  getAllTransactions(): Observable<Transaction[]> {
    if (this.useMockData) {
      return of(this.mockTransactions).pipe(delay(800));
    }
    return this.api.get<Transaction[]>(this.endpoint);
  }

  getTransactionById(id: number): Observable<Transaction> {
    if (this.useMockData) {
      const transaction = this.mockTransactions.find(t => t.id === id);
      return of(transaction!).pipe(delay(500));
    }
    return this.api.get<Transaction>(`${this.endpoint}/${id}`);
  }

  getTransactionsByAccountId(accountId: number): Observable<Transaction[]> {
    if (this.useMockData) {
      const transactions = this.mockTransactions.filter(
        t => t.sourceAccountId === accountId || t.destinationAccountId === accountId
      );
      return of(transactions).pipe(delay(500));
    }
    return this.api.get<Transaction[]>(`${this.endpoint}/account/${accountId}`);
  }

  createTransaction(transaction: TransactionRequest): Observable<Transaction> {
    if (this.useMockData) {
      const newTransaction: Transaction = {
        ...transaction,
        id: Math.max(...this.mockTransactions.map(t => t.id || 0)) + 1,
        status: 'COMPLETED',
        createdAt: new Date()
      };
      this.mockTransactions.unshift(newTransaction);
      return of(newTransaction).pipe(delay(1000));
    }
    return this.api.post<Transaction>(this.endpoint, transaction);
  }
}
