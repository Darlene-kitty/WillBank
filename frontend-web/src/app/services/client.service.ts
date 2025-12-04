import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ApiService } from './api.service';
import { Client } from '../models/client.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private endpoint = '/api/clients';
  private useMockData = !environment.production; // Mode mock en développement

  private mockClients: Client[] = [
    {
      id: 1,
      firstName: 'Ahmed',
      lastName: 'Alami',
      email: 'ahmed@willbank.ma',
      phone: '+212 6 12 34 56 78',
      address: '123 Rue Mohammed V, Casablanca',
      cin: 'AB123456',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 2,
      firstName: 'Fatima',
      lastName: 'Benali',
      email: 'fatima.benali@email.com',
      phone: '+212 6 98 76 54 32',
      address: '45 Avenue Hassan II, Rabat',
      cin: 'CD789012',
      createdAt: new Date('2024-02-20')
    },
    {
      id: 3,
      firstName: 'Youssef',
      lastName: 'Idrissi',
      email: 'youssef.idrissi@email.com',
      phone: '+212 6 55 44 33 22',
      address: '78 Boulevard Zerktouni, Marrakech',
      cin: 'EF345678',
      createdAt: new Date('2024-03-10')
    }
  ];

  constructor(private api: ApiService) {}

  getAllClients(): Observable<Client[]> {
    if (this.useMockData) {
      return of(this.mockClients).pipe(delay(800));
    }
    return this.api.get<Client[]>(this.endpoint);
  }

  getClientById(id: number): Observable<Client> {
    if (this.useMockData) {
      const client = this.mockClients.find(c => c.id === id);
      return of(client!).pipe(delay(500));
    }
    return this.api.get<Client>(`${this.endpoint}/${id}`);
  }

  createClient(client: Client): Observable<Client> {
    if (this.useMockData) {
      const newClient = {
        ...client,
        id: Math.max(...this.mockClients.map(c => c.id || 0)) + 1,
        createdAt: new Date()
      };
      this.mockClients.push(newClient);
      return of(newClient).pipe(delay(500));
    }
    return this.api.post<Client>(this.endpoint, client);
  }

  updateClient(id: number, client: Client): Observable<Client> {
    if (this.useMockData) {
      const index = this.mockClients.findIndex(c => c.id === id);
      if (index !== -1) {
        this.mockClients[index] = { ...client, id, updatedAt: new Date() };
      }
      return of(this.mockClients[index]).pipe(delay(500));
    }
    return this.api.put<Client>(`${this.endpoint}/${id}`, client);
  }

  deleteClient(id: number): Observable<void> {
    if (this.useMockData) {
      const index = this.mockClients.findIndex(c => c.id === id);
      if (index !== -1) {
        this.mockClients.splice(index, 1);
      }
      return of(void 0).pipe(delay(500));
    }
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
