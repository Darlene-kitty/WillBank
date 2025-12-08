import { useState, useEffect, useCallback } from 'react';
import { accountService } from '../services';
import { Account, CreateAccountRequest } from '../types';

/**
 * Hook personnalisé pour gérer les comptes bancaires
 */
export const useAccounts = (clientId?: number) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charge les comptes au montage si clientId est fourni
   */
  useEffect(() => {
    if (clientId) {
      loadAccountsByClient(clientId);
    }
  }, [clientId]);

  /**
   * Charge tous les comptes d'un client
   */
  const loadAccountsByClient = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await accountService.getAccountsByClientId(id);
      setAccounts(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors du chargement des comptes';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Charge un compte par son ID
   */
  const loadAccount = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const account = await accountService.getAccountById(id);
      setSelectedAccount(account);
      return account;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors du chargement du compte';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Obtient le solde d'un compte
   */
  const getBalance = useCallback(async (id: number) => {
    try {
      setError(null);
      return await accountService.getAccountBalance(id);
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la récupération du solde';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Crée un nouveau compte
   */
  const createAccount = useCallback(async (request: CreateAccountRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const newAccount = await accountService.createAccount(request);
      setAccounts(prev => [...prev, newAccount]);
      return newAccount;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la création du compte';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Crédite un compte
   */
  const creditAccount = useCallback(async (id: number, amount: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await accountService.creditAccount(id, amount);
      // Recharge le compte pour mettre à jour le solde
      if (clientId) {
        await loadAccountsByClient(clientId);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors du crédit du compte';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [clientId, loadAccountsByClient]);

  /**
   * Débite un compte
   */
  const debitAccount = useCallback(async (id: number, amount: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await accountService.debitAccount(id, amount);
      // Recharge le compte pour mettre à jour le solde
      if (clientId) {
        await loadAccountsByClient(clientId);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors du débit du compte';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [clientId, loadAccountsByClient]);

  /**
   * Rafraîchit la liste des comptes
   */
  const refresh = useCallback(async () => {
    if (clientId) {
      await loadAccountsByClient(clientId);
    }
  }, [clientId, loadAccountsByClient]);

  return {
    accounts,
    selectedAccount,
    isLoading,
    error,
    loadAccountsByClient,
    loadAccount,
    getBalance,
    createAccount,
    creditAccount,
    debitAccount,
    refresh,
  };
};
