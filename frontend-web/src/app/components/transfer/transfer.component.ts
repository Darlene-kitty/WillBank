import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';
import { Account } from '../../models/account.model';
import { TransactionRequest } from '../../models/transaction.model';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  accounts: Account[] = [];
  loading = false;
  error = '';
  successMessage = '';
  
  // Stepper
  currentStep = 1;
  
  // Type de virement
  transferType: 'INTERNAL' | 'EXTERNAL' = 'INTERNAL';
  
  transfer: TransactionRequest = {
    type: 'TRANSFER',
    sourceAccountId: 0,
    destinationAccountId: 0,
    amount: 0,
    description: ''
  };

  // Pour virement externe
  externalIban = '';

  // Détails du virement effectué
  transferReference = '';
  transferDate = '';

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
      },
      error: (err) => {
        this.error = err.message;
      }
    });
  }

  getAvailableDestinationAccounts(): Account[] {
    return this.accounts.filter(a => a.id !== this.transfer.sourceAccountId);
  }

  selectTransferType(type: 'INTERNAL' | 'EXTERNAL'): void {
    this.transferType = type;
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.validateStep1()) {
      this.currentStep = 2;
      this.error = '';
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.error = '';
    }
  }

  validateStep1(): boolean {
    if (!this.transfer.sourceAccountId) {
      this.error = 'Veuillez sélectionner un compte source';
      return false;
    }

    if (this.transferType === 'INTERNAL' && !this.transfer.destinationAccountId) {
      this.error = 'Veuillez sélectionner un compte destination';
      return false;
    }

    if (this.transferType === 'EXTERNAL' && !this.externalIban) {
      this.error = 'Veuillez saisir un IBAN';
      return false;
    }

    if (!this.transfer.amount || this.transfer.amount <= 0) {
      this.error = 'Veuillez saisir un montant valide';
      return false;
    }

    const sourceAccount = this.accounts.find(a => a.id === this.transfer.sourceAccountId);
    if (sourceAccount && sourceAccount.balance !== undefined && this.transfer.amount > sourceAccount.balance) {
      this.error = 'Solde insuffisant';
      return false;
    }

    return true;
  }

  confirmTransfer(): void {
    this.loading = true;
    this.error = '';

    // Préparer la requête selon le type de virement
    const transactionRequest: TransactionRequest = {
      ...this.transfer
    };

    if (this.transferType === 'EXTERNAL') {
      transactionRequest.destinationIban = this.externalIban;
      transactionRequest.destinationAccountId = undefined;
    }

    this.transactionService.createTransaction(transactionRequest).subscribe({
      next: (response: any) => {
        // Générer une référence unique
        this.transferReference = this.generateTransferReference();
        this.transferDate = new Date().toLocaleDateString('fr-FR');
        this.currentStep = 3;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  generateTransferReference(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 99999) + 10000;
    return `VIR-${year}-${random}`;
  }

  getAccountLabel(account: Account): string {
    return `${account.accountNumber} - ${(account.balance || 0).toFixed(2)} MAD`;
  }

  getSourceAccount(): Account | undefined {
    return this.accounts.find(a => a.id === this.transfer.sourceAccountId);
  }

  getDestinationAccount(): Account | undefined {
    return this.accounts.find(a => a.id === this.transfer.destinationAccountId);
  }

  getDestinationDisplay(): string {
    if (this.transferType === 'INTERNAL') {
      const account = this.getDestinationAccount();
      return account?.accountNumber || '';
    }
    return this.externalIban;
  }

  goToTransactions(): void {
    this.router.navigate(['/transactions']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  newTransfer(): void {
    this.currentStep = 1;
    this.transfer = {
      type: 'TRANSFER',
      sourceAccountId: 0,
      destinationAccountId: 0,
      amount: 0,
      description: ''
    };
    this.externalIban = '';
    this.transferType = 'INTERNAL';
    this.transferReference = '';
    this.transferDate = '';
  }
}
