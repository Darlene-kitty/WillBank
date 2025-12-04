import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ApiService } from './api.service';
import { Dashboard, Statement } from '../models/dashboard.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private useMockData = !environment.production;

  constructor(private api: ApiService) {}

  getClientDashboard(clientId: number): Observable<Dashboard> {
    if (this.useMockData) {
      const mockDashboard: Dashboard = {
        client: {
          id: 1,
          firstName: 'Ahmed',
          lastName: 'Alami',
          email: 'ahmed@willbank.ma',
          phone: '+212 6 12 34 56 78',
          address: '123 Rue Mohammed V, Casablanca',
          cin: 'AB123456'
        },
        accounts: [
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
          }
        ],
        recentTransactions: [
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
        ],
        totalBalance: 24170.50
      };
      return of(mockDashboard).pipe(delay(1000));
    }
    return this.api.get<Dashboard>(`/api/dashboard/${clientId}`);
  }

  getAccountStatement(accountId: number, from: string, to: string): Observable<Statement> {
    return this.api.get<Statement>(`/api/statements/${accountId}`, { from, to });
  }
}
