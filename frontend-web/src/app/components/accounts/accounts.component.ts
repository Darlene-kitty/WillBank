import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { ClientService } from '../../services/client.service';
import { Account } from '../../models/account.model';
import { Client } from '../../models/client.model';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];
  filteredAccounts: Account[] = [];
  clients: Client[] = [];
  loading = true;
  error = '';
  
  // Filtres et recherche
  searchTerm = '';
  statusFilter = 'ALL';
  typeFilter = 'ALL';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  
  // Statistiques
  stats = {
    totalAccounts: 0,
    activeAccounts: 0,
    blockedAccounts: 0,
    totalBalance: 0
  };
  
  showModal = false;
  showDeleteModal = false;
  modalMode: 'create' | 'edit' = 'create';
  
  currentAccount: Account = {
    clientId: 0,
    accountType: 'SAVINGS'
  };
  
  accountToDelete: Account | null = null;
  submitting = false;
  selectedAccounts: Set<number> = new Set();

  constructor(
    private accountService: AccountService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
    this.loadClients();
  }

  loadAccounts(): void {
    this.loading = true;
    this.accountService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.calculateStats();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats.totalAccounts = this.accounts.length;
    this.stats.activeAccounts = this.accounts.filter(a => a.status === 'ACTIVE').length;
    this.stats.blockedAccounts = this.accounts.filter(a => a.status === 'BLOCKED').length;
    this.stats.totalBalance = this.accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
  }

  applyFilters(): void {
    let filtered = [...this.accounts];

    // Filtre par recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(account => 
        this.getClientName(account.clientId).toLowerCase().includes(term) ||
        account.accountNumber?.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(account => account.status === this.statusFilter);
    }

    // Filtre par type
    if (this.typeFilter !== 'ALL') {
      filtered = filtered.filter(account => account.accountType === this.typeFilter);
    }

    this.filteredAccounts = filtered;
    this.totalPages = Math.ceil(this.filteredAccounts.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onTypeFilterChange(): void {
    this.applyFilters();
  }

  getPaginatedAccounts(): Account[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredAccounts.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
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
        pages.push(-1); // Ellipsis
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

  toggleSelectAccount(accountId: number): void {
    if (this.selectedAccounts.has(accountId)) {
      this.selectedAccounts.delete(accountId);
    } else {
      this.selectedAccounts.add(accountId);
    }
  }

  toggleSelectAll(): void {
    if (this.selectedAccounts.size === this.getPaginatedAccounts().length) {
      this.selectedAccounts.clear();
    } else {
      this.getPaginatedAccounts().forEach(account => {
        if (account.id) this.selectedAccounts.add(account.id);
      });
    }
  }

  isAllSelected(): boolean {
    const paginated = this.getPaginatedAccounts();
    return paginated.length > 0 && paginated.every(account => 
      account.id && this.selectedAccounts.has(account.id)
    );
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des clients';
      }
    });
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.currentAccount = {
      clientId: 0,
      accountType: 'SAVINGS',
      balance: 0,
      status: 'ACTIVE'
    };
    this.showModal = true;
  }

  openEditModal(account: Account): void {
    this.modalMode = 'edit';
    this.currentAccount = { ...account };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.error = '';
  }

  openDeleteModal(account: Account): void {
    this.accountToDelete = account;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.accountToDelete = null;
  }

  onSubmit(): void {
    if (!this.currentAccount.clientId) {
      this.error = 'Veuillez sélectionner un client';
      return;
    }

    this.submitting = true;
    this.error = '';

    const operation = this.modalMode === 'create'
      ? this.accountService.createAccount(this.currentAccount)
      : this.accountService.updateAccount(this.currentAccount.id!, this.currentAccount);

    operation.subscribe({
      next: () => {
        this.loadAccounts();
        this.closeModal();
        this.submitting = false;
      },
      error: (err: Error) => {
        this.error = err.message;
        this.submitting = false;
      }
    });
  }

  confirmDelete(): void {
    if (!this.accountToDelete?.id) return;

    this.submitting = true;
    this.accountService.deleteAccount(this.accountToDelete.id).subscribe({
      next: () => {
        this.loadAccounts();
        this.closeDeleteModal();
        this.submitting = false;
      },
      error: (err: Error) => {
        this.error = err.message;
        this.submitting = false;
      }
    });
  }

  getAccountTypeLabel(type: string): string {
    return type === 'SAVINGS' ? 'Épargne' : 'Courant';
  }

  getClientName(clientId: number): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Client inconnu';
  }

  // Expose Math for template
  Math = Math;
}
