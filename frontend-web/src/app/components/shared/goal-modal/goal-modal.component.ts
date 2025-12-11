import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Goal, GoalsService } from '../../../services/goals.service';

@Component({
  selector: 'app-goal-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()" *ngIf="isOpen">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ editMode ? 'Modifier l\'objectif' : 'Nouvel objectif' }}</h3>
          <button class="close-btn" (click)="onClose()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <form (ngSubmit)="onSubmit()" class="goal-form">
          <div class="form-group">
            <label for="name">Nom de l'objectif</label>
            <input 
              type="text" 
              id="name" 
              [(ngModel)]="goalData.name" 
              name="name"
              placeholder="Ex: Vacances d'été"
              required>
          </div>
          
          <div class="form-group">
            <label for="target">Montant cible (MAD)</label>
            <input 
              type="number" 
              id="target" 
              [(ngModel)]="goalData.target" 
              name="target"
              placeholder="15000"
              min="1"
              required>
          </div>
          
          <div class="form-group">
            <label for="current">Montant actuel (MAD)</label>
            <input 
              type="number" 
              id="current" 
              [(ngModel)]="goalData.current" 
              name="current"
              placeholder="0"
              min="0"
              [max]="goalData.target || 0">
          </div>
          
          <div class="form-group">
            <label for="category">Catégorie</label>
            <select id="category" [(ngModel)]="goalData.category" name="category" required>
              <option value="vacation">Vacances</option>
              <option value="emergency">Fonds d'urgence</option>
              <option value="investment">Investissement</option>
              <option value="purchase">Achat</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="deadline">Date limite</label>
            <input 
              type="date" 
              id="deadline" 
              [(ngModel)]="deadlineString" 
              name="deadline"
              required>
          </div>
          
          <div class="form-group">
            <label for="description">Description (optionnel)</label>
            <textarea 
              id="description" 
              [(ngModel)]="goalData.description" 
              name="description"
              placeholder="Décrivez votre objectif..."
              rows="3">
            </textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="onClose()">
              Annuler
            </button>
            <button type="submit" class="btn-primary" [disabled]="!isFormValid()">
              {{ editMode ? 'Modifier' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./goal-modal.component.scss']
})
export class GoalModalComponent {
  @Input() isOpen = false;
  @Input() editMode = false;
  @Input() goal: Goal | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() goalSaved = new EventEmitter<Goal>();

  goalData: Partial<Goal> = {
    name: '',
    target: 0,
    current: 0,
    category: 'vacation',
    description: '',
    isActive: true
  };

  deadlineString = '';

  constructor(private goalsService: GoalsService) {}

  ngOnChanges(): void {
    if (this.goal && this.editMode) {
      this.goalData = { ...this.goal };
      this.deadlineString = new Date(this.goal.deadline).toISOString().split('T')[0];
    } else {
      this.resetForm();
    }
  }

  onClose(): void {
    this.close.emit();
    this.resetForm();
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    const goalToSave: Omit<Goal, 'id'> = {
      ...this.goalData as Goal,
      deadline: new Date(this.deadlineString)
    };

    if (this.editMode && this.goal) {
      this.goalsService.updateGoal(this.goal.id, goalToSave).subscribe({
        next: (updatedGoal) => {
          this.goalSaved.emit(updatedGoal);
          this.onClose();
        }
      });
    } else {
      this.goalsService.addGoal(goalToSave).subscribe({
        next: (newGoal) => {
          this.goalSaved.emit(newGoal);
          this.onClose();
        }
      });
    }
  }

  isFormValid(): boolean {
    return !!(
      this.goalData.name &&
      this.goalData.target &&
      this.goalData.target > 0 &&
      this.goalData.current !== undefined &&
      this.goalData.current >= 0 &&
      this.goalData.category &&
      this.deadlineString
    );
  }

  private resetForm(): void {
    this.goalData = {
      name: '',
      target: 0,
      current: 0,
      category: 'vacation',
      description: '',
      isActive: true
    };
    this.deadlineString = '';
  }
}