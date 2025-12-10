import api from './api';
import { BankAccount } from './accountService';
import { ClientProfile } from './clientService';
import { Transaction } from './transactionService';

export interface DashboardResponse {
  client: ClientProfile;
  accounts: BankAccount[];
  recentTransactions: Transaction[];
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface StatementResponse {
  account: BankAccount;
  transactions: Transaction[];
  startDate: string;
  endDate: string;
  totalCredits: number;
  totalDebits: number;
  balance: number;
}

export const dashboardService = {
  /**
   * Récupération du dashboard complet d'un client
   */
  getDashboard: async (clientId: number): Promise<DashboardResponse> => {
    const response = await api.get(`/api/dashboard/${clientId}`);
    return response.data;
  },

  /**
   * Récupération d'un relevé de compte
   */
  getAccountStatement: async (
    accountId: number,
    from: string,
    to: string
  ): Promise<StatementResponse> => {
    const response = await api.get(`/api/statements/${accountId}`, {
      params: { from, to },
    });
    return response.data;
  },

  /**
   * Récupération des statistiques mensuelles
   */
  getMonthlyStats: async (clientId: number, year: number, month: number) => {
    const response = await api.get(`/api/dashboard/${clientId}/stats`, {
      params: { year, month },
    });
    return response.data;
  },

  /**
   * Récupération des catégories de dépenses
   */
  getExpenseCategories: async (clientId: number, from: string, to: string) => {
    const response = await api.get(`/api/dashboard/${clientId}/categories`, {
      params: { from, to },
    });
    return response.data;
  },
};
