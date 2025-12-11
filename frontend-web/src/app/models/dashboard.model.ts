import { Client } from './client.model';
import { Account } from './account.model';
import { Transaction } from './transaction.model';

export interface BalanceHistory {
  date: string;
  balance: number;
  period: string;
}

export interface Alert {
  type: string;
  severity: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface GoalProgress {
  totalSavingsGoal: number;
  currentSavings: number;
  monthlyTarget: number;
  progressPercentage: number;
  targetDate: string;
  status: string;
}

export interface DashboardInsights {
  spendingTrend: string;
  monthlyGrowthPercentage: number;
  topSpendingCategory: string;
  averageMonthlyBalance: number;
  recommendations: string[];
  alerts: Alert[];
  goalProgress: GoalProgress;
}

export interface Dashboard {
  client: Client;
  accounts: Account[];
  recentTransactions: Transaction[];
  totalBalance: number;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  savingsRate?: number;
  transactionsByType?: { [key: string]: number };
  balanceHistory?: BalanceHistory[];
  insights?: DashboardInsights;
  lastUpdated?: string;
}

export interface Statement {
  accountId: number;
  accountNumber: string;
  from: Date;
  to: Date;
  transactions: Transaction[];
  openingBalance: number;
  closingBalance: number;
}

