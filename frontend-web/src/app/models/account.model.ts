export enum AccountType {
  SAVINGS = 'SAVINGS',
  CHECKING = 'CHECKING',
  BUSINESS = 'BUSINESS'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED'
}

export interface Account {
  id?: number;
  accountNumber?: string;
  accountType: AccountType | 'SAVINGS' | 'CHECKING' | 'BUSINESS';
  balance?: number;
  clientId: number;
  status?: AccountStatus | 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AccountBalance {
  accountId: number;
  balance: number;
  lastUpdated: Date;
}

export interface CreateAccountRequest {
  clientId: number;
  accountType: AccountType | 'SAVINGS' | 'CHECKING';
}
