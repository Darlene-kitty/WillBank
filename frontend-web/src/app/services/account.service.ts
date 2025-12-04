import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ApiService } from './api.service';
import { Account, AccountBalance } from '../models/account.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private endpoint = '/api/accounts';
  private useMockData = !environment.production;

  private mockAccounts: Account[] = [
    {
      id: 1,
      accountNumber: 'MA001234567890123456',
      accountType: 'CHECKING',
      balance: 15420.50,
      clientId: 1,
      status: 'ACTIVE',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 2,
      accountNumber: 'MA009876543210987654',
      accountType: 'SAVINGS',
      balance: 8750.00,
      clientId: 1,
      status: 'ACTIVE',
      createdAt: new Date('2024-02-01')
    },
    {
      id: 3,
      accountNumber: 'MA005555666677778888',
      accountType: 'CHECKING',
      balance: 3200.75,
      clientId: 2,
      status: 'ACTIVE',
      createdAt: new Date('2024-02-20')
    }
  ];

  constructor(private api: ApiService) {}

  getAllAccounts(): Observable<Account[]> {
    if (this.useMockData) {
      return of(this.mockAccounts).pipe(delay(800));
    }
    return this.api.get<Account[]>(this.endpoint);
  }

  getAccountById(id: number): Observable<Account> {
    if (this.useMockData) {
      const account = this.mockAccounts.find(a => a.id === id);
      return of(account!).pipe(delay(500));
    }
    return this.api.get<Account>(`${this.endpoint}/${id}`);
  }

  getAccountsByClientId(clientId: number): Observable<Account[]> {
    if (this.useMockData) {
      const accounts = this.mockAccounts.filter(a => a.clientId === clientId);
      return of(accounts).pipe(delay(500));
    }
    return this.api.get<Account[]>(`${this.endpoint}/client/${clientId}`);
  }

  getAccountBalance(id: number): Observable<AccountBalance> {
    if (this.useMockData) {
      const account = this.mockAccounts.find(a => a.id === id);
      return of({
        accountId: id,
        balance: account?.balance || 0,
        lastUpdated: new Date()
      }).pipe(delay(500));
    }
    return this.api.get<AccountBalance>(`${this.endpoint}/${id}/balance`);
  }

  createAccount(account: Account): Observable<Account> {
    if (this.useMockData) {
      const newAccount = {
        ...account,
        id: Math.max(...this.mockAccounts.map(a => a.id || 0)) + 1,
        accountNumber: `MA${Math.random().toString().slice(2, 20)}`,
        balance: 0,
        status: 'ACTIVE' as const,
        createdAt: new Date()
      };
      this.mockAccounts.push(newAccount);
      return of(newAccount).pipe(delay(500));
    }
    return this.api.post<Account>(this.endpoint, account);
  }

  updateAccount(id: number, account: Account): Observable<Account> {
    if (this.useMockData) {
      const index = this.mockAccounts.findIndex(a => a.id === id);
      if (index !== -1) {
        this.mockAccounts[index] = { ...account, id, updatedAt: new Date() };
      }
      return of(this.mockAccounts[index]).pipe(delay(500));
    }
    return this.api.put<Account>(`${this.endpoint}/${id}`, account);
  }

  deleteAccount(id: number): Observable<void> {
    if (this.useMockData) {
      const index = this.mockAccounts.findIndex(a => a.id === id);
      if (index !== -1) {
        this.mockAccounts.splice(index, 1);
      }
      return of(void 0).pipe(delay(500));
    }
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
