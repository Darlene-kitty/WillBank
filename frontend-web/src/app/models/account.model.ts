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
  accountType: AccountType | 'SAVINGS' | 'CHECKING';
  balance?: number;
  clientId: number;
  status?: AccountStatus | 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
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
