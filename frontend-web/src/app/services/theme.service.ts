import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = signal(false);

  constructor() {
    // Charger la préférence sauvegardée
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      this.enableDarkMode();
    }
  }

  toggleDarkMode(): void {
    if (this.darkMode()) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  private enableDarkMode(): void {
    this.darkMode.set(true);
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
  }

  private disableDarkMode(): void {
    this.darkMode.set(false);
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'false');
  }

  isDarkMode(): boolean {
    return this.darkMode();
  }
}
