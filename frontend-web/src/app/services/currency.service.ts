import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'XOF', symbol: 'FCFA', name: 'Franc CFA', locale: 'fr-FR' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'fr-FR' },
  { code: 'JPY', symbol: '¥', name: 'Yen', locale: 'ja-JP' }
];

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private currentCurrencySubject = new BehaviorSubject<Currency>(CURRENCIES[0]);
  public currentCurrency$ = this.currentCurrencySubject.asObservable();

  // Taux de change (base: 1 EUR)
  private exchangeRates: { [key: string]: number } = {
    'XOF': 655.957, // 1 EUR = 655.957 FCFA
    'EUR': 1,
    'JPY': 163.50   // 1 EUR = 163.50 JPY
  };

  constructor() {
    // Charger la devise sauvegardée
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      const currency = CURRENCIES.find(c => c.code === savedCurrency);
      if (currency) {
        this.currentCurrencySubject.next(currency);
      }
    }
  }

  getCurrentCurrency(): Currency {
    return this.currentCurrencySubject.value;
  }

  setCurrency(currencyCode: string): void {
    const currency = CURRENCIES.find(c => c.code === currencyCode);
    if (currency) {
      this.currentCurrencySubject.next(currency);
      localStorage.setItem('selectedCurrency', currencyCode);
    }
  }

  formatAmount(amount: number, currencyCode?: string): string {
    const currency = currencyCode 
      ? CURRENCIES.find(c => c.code === currencyCode) || this.getCurrentCurrency()
      : this.getCurrentCurrency();

    const convertedAmount = this.convertAmount(amount, 'EUR', currency.code);

    // Formatage selon la devise
    if (currency.code === 'XOF') {
      return `${this.formatNumber(convertedAmount, 0)} ${currency.symbol}`;
    } else if (currency.code === 'JPY') {
      return `${currency.symbol}${this.formatNumber(convertedAmount, 0)}`;
    } else {
      return `${this.formatNumber(convertedAmount, 2)} ${currency.symbol}`;
    }
  }

  convertAmount(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return amount;

    // Convertir d'abord en EUR (base)
    const amountInEUR = amount / this.exchangeRates[fromCurrency];
    
    // Puis convertir vers la devise cible
    return amountInEUR * this.exchangeRates[toCurrency];
  }

  private formatNumber(value: number, decimals: number): string {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  getExchangeRate(fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return 1;
    const amountInEUR = 1 / this.exchangeRates[fromCurrency];
    return amountInEUR * this.exchangeRates[toCurrency];
  }

  getAllCurrencies(): Currency[] {
    return CURRENCIES;
  }
}
