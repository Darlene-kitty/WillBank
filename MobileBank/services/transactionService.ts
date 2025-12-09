import api from './api';

export interface Transaction {
  id?: number;
  transactionReference?: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  sourceAccountId: number;
  destinationAccountId?: number;
  destinationIban?: string;
  amount: number;
  description?: string;
  status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt?: string;
}

export const transactionService = {
  /**
   * Création d'une transaction
   */
  createTransaction: async (data: Transaction): Promise<Transaction> => {
    const response = await api.post('/api/transactions', data);
    return response.data;
  },

  /**
   * Récupération d'une transaction par ID
   */
  getTransactionById: async (transactionId: number): Promise<Transaction> => {
    const response = await api.get(`/api/transactions/${transactionId}`);
    return response.data;
  },

  /**
   * Récupération d'une transaction par référence
   */
  getTransactionByReference: async (reference: string): Promise<Transaction> => {
    const response = await api.get(`/api/transactions/reference/${reference}`);
    return response.data;
  },

  /**
   * Récupération des transactions d'un compte
   */
  getTransactionsByAccount: async (accountId: number): Promise<Transaction[]> => {
    const response = await api.get(`/api/transactions/account/${accountId}`);
    return response.data;
  },

  /**
   * Récupération des transactions par plage de dates
   */
  getTransactionsByDateRange: async (
    accountId: number,
    startDate: string,
    endDate: string
  ): Promise<Transaction[]> => {
    const response = await api.get(
      `/api/transactions/account/${accountId}/range`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data;
  },

  /**
   * Récupération de toutes les transactions (admin only)
   */
  getAllTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get('/api/transactions');
    return response.data;
  },

  /**
   * Création d'un virement
   */
  createTransfer: async (
    sourceAccountId: number,
    destinationAccountId: number,
    amount: number,
    description: string,
    destinationIban?: string
  ): Promise<Transaction> => {
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
  ): Promise<Transaction> => {
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
  ): Promise<Transaction> => {
    return transactionService.createTransaction({
      type: 'WITHDRAWAL',
      sourceAccountId: accountId,
      amount,
      description,
    });
  },
};
