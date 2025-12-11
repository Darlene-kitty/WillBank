import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'default' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [ngClass]="buttonClasses"
      (click)="handleClick($event)"
      class="btn">
      <span *ngIf="loading" class="animate-spin">⏳</span>
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'default';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Output() clicked = new EventEmitter<Event>();

  get buttonClasses(): string {
    const classes = ['btn'];
    
    // Variant classes
    switch (this.variant) {
      case 'primary':
        classes.push('btn-primary');
        break;
      case 'secondary':
        classes.push('btn-secondary');
        break;
      case 'outline':
        classes.push('btn-outline');
        break;
      case 'ghost':
        classes.push('btn-ghost');
        break;
      case 'danger':
        classes.push('btn-danger');
        break;
    }

    // Size classes
    if (this.size === 'sm') {
      classes.push('btn-sm');
    } else if (this.size === 'lg') {
      classes.push('btn-lg');
    }

    return classes.join(' ');
  }

  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
