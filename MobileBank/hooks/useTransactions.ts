import { useState, useEffect, useCallback } from 'react';
import { transactionService, Transaction } from '@/services';

interface UseTransactionsReturn {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  refreshTransactions: () => Promise<void>;
  createTransaction: (transaction: Transaction) => Promise<Transaction>;
  getTransactionsByAccount: (accountId: number) => Transaction[];
}

/**
 * Hook personnalisé pour gérer les transactions
 */
export const useTransactions = (accountId?: number): UseTransactionsReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!accountId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await transactionService.getTransactionsByAccount(accountId);
      // Trier par date décroissante
      const sorted = data.sort((a, b) => 
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      );
      setTransactions(sorted);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la récupération des transactions';
      setError(errorMessage);
      console.error('Fetch transactions error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const refreshTransactions = async () => {
    await fetchTransactions();
  };

  const createTransaction = async (transaction: Transaction): Promise<Transaction> => {
    try {
      setIsLoading(true);
      setError(null);
      const newTransaction = await transactionService.createTransaction(transaction);
      // Ajouter la nouvelle transaction au début de la liste
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la création de la transaction';
      setError(errorMessage);
      console.error('Create transaction error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionsByAccount = (accId: number): Transaction[] => {
    return transactions.filter(
      tx => tx.sourceAccountId === accId || tx.destinationAccountId === accId
    );
  };

  return {
    transactions,
    isLoading,
    error,
    refreshTransactions,
    createTransaction,
    getTransactionsByAccount,
  };
};
