import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  paginatedClients: Client[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  statusFilter = 'ALL';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  
  // Statistiques
  stats = {
    totalClients: 0,
    activeClients: 0,
    newThisMonth: 0,
    totalAccounts: 0
  };
  
  selectedClients: Set<number> = new Set();
  Math = Math;
  
  showModal = false;
  showDeleteModal = false;
  modalMode: 'create' | 'edit' = 'create';
  
  currentClient: Client = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    cin: ''
  };
  
  clientToDelete: Client | null = null;
  submitting = false;
  
  // Avatar upload
  selectedAvatar: string | null = null;
  avatarFile: File | null = null;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
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
    this.stats.totalClients = this.clients.length;
    this.stats.activeClients = this.clients.length; // Tous actifs par défaut
    this.stats.newThisMonth = Math.floor(this.clients.length * 0.1); // 10% nouveaux
    this.stats.totalAccounts = this.clients.length * 2; // Moyenne 2 comptes par client
  }

  applyFilters(): void {
    let filtered = [...this.clients];

    // Filtre par recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(client =>
        client.firstName.toLowerCase().includes(term) ||
        client.lastName.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.cin.toLowerCase().includes(term)
      );
    }

    this.filteredClients = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  onSearch(): void {
    this.applyFilters();
  }

  toggleSelectClient(clientId: number): void {
    if (this.selectedClients.has(clientId)) {
      this.selectedClients.delete(clientId);
    } else {
      this.selectedClients.add(clientId);
    }
  }

  toggleSelectAll(): void {
    if (this.selectedClients.size === this.paginatedClients.length) {
      this.selectedClients.clear();
    } else {
      this.paginatedClients.forEach(client => {
        if (client.id) this.selectedClients.add(client.id);
      });
    }
  }

  isAllSelected(): boolean {
    const paginated = this.paginatedClients;
    return paginated.length > 0 && paginated.every(client => 
      client.id && this.selectedClients.has(client.id)
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

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredClients.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedClients = this.filteredClients.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.currentClient = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      cin: ''
    };
    this.selectedAvatar = null;
    this.avatarFile = null;
    this.showModal = true;
  }

  openEditModal(client: Client): void {
    this.modalMode = 'edit';
    this.currentClient = { ...client };
    this.selectedAvatar = null;
    this.avatarFile = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.error = '';
    this.selectedAvatar = null;
    this.avatarFile = null;
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.avatarFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedAvatar = e.target?.result as string;
      };
      reader.readAsDataURL(this.avatarFile);
    }
  }

  getAvatarDisplay(): string {
    if (this.selectedAvatar) {
      return this.selectedAvatar;
    }
    if (this.currentClient.firstName && this.currentClient.lastName) {
      return `${this.currentClient.firstName.charAt(0)}${this.currentClient.lastName.charAt(0)}`;
    }
    return '👤';
  }

  openDeleteModal(client: Client): void {
    this.clientToDelete = client;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.clientToDelete = null;
  }

  onSubmit(): void {
    if (!this.currentClient.firstName || !this.currentClient.lastName || 
        !this.currentClient.email || !this.currentClient.cin) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.currentClient.email)) {
      this.error = 'Email invalide';
      return;
    }

    this.submitting = true;
    this.error = '';

    const operation = this.modalMode === 'create'
      ? this.clientService.createClient(this.currentClient)
      : this.clientService.updateClient(this.currentClient.id!, this.currentClient);

    operation.subscribe({
      next: () => {
        this.loadClients();
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
    if (!this.clientToDelete?.id) return;

    this.submitting = true;
    this.clientService.deleteClient(this.clientToDelete.id).subscribe({
      next: () => {
        this.loadClients();
        this.closeDeleteModal();
        this.submitting = false;
      },
      error: (err: Error) => {
        this.error = err.message;
        this.submitting = false;
      }
    });
  }
}
