// Types et interfaces pour les comptes bancaires

export enum AccountType {
  SAVINGS = 'SAVINGS',
  CHECKING = 'CHECKING'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED'
}

export interface Account {
  id?: number;
  accountNumber?: string;
  clientId: number;
  accountType: AccountType;
  balance?: number;
  status?: AccountStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AccountBalance {
  accountId: number;
  balance: number;
  lastUpdated: string;
}

export interface CreateAccountRequest {
  clientId: number;
  accountType: AccountType;
}

export interface CreditDebitRequest {
  amount: number;
}
