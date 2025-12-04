import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Client } from '../../../models/client.model';
import { CurrencySelectorComponent } from '../currency-selector/currency-selector.component';

@Component({
  selector: 'app-navbar-modern',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-card border-b border-border sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <!-- Desktop & Mobile Header -->
        <div class="flex items-center justify-between mb-4 md:mb-0">
          <!-- Logo -->
          <a routerLink="/dashboard" class="flex items-center gap-2 font-bold text-lg">
            <div class="w-8 h-8 bg-primary rounded-lg"></div>
            <span class="text-primary">WillBank</span>
          </a>

          <!-- Mobile Menu Toggle -->
          <button 
            class="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            (click)="toggleMenu()">
            <svg *ngIf="!menuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg *ngIf="menuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-2">
            <a 
              *ngFor="let link of navLinks"
              [routerLink]="link.path"
              routerLinkActive="bg-primary text-primary-foreground"
              [routerLinkActiveOptions]="{exact: false}"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted">
              {{ link.label }}
            </a>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div *ngIf="menuOpen" class="md:hidden space-y-2 mb-4">
          <a 
            *ngFor="let link of navLinks"
            [routerLink]="link.path"
            routerLinkActive="bg-primary text-primary-foreground"
            [routerLinkActiveOptions]="{exact: false}"
            (click)="closeMenu()"
            class="block px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted">
            {{ link.label }}
          </a>
        </div>

        <!-- Desktop User Actions -->
        <div class="hidden md:flex items-center gap-4 justify-end">
          <!-- Notifications -->
          <a routerLink="/notifications" class="p-2 hover:bg-muted rounded-lg transition-colors relative">
            <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span *ngIf="notificationCount > 0" 
              class="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </a>

          <!-- Settings -->
          <a routerLink="/profile" class="p-2 hover:bg-muted rounded-lg transition-colors">
            <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </a>

          <!-- User Info -->
          <div *ngIf="user" class="text-right pr-4 border-r border-border">
            <p class="font-medium text-sm">{{ user.firstName }} {{ user.lastName }}</p>
            <p class="text-xs text-muted-foreground">{{ user.email }}</p>
          </div>

          <!-- Logout -->
          <button 
            (click)="handleLogout()"
            class="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  `
})
export class NavbarModernComponent {
  @Input() user: Client | null = null;
  @Input() notificationCount = 0;
  
  menuOpen = false;

  navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/accounts', label: 'Comptes' },
    { path: '/transactions', label: 'Transactions' },
    { path: '/transfer', label: 'Virements' }
  ];

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  handleLogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
