import { accountApi } from './api';
import { API_CONFIG } from '@/config/environment';

// Types
export interface AccountDTO {
  id: number;
  accountNumber: string;
  clientId: number;
  accountType: 'CHECKING' | 'SAVINGS' | 'BUSINESS';
  balance: number;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountRequest {
  clientId: number;
  accountType: 'CHECKING' | 'SAVINGS' | 'BUSINESS';
}

export interface UpdateAccountRequest {
  accountType?: 'CHECKING' | 'SAVINGS' | 'BUSINESS';
  status?: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
}

// Alias pour rétrocompatibilité
export type BankAccount = AccountDTO;

const ENDPOINTS = API_CONFIG.ACCOUNT_SERVICE.ENDPOINTS;

export const accountService = {
  /**
   * Création d'un nouveau compte
   */
  createAccount: async (data: CreateAccountRequest): Promise<AccountDTO> => {
    const response = await accountApi.post<AccountDTO>(ENDPOINTS.ACCOUNTS, data);
    return response.data;
  },

  /**
   * Récupération d'un compte par ID
   */
  getAccountById: async (accountId: number): Promise<AccountDTO> => {
    const response = await accountApi.get<AccountDTO>(ENDPOINTS.ACCOUNT_BY_ID(accountId));
    return response.data;
  },

  /**
   * Récupération d'un compte par numéro
   */
  getAccountByNumber: async (accountNumber: string): Promise<AccountDTO> => {
    const response = await accountApi.get<AccountDTO>(ENDPOINTS.ACCOUNT_BY_NUMBER(accountNumber));
    return response.data;
  },

  /**
   * Récupération des comptes d'un client
   */
  getAccountsByClient: async (clientId: number): Promise<AccountDTO[]> => {
    const response = await accountApi.get<AccountDTO[]>(ENDPOINTS.ACCOUNTS_BY_CLIENT(clientId));
    return response.data;
  },

  /**
   * Récupération de tous les comptes (admin)
   */
  getAllAccounts: async (): Promise<AccountDTO[]> => {
    const response = await accountApi.get<AccountDTO[]>(ENDPOINTS.ACCOUNTS);
    return response.data;
  },

  /**
   * Mise à jour d'un compte
   */
  updateAccount: async (accountId: number, data: UpdateAccountRequest): Promise<AccountDTO> => {
    const response = await accountApi.put<AccountDTO>(ENDPOINTS.ACCOUNT_BY_ID(accountId), data);
    return response.data;
  },

  /**
   * Récupération du solde d'un compte (avec cache)
   */
  getBalance: async (accountId: number): Promise<number> => {
    const response = await accountApi.get<number>(ENDPOINTS.BALANCE(accountId));
    return response.data;
  },

  /**
   * Créditer un compte
   */
  creditAccount: async (accountId: number, amount: number): Promise<void> => {
    await accountApi.post(ENDPOINTS.CREDIT(accountId), null, {
      params: { amount },
    });
  },

  /**
   * Débiter un compte
   */
  debitAccount: async (accountId: number, amount: number): Promise<void> => {
    await accountApi.post(ENDPOINTS.DEBIT(accountId), null, {
      params: { amount },
    });
  },

  /**
   * Suppression d'un compte (admin)
   */
  deleteAccount: async (accountId: number): Promise<void> => {
    await accountApi.delete(ENDPOINTS.ACCOUNT_BY_ID(accountId));
  },

  /**
   * Alias pour rétrocompatibilité
   */
  getAccountDetails: async (accountId: number): Promise<AccountDTO> => {
    return accountService.getAccountById(accountId);
  },
};

export default accountService;
