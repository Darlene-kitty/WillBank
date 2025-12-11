import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Client, ClientRole } from '../../models/client.model';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';

interface UserProfile extends Client {
  birthDate?: string;
  memberSince?: string;
  accountStatus?: string;
}

interface KYCStatus {
  identityVerified: boolean;
  addressVerified: boolean;
  accountLevel: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: UserProfile | null = null;
  editMode = false;
  loading = false;
  successMessage = '';
  errorMessage = '';
  securityNotifications = true;
  passwordLastChanged = 'il y a 3 mois';

  kycStatus: KYCStatus = {
    identityVerified: true,
    addressVerified: true,
    accountLevel: 2
  };

  editedUser: UserProfile = {
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    cin: '',
    phone: '',
    address: '',
    role: ClientRole.CLIENT,
    birthDate: ''
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUserValue();
    if (currentUser) {
      this.user = {
        ...currentUser,
        phone: currentUser.phone || '+33 6 12 34 56 78',
        address: currentUser.address || '123 Rue de la République, 75001 Paris',
        birthDate: '15/05/1990',
        memberSince: 'janvier 2020',
        accountStatus: 'Compte Validé'
      };
      this.editedUser = { ...this.user };
    }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode && this.user) {
      this.editedUser = { ...this.user };
    }
  }

  saveProfile(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    setTimeout(() => {
      this.user = { ...this.editedUser };
      const userToStore = {
        id: this.user.id,
        email: this.user.email,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        role: this.user.role
      };
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      this.successMessage = 'Profil mis à jour avec succès';
      this.editMode = false;
      this.loading = false;

      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }, 1000);
  }

  toggleSecurityNotifications(): void {
    this.securityNotifications = !this.securityNotifications;
  }

  changePassword(): void {
    alert('Fonctionnalité de changement de mot de passe à implémenter');
  }

  enable2FA(): void {
    alert('Fonctionnalité d\'authentification à deux facteurs à implémenter');
  }
}
