import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { AccountService } from '../../services/account.service';
import { NotificationService } from '../../services/notification.service';
import { Transaction, TransactionRequest } from '../../models/transaction.model';
import { Account } from '../../models/account.model';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { PaginationComponent } from '../shared/pagination/pagination.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, PaginationComponent],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  paginatedTransactions: Transaction[] = [];
  accounts: Account[] = [];
  loading = true;
  error = '';
  successMessage = '';
  searchTerm = '';
  filterType: string = 'ALL';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  
  // Statistiques
  stats = {
    totalTransactions: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalTransfers: 0
  };
  
  selectedTransactions: Set<number> = new Set();
  Math = Math;
  
  showModal = false;
  submitting = false;
  
  newTransaction: TransactionRequest = {
    type: 'DEPOSIT',
    sourceAccountId: 0,
    amount: 0,
    description: ''
  };

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
    this.loadAccounts();
  }

  loadTransactions(): void {
    this.loading = true;
    this.transactionService.getAllTransactions().subscribe({
      next: (data) => {
        this.transactions = data.sort((a, b) => 
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
        this.calculateStats();
        this.applyFilters();
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats.totalTransactions = this.transactions.length;
    this.stats.totalDeposits = this.transactions.filter(t => t.type === 'DEPOSIT').length;
    this.stats.totalWithdrawals = this.transactions.filter(t => t.type === 'WITHDRAWAL').length;
    this.stats.totalTransfers = this.transactions.filter(t => t.type === 'TRANSFER').length;
  }

  toggleSelectTransaction(transactionId: number): void {
    if (this.selectedTransactions.has(transactionId)) {
      this.selectedTransactions.delete(transactionId);
    } else {
      this.selectedTransactions.add(transactionId);
    }
  }

  toggleSelectAll(): void {
    if (this.selectedTransactions.size === this.paginatedTransactions.length) {
      this.selectedTransactions.clear();
    } else {
      this.paginatedTransactions.forEach(transaction => {
        if (transaction.id) this.selectedTransactions.add(transaction.id);
      });
    }
  }

  isAllSelected(): boolean {
    const paginated = this.paginatedTransactions;
    return paginated.length > 0 && paginated.every(transaction => 
      transaction.id && this.selectedTransactions.has(transaction.id)
    );
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push(-1);
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = this.totalPages - 3; i <= this.totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        pages.push(this.currentPage - 1);
        pages.push(this.currentPage);
        pages.push(this.currentPage + 1);
        pages.push(-1);
        pages.push(this.totalPages);
      }
    }
    
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.transactions;

    // Filter by type
    if (this.filterType !== 'ALL') {
      filtered = filtered.filter(t => t.type === this.filterType);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.description?.toLowerCase().includes(term) ||
        t.amount.toString().includes(term)
      );
    }

    this.filteredTransactions = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTransactions = this.filteredTransactions.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des comptes';
      }
    });
  }

  openModal(): void {
    this.newTransaction = {
      type: 'DEPOSIT',
      sourceAccountId: 0,
      amount: 0,
      description: ''
    };
    this.error = '';
    this.successMessage = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.error = '';
    this.successMessage = '';
  }

  onTransactionTypeChange(): void {
    if (this.newTransaction.type !== 'TRANSFER') {
      this.newTransaction.destinationAccountId = undefined;
    }
  }

  onSubmit(): void {
    if (!this.newTransaction.sourceAccountId || this.newTransaction.amount <= 0) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    if (this.newTransaction.type === 'TRANSFER' && !this.newTransaction.destinationAccountId) {
      this.error = 'Veuillez sélectionner un compte de destination';
      return;
    }

    if (this.newTransaction.type === 'TRANSFER' && 
        this.newTransaction.sourceAccountId === this.newTransaction.destinationAccountId) {
      this.error = 'Les comptes source et destination doivent être différents';
      return;
    }

    this.submitting = true;
    this.error = '';

    this.transactionService.createTransaction(this.newTransaction).subscribe({
      next: () => {
        this.notificationService.success(
          'Transaction réussie',
          `${this.getTransactionTypeLabel(this.newTransaction.type)} de ${this.newTransaction.amount} MAD effectué avec succès`
        );
        this.loadTransactions();
        this.closeModal();
        this.submitting = false;
      },
      error: (err) => {
        this.notificationService.error('Erreur de transaction', err.message);
        this.error = err.message;
        this.submitting = false;
      }
    });
  }

  getTransactionTypeLabel(type: string): string {
    const labels: any = {
      'DEPOSIT': 'Dépôt',
      'WITHDRAWAL': 'Retrait',
      'TRANSFER': 'Virement'
    };
    return labels[type] || type;
  }

  getTransactionClass(type: string): string {
    const classes: any = {
      'DEPOSIT': 'deposit',
      'WITHDRAWAL': 'withdrawal',
      'TRANSFER': 'transfer'
    };
    return classes[type] || '';
  }

  getAccountNumber(accountId: number): string {
    const account = this.accounts.find(a => a.id === accountId);
    return account?.accountNumber || `Compte #${accountId}`;
  }

  getAvailableDestinationAccounts(): Account[] {
    return this.accounts.filter(a => a.id !== this.newTransaction.sourceAccountId);
  }
}
