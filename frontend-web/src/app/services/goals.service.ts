import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  category: 'vacation' | 'emergency' | 'investment' | 'purchase';
  deadline: Date;
  description?: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  private apiUrl = `${environment.apiUrl}/goals`;
  private goalsSubject = new BehaviorSubject<Goal[]>([]);
  public goals$ = this.goalsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialGoals();
  }

  private loadInitialGoals(): void {
    // Données initiales pour la démo
    const initialGoals: Goal[] = [
      {
        id: 1,
        name: 'Vacances d\'été',
        target: 15000,
        current: 10200,
        category: 'vacation',
        deadline: new Date('2024-06-01'),
        description: 'Voyage en famille en Europe',
        isActive: true
      },
      {
        id: 2,
        name: 'Fonds d\'urgence',
        target: 50000,
        current: 17000,
        category: 'emergency',
        deadline: new Date('2024-12-31'),
        description: 'Équivalent à 6 mois de salaire',
        isActive: true
      },
      {
        id: 3,
        name: 'Nouvelle voiture',
        target: 200000,
        current: 45000,
        category: 'purchase',
        deadline: new Date('2025-03-01'),
        description: 'Véhicule familial',
        isActive: true
      }
    ];
    
    this.goalsSubject.next(initialGoals);
  }

  getGoals(): Observable<Goal[]> {
    return this.goals$;
  }

  addGoal(goal: Omit<Goal, 'id'>): Observable<Goal> {
    const newGoal: Goal = {
      ...goal,
      id: Date.now() // Simple ID generation for demo
    };
    
    const currentGoals = this.goalsSubject.value;
    this.goalsSubject.next([...currentGoals, newGoal]);
    
    return new Observable(observer => {
      observer.next(newGoal);
      observer.complete();
    });
  }

  updateGoal(id: number, updates: Partial<Goal>): Observable<Goal> {
    const currentGoals = this.goalsSubject.value;
    const goalIndex = currentGoals.findIndex(g => g.id === id);
    
    if (goalIndex !== -1) {
      const updatedGoal = { ...currentGoals[goalIndex], ...updates };
      currentGoals[goalIndex] = updatedGoal;
      this.goalsSubject.next([...currentGoals]);
      
      return new Observable(observer => {
        observer.next(updatedGoal);
        observer.complete();
      });
    }
    
    throw new Error('Goal not found');
  }

  deleteGoal(id: number): Observable<boolean> {
    const currentGoals = this.goalsSubject.value;
    const filteredGoals = currentGoals.filter(g => g.id !== id);
    this.goalsSubject.next(filteredGoals);
    
    return new Observable(observer => {
      observer.next(true);
      observer.complete();
    });
  }

  getGoalProgress(goal: Goal): number {
    return Math.round((goal.current / goal.target) * 100);
  }

  getGoalRemaining(goal: Goal): number {
    return goal.target - goal.current;
  }

  getDaysUntilDeadline(goal: Goal): number {
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getGoalStatus(goal: Goal): 'on-track' | 'behind' | 'ahead' | 'completed' {
    const progress = this.getGoalProgress(goal);
    const daysRemaining = this.getDaysUntilDeadline(goal);
    const totalDays = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const expectedProgress = ((totalDays - daysRemaining) / totalDays) * 100;
    
    if (progress >= 100) return 'completed';
    if (progress > expectedProgress + 10) return 'ahead';
    if (progress < expectedProgress - 10) return 'behind';
    return 'on-track';
  }
}