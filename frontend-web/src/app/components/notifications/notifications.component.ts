import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;
  error = '';

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.notificationService.notifications$.subscribe({
      next: (data: Notification[]) => {
        this.notifications = data;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      'info': 'info',
      'success': 'check',
      'warning': 'alert',
      'error': 'error'
    };
    return icons[type] || 'info';
  }

  getNotificationClass(type: string): string {
    return type.toLowerCase();
  }
}
