export interface Transaction {
  id?: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  sourceAccountId: number;
  destinationAccountId?: number;
  destinationIban?: string;
  amount: number;
  description?: string;
  status?: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt?: Date;
}

export interface TransactionRequest {
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  sourceAccountId: number;
  destinationAccountId?: number;
  destinationIban?: string;
  amount: number;
  description?: string;
}
