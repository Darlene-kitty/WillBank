# Services WillBank - Application Web (Angular)

Cette documentation décrit les services implémentés pour l'application web WillBank (Angular 20).

## 📁 Structure des Services

```
frontend-web/src/app/
├── services/
│   ├── api.service.ts          # Service de base pour les appels HTTP
│   ├── auth.service.ts         # Service d'authentification JWT
│   ├── client.service.ts       # Service de gestion des clients
│   ├── account.service.ts      # Service de gestion des comptes
│   ├── transaction.service.ts  # Service de gestion des transactions
│   └── ...
├── models/
│   ├── client.model.ts         # Interfaces et types pour les clients
│   ├── account.model.ts        # Interfaces et types pour les comptes
│   └── ...
├── interceptors/
│   ├── auth.interceptor.ts     # Intercepteur JWT avec refresh automatique
│   └── error.interceptor.ts    # Intercepteur de gestion des erreurs
└── guards/
    └── auth.guard.ts           # Guard pour protéger les routes
```

## 🚀 Configuration

### Variables d'Environnement

Modifiez `src/environments/environment.ts` :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080' // URL de l'API Gateway
};
```

Pour la production (`environment.prod.ts`) :

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.willbank.ma' // URL de production
};
```

## 📝 Utilisation des Services

### 1. Service d'Authentification

```typescript
import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LoginRequest, RegisterRequest } from './models/client.model';

@Component({...})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  // Connexion
  login() {
    const credentials: LoginRequest = {
      email: 'user@example.com',
      password: 'Password123!'
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Connecté:', response.client);
        // Navigation vers le dashboard
      },
      error: (error) => {
        console.error('Erreur de connexion:', error.message);
      }
    });
  }

  // Inscription
  register() {
    const data: RegisterRequest = {
      firstName: 'Ahmed',
      lastName: 'Alami',
      email: 'ahmed@example.com',
      password: 'Password123!',
      phone: '+212612345678',
      address: '123 Rue Mohammed V, Casablanca',
      cin: 'AB123456'
    };

    this.authService.register(data).subscribe({
      next: (response) => console.log('Inscrit:', response),
      error: (error) => console.error('Erreur:', error.message)
    });
  }

  // Récupérer l'utilisateur courant
  getCurrentUser() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => console.log('User:', user),
      error: (error) => console.error('Erreur:', error)
    });
  }

  // Observer les changements d'utilisateur
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        console.log('Utilisateur connecté:', user);
      }
    });
  }

  // Changer le mot de passe
  changePassword() {
    this.authService.changePassword({
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword123!'
    }).subscribe({
      next: () => console.log('Mot de passe changé'),
      error: (error) => console.error('Erreur:', error)
    });
  }

  // Déconnexion
  logout() {
    this.authService.logout();
    // Navigation vers la page de connexion
  }

  // Vérifier l'authentification
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
```

### 2. Service Client

```typescript
import { Component, OnInit } from '@angular/core';
import { ClientService } from './services/client.service';
import { Client } from './models/client.model';

@Component({...})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.loadClients();
  }

  // Récupérer tous les clients
  loadClients() {
    this.clientService.getAllClients().subscribe({
      next: (clients) => this.clients = clients,
      error: (error) => console.error('Erreur:', error)
    });
  }

  // Récupérer un client par ID
  getClient(id: number) {
    this.clientService.getClientById(id).subscribe({
      next: (client) => console.log('Client:', client),
      error: (error) => console.error('Erreur:', error)
    });
  }

  // Créer un client
  createClient() {
    const newClient: Client = {
      firstName: 'Fatima',
      lastName: 'Benali',
      email: 'fatima@example.com',
      phone: '+212698765432',
      address: '45 Avenue Hassan II, Rabat',
      cin: 'CD789012'
    };

    this.clientService.createClient(newClient).subscribe({
      next: (client) => {
        console.log('Client créé:', client);
        this.loadClients(); // Recharge la liste
      },
      error: (error) => console.error('Erreur:', error)
    });
  }

  // Mettre à jour un client
  updateClient(id: number, client: Client) {
    this.clientService.updateClient(id, client).subscribe({
      next: (updated) => {
        console.log('Client mis à jour:', updated);
        this.loadClients();
      },
      error: (error) => console.error('Erreur:', error)
    });
  }

  // Supprimer un client
  deleteClient(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          console.log('Client supprimé');
          this.loadClients();
        },
        error: (error) => console.error('Erreur:', error)
      });
    }
  }
}
```

### 3. Service Compte

