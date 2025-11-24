import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Using Angular Signals for reactivity (Angular 16+)
  darkModeSignal = signal<string>('light');

  constructor() {
    this.updateThemeOnLoad();
  }

  updateThemeOnLoad() {
    // 1. Check local storage first
    // 2. If nothing in storage, check system preference
    if (localStorage.getItem('theme') === 'dark' || 
       (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.darkModeSignal.set('dark');
      document.documentElement.classList.add('dark');
    } else {
      this.darkModeSignal.set('light');
      document.documentElement.classList.remove('dark');
    }
  }

  toggleTheme() {
    // Toggle the signal
    this.darkModeSignal.update(value => (value === 'dark' ? 'light' : 'dark'));
    
    // Update the HTML class and Local Storage
    if (this.darkModeSignal() === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}