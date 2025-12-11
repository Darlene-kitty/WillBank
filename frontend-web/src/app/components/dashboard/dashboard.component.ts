import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
// RouterLink retiré car non utilisé dans le template
import { DashboardService } from '../../services/dashboard.service';
import { Dashboard } from '../../models/dashboard.model';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationPanelComponent } from '../shared/notification-panel/notification-panel.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { GoalModalComponent } from '../shared/goal-modal/goal-modal.component';
import { GoalsService, Goal } from '../../services/goals.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Chart, registerables } from 'chart.js';
import localeFr from '@angular/common/locales/fr';

// Enregistrer les composants Chart.js
Chart.register(...registerables);

// Enregistrer la locale française
registerLocaleData(localeFr, 'fr');

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, NotificationPanelComponent, SidebarComponent, GoalModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  
  showNotificationPanel = false;
  showGoalModal = false;
  unreadNotificationCount = 0;
  
  dashboard: Dashboard | null = null;
  loading = true;
  error = '';

  totalIncome = 0;
  totalExpenses = 0;
  monthlyGrowth = 12.5;
  activeAccounts = 0;
  
  // Objectifs dynamiques
  goals: Goal[] = [];
  editingGoal: Goal | null = null;
  
  quickActions = [
    { label: 'Virement', icon: 'transfer', route: '/transfer', primary: true },
    { label: 'Paiement', icon: 'payment', action: 'openPayment' },
    { label: 'Support', icon: 'support', action: 'openSupport' }
  ];

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function(value) {
            return value + 'k';
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  public lineChartType: ChartType = 'line';

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  };

  public doughnutChartType: ChartType = 'doughnut';

  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private goalsService: GoalsService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.loadGoals();
    
    // S'abonner au compteur de notifications non lues
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadNotificationCount = count;
    });

    // Notifications intelligentes
    setTimeout(() => {
      this.checkForSmartNotifications();
    }, 2000);

    // Rafraîchissement automatique toutes les 30 secondes
    setInterval(() => {
      this.refreshDashboard();
    }, 30000);
  }

  loadGoals(): void {
    this.goalsService.getGoals().subscribe(goals => {
      this.goals = goals;
    });
  }

  toggleNotificationPanel(): void {
    this.showNotificationPanel = !this.showNotificationPanel;
  }

  closeNotificationPanel(): void {
    this.showNotificationPanel = false;
  }

  loadDashboard(): void {
    const user = this.authService.getCurrentUserValue();
    if (!user || !user.id) return;

    this.loading = true;
    this.dashboardService.getClientDashboard(user.id).subscribe({
      next: (data) => {
        this.dashboard = data;
        this.calculateStatistics();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  calculateStatistics(): void {
    if (!this.dashboard) return;

    // Utiliser les données déjà calculées par le backend si disponibles
    if (this.dashboard.monthlyIncome !== undefined) {
      this.totalIncome = this.dashboard.monthlyIncome;
    } else {
      this.totalIncome = this.dashboard.recentTransactions
        .filter(t => t.type === 'DEPOSIT')
        .reduce((sum, t) => sum + t.amount, 0);
    }

    if (this.dashboard.monthlyExpenses !== undefined) {
      this.totalExpenses = this.dashboard.monthlyExpenses;
    } else {
      this.totalExpenses = this.dashboard.recentTransactions
        .filter(t => t.type === 'WITHDRAWAL' || t.type === 'TRANSFER')
        .reduce((sum, t) => sum + t.amount, 0);
    }

    // Utiliser le taux de croissance du backend si disponible
    if (this.dashboard.insights?.monthlyGrowthPercentage !== undefined) {
      this.monthlyGrowth = this.dashboard.insights.monthlyGrowthPercentage;
    }

    this.activeAccounts = this.dashboard.accounts.filter(a => a.status === 'ACTIVE').length;
    this.prepareChartData();
  }

  prepareChartData(): void {
    if (!this.dashboard) return;

    // Utiliser l'historique de solde du backend si disponible
    let labels: string[] = [];
    let balanceData: number[] = [];

    if (this.dashboard.balanceHistory && this.dashboard.balanceHistory.length > 0) {
      labels = this.dashboard.balanceHistory.map(h => {
        const date = new Date(h.date);
        return date.toLocaleDateString('fr-FR', { weekday: 'short' });
      });
      balanceData = this.dashboard.balanceHistory.map(h => h.balance / 1000);
    } else {
      labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      balanceData = this.generateBalanceHistory();
    }

    this.lineChartData = {
      labels: labels,
      datasets: [
        {
          data: balanceData,
          label: 'Solde',
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#2563eb',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };

    // Utiliser les transactions par type du backend si disponibles
    let transactionTypes: { [key: string]: number } = {};
    
    if (this.dashboard.transactionsByType) {
      transactionTypes = this.dashboard.transactionsByType;
    } else {
      transactionTypes = this.dashboard.recentTransactions.reduce((acc: any, t) => {
        acc[t.type] = (acc[t.type] || 0) + t.amount;
        return acc;
      }, {});
    }

    this.doughnutChartData = {
      labels: Object.keys(transactionTypes).map(t => this.getTransactionTypeLabel(t)),
      datasets: [{
        data: Object.values(transactionTypes),
        backgroundColor: [
          '#f59e0b',
          '#8b5cf6',
          '#ef4444',
          '#3b82f6'
        ],
        borderWidth: 0,
        hoverOffset: 10
      }]
    };
  }

  generateBalanceHistory(): number[] {
    if (!this.dashboard) return [];
    
    const currentBalance = this.dashboard.totalBalance;
    const history: number[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const variation = (Math.random() - 0.5) * (currentBalance * 0.05);
      history.push((currentBalance - variation * i) / 1000);
    }
    
    return history;
  }

  getAccountTypeLabel(type: string): string {
    return type === 'SAVINGS' ? 'Compte Épargne' : 'Compte Courant';
  }

  getTransactionTypeLabel(type: string): string {
    const labels: any = {
      'DEPOSIT': 'Dépôts',
      'WITHDRAWAL': 'Retraits',
      'TRANSFER': 'Virements'
    };
    return labels[type] || type;
  }

  getTransactionClass(type: string): string {
    return type === 'DEPOSIT' ? 'deposit' : type === 'WITHDRAWAL' ? 'withdrawal' : 'transfer';
  }

  getTransactionLabel(type: string): string {
    const labels: any = {
      'DEPOSIT': 'Salaire Novembre',
      'WITHDRAWAL': 'Retrait ATM',
      'TRANSFER': 'Supermarché Carrefour'
    };
    return labels[type] || type;
  }

  getSavingsRate(): number {
    if (this.totalIncome === 0) return 0;
    return Math.round(((this.totalIncome - this.totalExpenses) / this.totalIncome) * 100);
  }

  getDistributionData(): any[] {
    const colors = ['#f59e0b', '#8b5cf6', '#ef4444', '#3b82f6'];
    const types = ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'];
    
    return types.map((type, index) => {
      const transactions = this.dashboard?.recentTransactions.filter(t => t.type === type) || [];
      const total = transactions.reduce((sum, t) => sum + t.amount, 0);
      
      return {
        label: this.getTransactionTypeLabel(type),
        value: total,
        color: colors[index]
      };
    }).filter(item => item.value > 0);
  }

  // Nouvelles méthodes pour les améliorations
  getGoalProgress(goal: any): number {
    return Math.round((goal.current / goal.target) * 100);
  }

  getGoalRemaining(goal: any): number {
    return goal.target - goal.current;
  }

  refreshDashboard(): void {
    this.loadDashboard();
  }

  openPayment(): void {
    // Logique pour ouvrir le module de paiement
    console.log('Ouverture du module de paiement');
  }

  openSupport(): void {
    // Logique pour ouvrir le support client
    console.log('Ouverture du support client');
  }

  addGoal(): void {
    this.editingGoal = null;
    this.showGoalModal = true;
  }

  editGoal(goal: Goal): void {
    this.editingGoal = goal;
    this.showGoalModal = true;
  }

  closeGoalModal(): void {
    this.showGoalModal = false;
    this.editingGoal = null;
  }

  onGoalSaved(goal: Goal): void {
    this.loadGoals();
    this.notificationService.success(
      'Objectif sauvegardé',
      `L'objectif "${goal.name}" a été sauvegardé avec succès`
    );
  }

  deleteGoal(goal: Goal): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'objectif "${goal.name}" ?`)) {
      this.goalsService.deleteGoal(goal.id).subscribe(() => {
        this.loadGoals();
        this.notificationService.info(
          'Objectif supprimé',
          `L'objectif "${goal.name}" a été supprimé`
        );
      });
    }
  }

  private checkForSmartNotifications(): void {
    if (!this.dashboard) return;

    // Notification de bienvenue
    this.notificationService.info(
      'Bienvenue sur WillBank',
      'Votre tableau de bord est prêt. Consultez vos comptes et transactions.'
    );

    // Vérifier les soldes faibles
    const lowBalanceAccounts = this.dashboard.accounts.filter(account => 
      account.balance !== undefined && account.balance < 1000 && account.status === 'ACTIVE'
    );
    
    if (lowBalanceAccounts.length > 0) {
      this.notificationService.warning(
        'Solde faible détecté',
        `${lowBalanceAccounts.length} compte(s) ont un solde inférieur à 1,000 MAD`
      );
    }

    // Vérifier les objectifs proches d'être atteints
    const nearGoals = this.goals.filter(goal => {
      const progress = (goal.current / goal.target) * 100;
      return progress >= 80 && progress < 100;
    });

    if (nearGoals.length > 0) {
      this.notificationService.success(
        'Objectif presque atteint !',
        `Vous êtes proche d'atteindre votre objectif "${nearGoals[0].name}"`
      );
    }

    // Suggestion d'épargne basée sur les revenus
    if (this.totalIncome > this.totalExpenses) {
      const surplus = this.totalIncome - this.totalExpenses;
      if (surplus > 500) {
        setTimeout(() => {
          this.notificationService.info(
            'Opportunité d\'épargne',
            `Vous avez un surplus de ${surplus.toFixed(2)} MAD ce mois. Pensez à l'épargner !`
          );
        }, 5000);
      }
    }
  }
}
