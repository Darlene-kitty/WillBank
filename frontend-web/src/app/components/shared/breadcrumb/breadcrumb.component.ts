import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="breadcrumb">
      <a routerLink="/" class="breadcrumb-item home">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke-width="2"/>
          <polyline points="9 22 9 12 15 12 15 22" stroke-width="2"/>
        </svg>
      </a>
      @for (crumb of breadcrumbs; track crumb.url; let last = $last) {
        <svg class="breadcrumb-separator" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="9 18 15 12 9 6" stroke-width="2"/>
        </svg>
        @if (last) {
          <span class="breadcrumb-item active">{{ crumb.label }}</span>
        } @else {
          <a [routerLink]="crumb.url" class="breadcrumb-item">{{ crumb.label }}</a>
        }
      }
    </nav>
  `,
  styles: [`
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 0;
      font-size: 0.875rem;
    }

    .breadcrumb-item {
      display: flex;
      align-items: center;
      color: #64748b;
      text-decoration: none;
      transition: color 0.2s;
      font-weight: 500;

      &:hover:not(.active) {
        color: #2563eb;
      }

      &.active {
        color: #1e293b;
        font-weight: 600;
      }

      &.home {
        svg {
          stroke-width: 2;
        }
      }
    }

    .breadcrumb-separator {
      color: #cbd5e1;
      flex-shrink: 0;
    }
  `]
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  private routeLabels: { [key: string]: string } = {
    'dashboard': 'Tableau de bord',
    'accounts': 'Comptes',
    'transactions': 'Transactions',
    'transfer': 'Virement',
    'clients': 'Clients',
    'profile': 'Profil',
    'notifications': 'Notifications'
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs();
      });

    this.breadcrumbs = this.createBreadcrumbs();
  }

  private createBreadcrumbs(): Breadcrumb[] {
    const url = this.router.url;
    const segments = url.split('/').filter(segment => segment);
    
    const breadcrumbs: Breadcrumb[] = [];
    let currentPath = '';

    segments.forEach(segment => {
      currentPath += `/${segment}`;
      const label = this.routeLabels[segment] || segment;
      breadcrumbs.push({ label, url: currentPath });
    });

    return breadcrumbs;
  }
}
