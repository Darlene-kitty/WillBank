import apiClient from './api.service';
import {
  Account,
  AccountBalance,
  CreateAccountRequest,
  CreditDebitRequest,
} from '../types/account.types';

class AccountService {
  private readonly ENDPOINT = '/api/accounts';

  /**
   * Récupère tous les comptes
   */
  async getAllAccounts(): Promise<Account[]> {
    try {
      return await apiClient.get<Account[]>(this.ENDPOINT);
    } catch (error) {
      console.error('Get all accounts error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupère un compte par son ID
   */
  async getAccountById(id: number): Promise<Account> {
    try {
      return await apiClient.get<Account>(`${this.ENDPOINT}/${id}`);
    } catch (error) {
      console.error('Get account by ID error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupère un compte par son numéro
   */
  async getAccountByNumber(accountNumber: string): Promise<Account> {
    try {
      return await apiClient.get<Account>(`${this.ENDPOINT}/number/${accountNumber}`);
    } catch (error) {
      console.error('Get account by number error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupère tous les comptes d'un client
   */
  async getAccountsByClientId(clientId: number): Promise<Account[]> {
    try {
      return await apiClient.get<Account[]>(`${this.ENDPOINT}/client/${clientId}`);
    } catch (error) {
      console.error('Get accounts by client ID error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupère le solde d'un compte
   */
  async getAccountBalance(id: number): Promise<number> {
    try {
      return await apiClient.get<number>(`${this.ENDPOINT}/${id}/balance`);
    } catch (error) {
      console.error('Get account balance error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Crée un nouveau compte
   */
  async createAccount(request: CreateAccountRequest): Promise<Account> {
    try {
      return await apiClient.post<Account>(this.ENDPOINT, request);
    } catch (error) {
      console.error('Create account error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Met à jour un compte
   */
  async updateAccount(id: number, account: Account): Promise<Account> {
    try {
      return await apiClient.put<Account>(`${this.ENDPOINT}/${id}`, account);
    } catch (error) {
      console.error('Update account error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Crédite un compte
   */
  async creditAccount(id: number, amount: number): Promise<void> {
    try {
      await apiClient.post<void>(
        `${this.ENDPOINT}/${id}/credit?amount=${amount}`
      );
    } catch (error) {
      console.error('Credit account error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Débite un compte
   */
  async debitAccount(id: number, amount: number): Promise<void> {
    try {
      await apiClient.post<void>(
        `${this.ENDPOINT}/${id}/debit?amount=${amount}`
      );
    } catch (error) {
      console.error('Debit account error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Supprime un compte
   */
  async deleteAccount(id: number): Promise<void> {
    try {
      await apiClient.delete<void>(`${this.ENDPOINT}/${id}`);
    } catch (error) {
      console.error('Delete account error:', error);
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

export default new AccountService();
