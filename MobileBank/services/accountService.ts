import api from './api';

export interface BankAccount {
  id: number;
  accountNumber: string;
  clientId: number;
  accountType: 'SAVINGS' | 'CHECKING' | 'BUSINESS';
  balance: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export const accountService = {
  /**
   * Récupération des comptes d'un client
   */
  getAccountsByClient: async (clientId: number): Promise<BankAccount[]> => {
    const response = await api.get(`/api/accounts/client/${clientId}`);
    return response.data;
  },

  /**
   * Récupération des détails d'un compte
   */
  getAccountDetails: async (accountId: number): Promise<BankAccount> => {
    const response = await api.get(`/api/accounts/${accountId}`);
    return response.data;
  },

  /**
   * Récupération du solde d'un compte
   */
  getBalance: async (accountId: number): Promise<number> => {
    const response = await api.get(`/api/accounts/${accountId}/balance`);
    return response.data;
  },

  /**
   * Récupération d'un compte par numéro
   */
  getAccountByNumber: async (accountNumber: string): Promise<BankAccount> => {
    const response = await api.get(`/api/accounts/number/${accountNumber}`);
    return response.data;
  },

  /**
   * Mise à jour d'un compte
   */
  updateAccount: async (
    accountId: number,
    data: Partial<BankAccount>
  ): Promise<BankAccount> => {
    const response = await api.put(`/api/accounts/${accountId}`, data);
    return response.data;
  },

  /**
   * Crédit d'un compte
   */
  creditAccount: async (accountId: number, amount: number): Promise<void> => {
    await api.post(`/api/accounts/${accountId}/credit`, null, {
      params: { amount },
    });
  },

  /**
   * Débit d'un compte
   */
  debitAccount: async (accountId: number, amount: number): Promise<void> => {
    await api.post(`/api/accounts/${accountId}/debit`, null, {
      params: { amount },
    });
  },

  /**
   * Récupération de tous les comptes (admin only)
   */
  getAllAccounts: async (): Promise<BankAccount[]> => {
    const response = await api.get('/api/accounts');
    return response.data;
  },

  /**
   * Suppression d'un compte (admin only)
   */
  deleteAccount: async (accountId: number): Promise<void> => {
    await api.delete(`/api/accounts/${accountId}`);
  },
};
