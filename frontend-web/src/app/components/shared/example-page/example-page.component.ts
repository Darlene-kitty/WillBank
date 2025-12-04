import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { AccountCardComponent } from '../account-card/account-card.component';
import { NavbarModernComponent } from '../navbar-modern/navbar-modern.component';
import { Account } from '../../../models/account.model';
import { Client } from '../../../models/client.model';

/**
 * Composant d'exemple pour démontrer le nouveau design system
 * Inspiré de willbank-example avec Tailwind CSS
 */
@Component({
  selector: 'app-example-page',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonComponent, 
    AccountCardComponent, 
    NavbarModernComponent
  ],
  template: `
    <div class="min-h-screen bg-background">
      <!-- Navigation -->
      <app-navbar-modern [user]="currentUser" [notificationCount]="3"></app-navbar-modern>

      <!-- Hero Section -->
      <section class="border-b bg-gradient-to-r from-primary/5 to-accent/5">
        <div class="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div class="text-center space-y-4">
            <h1 class="text-4xl md:text-5xl font-bold text-balance">
              Bienvenue sur WillBank
            </h1>
            <p class="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Gérez vos finances en toute simplicité avec notre plateforme bancaire moderne
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <app-button variant="primary" size="lg">
                Nouvelle Transaction
              </app-button>
              <app-button variant="outline" size="lg">
                Voir l'historique
              </app-button>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="card hover:shadow-lg transition-shadow">
            <div class="card-content pt-6">
              <p class="text-sm text-muted-foreground">Solde Total</p>
              <p class="text-3xl font-bold mt-2">15 450,00 €</p>
              <p class="text-sm text-secondary mt-1">+2.5% ce mois</p>
            </div>
          </div>

          <div class="card hover:shadow-lg transition-shadow">
            <div class="card-content pt-6">
              <p class="text-sm text-muted-foreground">Transactions</p>
              <p class="text-3xl font-bold mt-2">127</p>
              <p class="text-sm text-muted-foreground mt-1">Ce mois-ci</p>
            </div>
          </div>

          <div class="card hover:shadow-lg transition-shadow">
            <div class="card-content pt-6">
              <p class="text-sm text-muted-foreground">Économies</p>
              <p class="text-3xl font-bold mt-2">3 200,00 €</p>
              <p class="text-sm text-secondary mt-1">+12% ce mois</p>
            </div>
          </div>
        </div>

        <!-- Accounts Section -->
        <div class="space-y-6 mb-8">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-semibold">Mes Comptes</h2>
            <app-button variant="outline" size="sm">
              Ajouter un compte
            </app-button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <app-account-card 
              *ngFor="let account of accounts" 
              [account]="account">
            </app-account-card>
          </div>
        </div>

        <!-- Components Showcase -->
        <div class="space-y-8">
          <h2 class="text-2xl font-semibold">Composants du Design System</h2>

          <!-- Buttons -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Boutons</h3>
              <p class="card-description">Différentes variantes et tailles</p>
            </div>
            <div class="card-content space-y-4">
              <div class="flex flex-wrap gap-3">
                <app-button variant="primary">Primary</app-button>
                <app-button variant="secondary">Secondary</app-button>
                <app-button variant="outline">Outline</app-button>
                <app-button variant="ghost">Ghost</app-button>
                <app-button variant="danger">Danger</app-button>
              </div>
              <div class="flex flex-wrap gap-3">
                <app-button variant="primary" size="sm">Small</app-button>
                <app-button variant="primary">Default</app-button>
                <app-button variant="primary" size="lg">Large</app-button>
              </div>
            </div>
          </div>

          <!-- Badges -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Badges</h3>
              <p class="card-description">Indicateurs de statut</p>
            </div>
            <div class="card-content">
              <div class="flex flex-wrap gap-3">
                <span class="badge badge-primary">Primary</span>
                <span class="badge badge-secondary">Success</span>
                <span class="badge badge-danger">Danger</span>
                <span class="badge badge-warning">Warning</span>
                <span class="badge badge-muted">Muted</span>
                <span class="badge active">Actif</span>
                <span class="badge inactive">Inactif</span>
                <span class="badge blocked">Bloqué</span>
              </div>
            </div>
          </div>

          <!-- Alerts -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Alertes</h3>
              <p class="card-description">Messages de notification</p>
            </div>
            <div class="card-content space-y-3">
              <div class="alert alert-info">
                <span>ℹ️</span>
                <span>Information importante pour l'utilisateur</span>
              </div>
              <div class="alert alert-success">
                <span>✓</span>
                <span>Opération effectuée avec succès</span>
              </div>
              <div class="alert alert-warning">
                <span>⚡</span>
                <span>Attention requise sur cette action</span>
              </div>
              <div class="alert alert-error">
                <span>⚠️</span>
                <span>Une erreur s'est produite</span>
              </div>
            </div>
          </div>

          <!-- Form Example -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Formulaire</h3>
              <p class="card-description">Exemple de formulaire avec le nouveau design</p>
            </div>
            <div class="card-content">
              <form class="space-y-6">
                <div class="form-group">
                  <label>Montant</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    placeholder="0.00"
                    value="100.00">
                  <p class="form-description">Montant de la transaction en euros</p>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Date</label>
                    <input type="date" class="form-control">
                  </div>
                  <div class="form-group">
                    <label>Catégorie</label>
                    <select class="form-control">
                      <option>Alimentation</option>
                      <option>Transport</option>
                      <option>Loisirs</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label>Description</label>
                  <textarea 
                    class="form-control" 
                    placeholder="Description de la transaction..."></textarea>
                </div>

                <div class="flex justify-end gap-3">
                  <app-button variant="outline" type="button">Annuler</app-button>
                  <app-button variant="primary" type="submit">Confirmer</app-button>
                </div>
              </form>
            </div>
          </div>

          <!-- Table Example -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Transactions Récentes</h3>
              <p class="card-description">Historique des dernières opérations</p>
            </div>
            <div class="card-content">
              <div class="table-container">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Montant</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>04/12/2024</td>
                      <td>Achat supermarché</td>
                      <td class="font-semibold text-destructive">-45,50 €</td>
                      <td><span class="badge active">Validé</span></td>
                    </tr>
                    <tr>
                      <td>03/12/2024</td>
                      <td>Salaire</td>
                      <td class="font-semibold text-secondary">+2 500,00 €</td>
                      <td><span class="badge active">Validé</span></td>
                    </tr>
                    <tr>
                      <td>02/12/2024</td>
                      <td>Loyer</td>
                      <td class="font-semibold text-destructive">-850,00 €</td>
                      <td><span class="badge active">Validé</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="border-t bg-muted/40 mt-16 py-8">
        <div class="max-w-7xl mx-auto px-4 md:px-6 text-center text-muted-foreground text-sm">
          <p>&copy; 2024 WillBank. Tous les droits réservés.</p>
          <p class="mt-2">Design inspiré de willbank-example avec Tailwind CSS</p>
        </div>
      </footer>
    </div>
  `
})
export class ExamplePageComponent {
  currentUser: Client = {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '0612345678',
    address: '123 Rue de la Paix',
    cin: 'AB123456',
    createdAt: new Date('2024-01-01')
  };

  accounts: Account[] = [
    {
      id: 1,
      accountNumber: 'FR76 1234 5678 9012 3456 7890 123',
      accountType: 'CHECKING',
      balance: 12250.50,
      clientId: 1,
      status: 'ACTIVE',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 2,
      accountNumber: 'FR76 9876 5432 1098 7654 3210 987',
      accountType: 'SAVINGS',
      balance: 3200.00,
      clientId: 1,
      status: 'ACTIVE',
      createdAt: new Date('2024-02-20')
    }
  ];
}