```typescript
import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { Account, AccountType } from './models/account.model';

@Component({...})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.loadAccounts();
  }

  // Récupérer tous les comptes
  loadAccounts() {
    this.accountService.getAllAccounts().subscribe({
      next: (accounts) => this.accounts = accounts,
      error: (error) => console.error('Erreur:', error)
    });
  }

  // Récupérer les comptes d'un client
  loadClientAccounts(clientId: number) {
    this.accountService.getAccountsByClientId(clientId).subscribe({
      next: (accounts) => this.accounts = accounts,
      error: (error) => console.error('Erreur:', error)
    });
  }

  // Récupérer le solde
  getBalance(accountId: number) {
    this.accountService.getAccountBalance(accountId).subscribe({
      next: (balance) => console.log('Solde:', balance),
      error: (error) => console.error('Erreur:', error)
    });
  }

  // Créer un compte
  createAccount(clientId: number) {
    this.accountService.createAccount({
      clientId,
      accountType: AccountType.SAVINGS
    }).subscribe({
      next: (account) => {
        console.log('Compte créé:', account);
        this.loadAccounts();
      },
      error: (error) => console.error('Erreur:', error)
    });
  }

  // Créditer un compte
  creditAccount(accountId: number, amount: number) {
    this.accountService.creditAccount(accountId, amount).subscribe({
      next: () => {
        console.log('Compte crédité');
        this.loadAccounts();
      },
      error: (error) => console.error('Erreur:', error)
    });
  }

  // Débiter un compte
  debitAccount(accountId: number, amount: number) {
    this.accountService.debitAccount(accountId, amount).subscribe({
      next: () => {
        console.log('Compte débité');
        this.loadAccounts();
      },
      error: (error) => console.error('Erreur:', error)
    });
  }
}
```

## 🔐 Intercepteur JWT

L'intercepteur JWT est configuré automatiquement dans `app.config.ts` :

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    // ...autres providers
  ]
};
```

L'intercepteur gère automatiquement :
- ✅ Ajout du token JWT à chaque requête
- ✅ Refresh automatique du token si expiré (401)
- ✅ Déconnexion automatique si le refresh échoue
- ✅ Exclusion des endpoints publics (login, register)

## 🛡️ Guard d'Authentification

Protégez vos routes avec le guard :

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard] // Route protégée
  },
  {
    path: 'clients',
    component: ClientListComponent,
    canActivate: [authGuard] // Route protégée
  }
];
```

## 🔄 Gestion des Erreurs

Les erreurs sont gérées automatiquement par les services :

```typescript
this.clientService.getClientById(999).subscribe({
  next: (client) => console.log(client),
  error: (error: Error) => {
    // error.message contient un message lisible
    console.error(error.message);
    // Afficher dans l'UI
    this.showError(error.message);
  }
});
```

Messages d'erreur typiques :
- "Impossible de contacter le serveur. Vérifiez votre connexion."
- "Vous n'avez pas les permissions nécessaires."
- "Ressource non trouvée."
- Messages personnalisés du backend

## 🎨 Exemple d'Intégration dans un Template

```html
<!-- login.component.html -->
<form (ngSubmit)="login()" #loginForm="ngForm">
  <input 
    type="email" 
    name="email" 
    [(ngModel)]="credentials.email" 
    required
  >
  <input 
    type="password" 
    name="password" 
    [(ngModel)]="credentials.password" 
    required
  >
  <button type="submit" [disabled]="!loginForm.valid || loading">
    {{ loading ? 'Connexion...' : 'Se connecter' }}
  </button>
</form>

<!-- Afficher l'utilisateur connecté -->
<div *ngIf="authService.currentUser$ | async as user">
  Bonjour {{ user.firstName }} {{ user.lastName }}
</div>
```

## 🧪 Tests

Pour tester l'application :

1. Démarrez le backend :
```bash
cd willbank
./start-all.bat  # ou start-all.sh sur Linux/Mac
```

2. Démarrez l'application Angular :
```bash
cd frontend-web
npm start
```

3. Accédez à `http://localhost:4200`

## 📱 Build pour Production

```bash
ng build --configuration production
```

Les fichiers de build seront dans `dist/frontend-web/`.

## 🔗 Endpoints API Utilisés

Via l'API Gateway (`http://localhost:8080`) :

- **Auth** : `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`, `/api/auth/me`
- **Clients** : `/api/clients/*`
- **Comptes** : `/api/accounts/*`
- **Transactions** : `/api/transactions/*`
- **Dashboard** : `/api/dashboard/*`

## 📚 Documentation Complémentaire

- [APIs REST Documentation](../../doc/03-design/apis-rest-updated.md)
- [Client Service README](../../client-service/README.md)
- [Authentication README](../../client-service/AUTHENTICATION_README.md)
- [Angular Documentation](https://angular.io/docs)
