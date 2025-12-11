import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account } from '../../../models/account.model';

@Component({
  selector: 'app-account-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card hover:shadow-lg transition-shadow">
      <div class="card-header">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="card-title text-base">
              {{ account.accountType === 'CHECKING' ? 'Compte Courant' : 
                 account.accountType === 'SAVINGS' ? 'Compte Épargne' : 
                 account.accountType === 'BUSINESS' ? 'Compte Professionnel' : account.accountType }}
            </h3>
            <p class="text-sm text-muted-foreground mt-1">{{ account.accountNumber }}</p>
          </div>
          <span 
            class="badge"
            [ngClass]="{
              'active': account.status === 'ACTIVE',
              'suspended': account.status === 'SUSPENDED',
              'closed': account.status === 'CLOSED'
            }">
            {{ account.status === 'ACTIVE' ? 'Actif' : account.status === 'SUSPENDED' ? 'Suspendu' : account.status === 'CLOSED' ? 'Fermé' : account.status }}
          </span>
        </div>
      </div>

      <div class="card-content space-y-4">
        <div>
          <p class="text-sm text-muted-foreground mb-1">Solde</p>
          <p class="text-2xl font-bold">
            {{ account.balance | currency:'EUR':'symbol':'1.2-2':'fr-FR' }}
          </p>
        </div>
        <p class="text-xs text-muted-foreground">
          Créé le {{ account.createdAt | date:'dd/MM/yyyy':'':'fr-FR' }}
        </p>
      </div>
    </div>
  `
})
export class AccountCardComponent {
  @Input() account!: Account;
}
