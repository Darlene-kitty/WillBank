import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  currentUser: any = null;

  menuItems = [
    {
      label: 'Tableau de bord',
      icon: 'dashboard',
      route: '/dashboard',
      active: true
    },
    {
      label: 'Comptes',
      icon: 'accounts',
      route: '/accounts',
      active: false
    },
    {
      label: 'Transactions',
      icon: 'transactions',
      route: '/transactions',
      active: false
    },
    {
      label: 'Clients',
      icon: 'clients',
      route: '/clients',
      active: false
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // S'abonner aux changements d'utilisateur
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'AA';
    const firstName = this.currentUser.firstName || '';
    const lastName = this.currentUser.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  getUserName(): string {
    if (!this.currentUser) return 'Ahmed Alami';
    return `${this.currentUser.firstName || ''} ${this.currentUser.lastName || ''}`.trim();
  }

  getUserEmail(): string {
    if (!this.currentUser) return 'ahmed@willbank.ma';
    return this.currentUser.email || '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
