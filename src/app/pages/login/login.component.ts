import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavbarComponent, RouterLink, ReactiveFormsModule, CommonModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    // Initialize the form with validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    // 1. Check Default Password
    if (password !== 'password123') {
      this.errorMessage = 'Invalid password. (Hint: Use password123)';
      return;
    }

    // 2. Check Email and Route to Dashboard
    switch (email.toLowerCase()) {
      case 'landlord@rms.com':
        this.router.navigate(['/landlord/dashboard']);
        break;
        
      case 'tenant@rms.com':
        this.router.navigate(['/tenant/dashboard']);
        break;
        
      case 'admin@rms.com':
        this.router.navigate(['/admin/dashboard']);
        break;
        
      default:
        this.errorMessage = 'User not found. Try landlord@rms.com';
    }
  }
}