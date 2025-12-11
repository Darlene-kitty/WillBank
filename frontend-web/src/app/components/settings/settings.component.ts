import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  currentUser: any = null;
  loading = false;
  
  // Paramètres de profil
  profileSettings = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  };
  
  // Paramètres de sécurité
  securitySettings = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  // Paramètres de notification
  notificationSettings = {
    emailNotifications: true,
    smsNotifications: false,
    transactionAlerts: true,
    marketingEmails: false
  };

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.currentUser = this.authService.getCurrentUserValue();
    if (this.currentUser) {
      this.profileSettings = {
        firstName: this.currentUser.firstName || '',
        lastName: this.currentUser.lastName || '',
        email: this.currentUser.email || '',
        phone: this.currentUser.phone || '',
        address: this.currentUser.address || ''
      };
    }
  }

  updateProfile(): void {
    this.loading = true;
    // Simulation de mise à jour
    setTimeout(() => {
      this.loading = false;
      this.notificationService.success(
        'Profil mis à jour',
        'Vos informations ont été mises à jour avec succès'
      );
    }, 1000);
  }

  changePassword(): void {
    if (this.securitySettings.newPassword !== this.securitySettings.confirmPassword) {
      this.notificationService.error(
        'Erreur',
        'Les mots de passe ne correspondent pas'
      );
      return;
    }

    this.loading = true;
    // Simulation de changement de mot de passe
    setTimeout(() => {
      this.loading = false;
      this.securitySettings = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      this.notificationService.success(
        'Mot de passe modifié',
        'Votre mot de passe a été modifié avec succès'
      );
    }, 1000);
  }

  updateNotificationSettings(): void {
    this.notificationService.success(
      'Paramètres sauvegardés',
      'Vos préférences de notification ont été mises à jour'
    );
  }
}