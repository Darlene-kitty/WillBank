import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TransactionFilters {
  type: string;
  dateFrom: string;
  dateTo: string;
  minAmount: number;
  maxAmount: number;
  search: string;
}

@Component({
  selector: 'app-transaction-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-filters.component.html',
  styleUrls: ['./transaction-filters.component.scss']
})
export class TransactionFiltersComponent {
  @Output() filtersChange = new EventEmitter<TransactionFilters>();
  @Output() filtersReset = new EventEmitter<void>();

  showFilters = false;

  filters: TransactionFilters = {
    type: '',
    dateFrom: '',
    dateTo: '',
    minAmount: 0,
    maxAmount: 0,
    search: ''
  };

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  applyFilters(): void {
    this.filtersChange.emit(this.filters);
  }

  resetFilters(): void {
    this.filters = {
      type: '',
      dateFrom: '',
      dateTo: '',
      minAmount: 0,
      maxAmount: 0,
      search: ''
    };
    this.filtersReset.emit();
  }

  hasActiveFilters(): boolean {
    return !!(
      this.filters.type ||
      this.filters.dateFrom ||
      this.filters.dateTo ||
      this.filters.minAmount > 0 ||
      this.filters.maxAmount > 0 ||
      this.filters.search
    );
  }
}
