import { useState, useEffect, useCallback } from 'react';
import { accountService, BankAccount } from '@/services';

interface UseAccountsReturn {
  accounts: BankAccount[];
  isLoading: boolean;
  error: string | null;
  refreshAccounts: () => Promise<void>;
  getAccountById: (id: number) => BankAccount | undefined;
  totalBalance: number;
}

/**
 * Hook personnalisé pour gérer les comptes bancaires
 */
export const useAccounts = (clientId: number | null): UseAccountsReturn => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    if (!clientId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await accountService.getAccountsByClient(clientId);
      setAccounts(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la récupération des comptes';
      setError(errorMessage);
      console.error('Fetch accounts error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const refreshAccounts = async () => {
    await fetchAccounts();
  };

  const getAccountById = (id: number): BankAccount | undefined => {
    return accounts.find(acc => acc.id === id);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return {
    accounts,
    isLoading,
    error,
    refreshAccounts,
    getAccountById,
    totalBalance,
  };
};
