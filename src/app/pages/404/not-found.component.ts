import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white px-4">
      
      <!-- Icon / Illustration -->
      <div class="mb-8 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <!-- Main Text -->
      <h1 class="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
        404
      </h1>
      
      <h2 class="text-3xl md:text-4xl font-bold mt-4 mb-2">Page Not Found</h2>
      <p class="text-gray-600 dark:text-gray-400 text-lg text-center max-w-md mb-8">
        Oops! The page you are looking for doesn't exist yet or has been moved.
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4">
        <button (click)="goBack()" class="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900 px-6 py-2 rounded-lg font-semibold transition-all">
          ← Go Back
        </button>
        
        <a routerLink="/" class="btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
          Go Home
        </a>
      </div>

    </div>
  `,
  styles: [`
    /* Custom styles if Tailwind isn't enough, but Tailwind handles most of it here */
    :host {
      display: block;
    }
  `]
})
export class NotFoundComponent {
  
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}