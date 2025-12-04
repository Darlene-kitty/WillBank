export interface Account {
  id?: number;
  accountNumber?: string;
  accountType: 'SAVINGS' | 'CHECKING';
  balance?: number;
  clientId: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AccountBalance {
  accountId: number;
  balance: number;
  lastUpdated: Date;
}
