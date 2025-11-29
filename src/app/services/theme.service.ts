import { Injectable, signal, WritableSignal, effect } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeKey = 'app-theme';
  // Initialize theme from localStorage or default to 'dark'
  currentTheme: WritableSignal<Theme> = signal(this.getInitialTheme());

  constructor() {
    // Effect to apply theme class to body and save to localStorage
    effect(() => {
      const theme = this.currentTheme();
      document.body.classList.remove('light-theme', 'dark-theme');
      document.body.classList.add(`${theme}-theme`);
      localStorage.setItem(this.themeKey, theme);
       console.log(`Theme changed to: ${theme}`); // For debugging
    });
  }

  private getInitialTheme(): Theme {
    if (typeof window !== 'undefined') { // Check if localStorage is available
        const storedTheme = localStorage.getItem(this.themeKey);
        // Add preference for OS theme if no stored theme
        if (storedTheme === 'light' || storedTheme === 'dark') {
            return storedTheme;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
    }
    return 'dark'; // Default to dark
  }

  toggleTheme(): void {
    this.currentTheme.update(current => (current === 'light' ? 'dark' : 'light'));
  }
}