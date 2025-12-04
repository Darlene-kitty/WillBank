import { Client } from './client.model';
import { Account } from './account.model';
import { Transaction } from './transaction.model';

export interface Dashboard {
  client: Client;
  accounts: Account[];
  recentTransactions: Transaction[];
  totalBalance: number;
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
