import { transactionApi } from './api';
import { API_CONFIG } from '@/config/environment';

// Types
export interface TransactionDTO {
  id?: number;
  transactionReference?: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  sourceAccountId: number;
  destinationAccountId?: number;
  destinationIban?: string;
  amount: number;
  description?: string;
  status?: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt?: string;
}

export interface CreateTransactionRequest {
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  sourceAccountId: number;
  destinationAccountId?: number;
  destinationIban?: string;
  amount: number;
  description?: string;
}

// Alias pour rétrocompatibilité
export type Transaction = TransactionDTO;

const ENDPOINTS = API_CONFIG.TRANSACTION_SERVICE.ENDPOINTS;

export const transactionService = {
  /**
   * Création d'une transaction
   */
  createTransaction: async (data: CreateTransactionRequest): Promise<TransactionDTO> => {
    const response = await transactionApi.post<TransactionDTO>(ENDPOINTS.TRANSACTIONS, data);
    return response.data;
  },

  /**
   * Récupération d'une transaction par ID
   */
  getTransactionById: async (transactionId: number): Promise<TransactionDTO> => {
    const response = await transactionApi.get<TransactionDTO>(ENDPOINTS.TRANSACTION_BY_ID(transactionId));
    return response.data;
  },

  /**
   * Récupération d'une transaction par référence
   */
  getTransactionByReference: async (reference: string): Promise<TransactionDTO> => {
    const response = await transactionApi.get<TransactionDTO>(ENDPOINTS.TRANSACTION_BY_REF(reference));
    return response.data;
  },

  /**
   * Récupération des transactions d'un compte
   */
  getTransactionsByAccount: async (accountId: number): Promise<TransactionDTO[]> => {
    const response = await transactionApi.get<TransactionDTO[]>(ENDPOINTS.TRANSACTIONS_BY_ACCOUNT(accountId));
    return response.data;
  },

  /**
   * Récupération des transactions par plage de dates
   */
  getTransactionsByDateRange: async (
    accountId: number,
    startDate: string,
    endDate: string
  ): Promise<TransactionDTO[]> => {
    const response = await transactionApi.get<TransactionDTO[]>(
      ENDPOINTS.TRANSACTIONS_BY_DATE_RANGE(accountId),
      {
        params: { startDate, endDate },
      }
    );
    return response.data;
  },

  /**
   * Récupération de toutes les transactions (admin)
   */
  getAllTransactions: async (): Promise<TransactionDTO[]> => {
    const response = await transactionApi.get<TransactionDTO[]>(ENDPOINTS.TRANSACTIONS);
    return response.data;
  },

  /**
   * Création d'un virement
   */
  createTransfer: async (
    sourceAccountId: number,
    destinationAccountId: number | undefined,
    amount: number,
    description: string,
    destinationIban?: string
  ): Promise<TransactionDTO> => {
    return transactionService.createTransaction({
      type: 'TRANSFER',
      sourceAccountId,
      destinationAccountId,
      destinationIban,
      amount,
      description,
    });
  },

  /**
   * Création d'un dépôt
   */
  createDeposit: async (
    accountId: number,
    amount: number,
    description: string
  ): Promise<TransactionDTO> => {
    return transactionService.createTransaction({
      type: 'DEPOSIT',
      sourceAccountId: accountId,
      amount,
      description,
    });
  },

  /**
   * Création d'un retrait
   */
  createWithdrawal: async (
    accountId: number,
    amount: number,
    description: string
  ): Promise<TransactionDTO> => {
    return transactionService.createTransaction({
      type: 'WITHDRAWAL',
      sourceAccountId: accountId,
      amount,
      description,
    });
  },
};

export default transactionService;
