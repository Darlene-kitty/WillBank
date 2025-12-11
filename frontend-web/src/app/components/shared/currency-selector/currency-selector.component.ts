import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyService, Currency, CURRENCIES } from '../../../services/currency.service';

@Component({
  selector: 'app-currency-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="currency-selector">
      <button class="currency-button" (click)="toggleDropdown()">
        <span class="currency-symbol">{{ currentCurrency.symbol }}</span>
        <span class="currency-code">{{ currentCurrency.code }}</span>
        <svg class="dropdown-icon" [class.open]="isOpen" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="6 9 12 15 18 9" stroke-width="2"/>
        </svg>
      </button>

      @if (isOpen) {
        <div class="currency-dropdown">
          @for (currency of currencies; track currency.code) {
            <button 
              class="currency-option"
              [class.active]="currency.code === currentCurrency.code"
              (click)="selectCurrency(currency.code)">
              <span class="option-symbol">{{ currency.symbol }}</span>
              <div class="option-info">
                <span class="option-code">{{ currency.code }}</span>
                <span class="option-name">{{ currency.name }}</span>
              </div>
              @if (currency.code === currentCurrency.code) {
                <svg class="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20 6 9 17 4 12" stroke-width="2"/>
                </svg>
              }
            </button>
          }
        </div>
      }
    </div>

    @if (isOpen) {
      <div class="dropdown-overlay" (click)="closeDropdown()"></div>
    }
  `,
  styles: [`
    .currency-selector {
      position: relative;
      z-index: 50;
    }

    .currency-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;

      &:hover {
        border-color: #cbd5e1;
        background: #f8fafc;
      }
    }

    .currency-symbol {
      font-size: 1.125rem;
      font-weight: 700;
      color: #2563eb;
    }

    .currency-code {
      font-size: 0.875rem;
      color: #64748b;
    }

    .dropdown-icon {
      color: #94a3b8;
      transition: transform 0.2s;

      &.open {
        transform: rotate(180deg);
      }
    }

    .currency-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      min-width: 240px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 0.75rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      padding: 0.5rem;
      animation: slideDown 0.2s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .currency-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem;
      background: transparent;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;

      &:hover {
        background: #f1f5f9;
      }

      &.active {
        background: #dbeafe;
        color: #1e40af;

        .option-symbol {
          color: #2563eb;
        }
      }
    }

    .option-symbol {
      font-size: 1.5rem;
      font-weight: 700;
      color: #64748b;
      width: 32px;
      text-align: center;
    }

    .option-info {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .option-code {
      font-weight: 600;
      font-size: 0.875rem;
      color: #1e293b;
    }

    .option-name {
      font-size: 0.75rem;
      color: #64748b;
    }

    .check-icon {
      color: #2563eb;
      flex-shrink: 0;
    }

    .dropdown-overlay {
      position: fixed;
      inset: 0;
      z-index: 40;
    }
  `]
})
export class CurrencySelectorComponent implements OnInit {
  currentCurrency = CURRENCIES[0];
  currencies = CURRENCIES;
  isOpen = false;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencyService.currentCurrency$.subscribe(currency => {
      this.currentCurrency = currency;
    });
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  selectCurrency(code: string): void {
    this.currencyService.setCurrency(code);
    this.closeDropdown();
  }
}
