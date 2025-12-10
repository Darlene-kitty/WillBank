import { dashboardApi } from './api';
import { API_CONFIG } from '@/config/environment';
import { AccountDTO } from './accountService';
import { ClientDTO } from './clientService';
import { TransactionDTO } from './transactionService';

// Types
export interface DashboardResponse {
  client: ClientDTO;
  accounts: AccountDTO[];
  recentTransactions: TransactionDTO[];
}

export interface StatementResponse {
  account: AccountDTO;
  startDate: string;
  endDate: string;
  transactions: TransactionDTO[];
}

// Types enrichis calculés côté client
export interface EnrichedDashboardResponse extends DashboardResponse {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface EnrichedStatementResponse extends StatementResponse {
  totalCredits: number;
  totalDebits: number;
  balance: number;
}

const ENDPOINTS = API_CONFIG.DASHBOARD_SERVICE.ENDPOINTS;

export const dashboardService = {
  /**
   * Récupération du dashboard complet d'un client
   */
  getDashboard: async (clientId: number): Promise<DashboardResponse> => {
    const response = await dashboardApi.get<DashboardResponse>(ENDPOINTS.DASHBOARD(clientId));
    return response.data;
  },

  /**
   * Récupération du dashboard avec calculs enrichis
   */
  getEnrichedDashboard: async (clientId: number): Promise<EnrichedDashboardResponse> => {
    const dashboard = await dashboardService.getDashboard(clientId);
    
    // Calcul du solde total
    const totalBalance = dashboard.accounts.reduce((sum, account) => sum + account.balance, 0);
    
    // Calcul des revenus et dépenses du mois en cours
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    const monthlyTransactions = dashboard.recentTransactions.filter(
      t => t.createdAt && t.createdAt >= startOfMonth
    );
    
    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'DEPOSIT')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'WITHDRAWAL' || t.type === 'TRANSFER')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      ...dashboard,
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
    };
  },

  /**
   * Récupération d'un relevé de compte
   */
  getAccountStatement: async (
    accountId: number,
    startDate: string,
    endDate: string
  ): Promise<StatementResponse> => {
    const response = await dashboardApi.get<StatementResponse>(ENDPOINTS.STATEMENT(accountId), {
      params: { startDate, endDate },
    });
    return response.data;
  },

  /**
   * Récupération d'un relevé de compte avec calculs enrichis
   */
  getEnrichedStatement: async (
    accountId: number,
    startDate: string,
    endDate: string
  ): Promise<EnrichedStatementResponse> => {
    const statement = await dashboardService.getAccountStatement(accountId, startDate, endDate);
    
    const totalCredits = statement.transactions
      .filter(t => t.type === 'DEPOSIT')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalDebits = statement.transactions
      .filter(t => t.type === 'WITHDRAWAL' || t.type === 'TRANSFER')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      ...statement,
      totalCredits,
      totalDebits,
      balance: statement.account.balance,
    };
  },
};

export default dashboardService;
