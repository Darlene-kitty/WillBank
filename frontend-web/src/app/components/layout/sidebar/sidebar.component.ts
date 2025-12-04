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
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
