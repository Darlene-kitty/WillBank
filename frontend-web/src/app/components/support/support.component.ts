import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent {
  activeTab = 'faq';
  loading = false;
  
  contactForm = {
    subject: '',
    message: '',
    priority: 'normal'
  };
  
  faqs = [
    {
      question: 'Comment effectuer un virement ?',
      answer: 'Pour effectuer un virement, rendez-vous dans la section "Virement" du menu principal. Sélectionnez le compte source, saisissez les informations du bénéficiaire et le montant, puis confirmez la transaction.',
      category: 'Virements'
    },
    {
      question: 'Comment consulter mes transactions ?',
      answer: 'Vos transactions sont disponibles dans la section "Transactions" du menu. Vous pouvez filtrer par date, type de transaction ou montant.',
      category: 'Transactions'
    },
    {
      question: 'Comment modifier mes informations personnelles ?',
      answer: 'Rendez-vous dans la section "Paramètres" pour modifier vos informations personnelles, changer votre mot de passe ou gérer vos préférences de notification.',
      category: 'Compte'
    },
    {
      question: 'Que faire si je ne reçois pas de notifications ?',
      answer: 'Vérifiez vos paramètres de notification dans la section "Paramètres". Assurez-vous que votre adresse email est correcte et que les notifications ne sont pas bloquées par votre fournisseur de messagerie.',
      category: 'Notifications'
    },
    {
      question: 'Comment sécuriser mon compte ?',
      answer: 'Utilisez un mot de passe fort, ne partagez jamais vos identifiants, et déconnectez-vous toujours après utilisation. Activez les notifications de transaction pour être alerté de toute activité suspecte.',
      category: 'Sécurité'
    }
  ];
  
  contactInfo = {
    phone: '+212 5 22 XX XX XX',
    email: 'support@willbank.ma',
    hours: 'Lundi - Vendredi: 8h00 - 18h00',
    address: 'Casablanca, Maroc'
  };

  constructor(private notificationService: NotificationService) {}

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  submitContactForm(): void {
    if (!this.contactForm.subject || !this.contactForm.message) {
      this.notificationService.error(
        'Erreur',
        'Veuillez remplir tous les champs obligatoires'
      );
      return;
    }

    this.loading = true;
    
    // Simulation d'envoi
    setTimeout(() => {
      this.loading = false;
      this.contactForm = {
        subject: '',
        message: '',
        priority: 'normal'
      };
      
      this.notificationService.success(
        'Message envoyé',
        'Votre message a été envoyé avec succès. Notre équipe vous répondra dans les plus brefs délais.'
      );
    }, 1500);
  }

  downloadGuide(): void {
    this.notificationService.info(
      'Téléchargement',
      'Le guide utilisateur sera bientôt disponible en téléchargement'
    );
  }
}