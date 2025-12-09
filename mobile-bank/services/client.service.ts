import apiClient from './api.service';
import { Client } from '../types/client.types';

class ClientService {
  private readonly ENDPOINT = '/api/clients';

  /**
   * Récupère tous les clients
   */
  async getAllClients(): Promise<Client[]> {
    try {
      return await apiClient.get<Client[]>(this.ENDPOINT);
    } catch (error) {
      console.error('Get all clients error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupère un client par son ID
   */
  async getClientById(id: number): Promise<Client> {
    try {
      return await apiClient.get<Client>(`${this.ENDPOINT}/${id}`);
    } catch (error) {
      console.error('Get client by ID error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Crée un nouveau client
   */
  async createClient(client: Client): Promise<Client> {
    try {
      return await apiClient.post<Client>(this.ENDPOINT, client);
    } catch (error) {
      console.error('Create client error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Met à jour un client
   */
  async updateClient(id: number, client: Client): Promise<Client> {
    try {
      return await apiClient.put<Client>(`${this.ENDPOINT}/${id}`, client);
    } catch (error) {
      console.error('Update client error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Supprime un client
   */
  async deleteClient(id: number): Promise<void> {
    try {
      await apiClient.delete<void>(`${this.ENDPOINT}/${id}`);
    } catch (error) {
      console.error('Delete client error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Gère les erreurs API
   */
  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || 'Une erreur est survenue';
      return new Error(message);
    } else if (error.request) {
      return new Error('Impossible de contacter le serveur. Vérifiez votre connexion.');
    } else {
      return new Error(error.message || 'Une erreur inattendue est survenue');
    }
  }
}

export default new ClientService();
