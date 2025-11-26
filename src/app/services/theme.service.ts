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
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const finalTheme =
    storedTheme === 'dark' || (!storedTheme && prefersDark)
      ? 'dark'
      : 'light';
  this.darkModeSignal.set(finalTheme);
  document.documentElement.setAttribute('data-theme', finalTheme);
}

toggleTheme() {
  const newTheme = this.darkModeSignal() === 'dark' ? 'light' : 'dark';
  this.darkModeSignal.set(newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

}