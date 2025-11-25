import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuItem } from '../../model/menuItem';
import { User } from '../../model/user';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  // Import your specific NavbarComponent here
  imports: [CommonModule, NavbarComponent], 
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'] // or .css
})
export class MainLayoutComponent {
  // --- Inputs passed down to the Navbar ---
  @Input() menuItems: MenuItem[] = [];
  @Input() currentUser: User | null = null;
  @Input() currentView: string = 'dashboard';

  // --- Outputs bubbled up from Navbar ---
  @Output() logout = new EventEmitter<void>();
  @Output() viewSelect = new EventEmitter<string>();

  // Helper to bubble events from the child Navbar
  handleLogout() {
    this.logout.emit();
  }

  handleViewSelection(viewId: string) {
    this.viewSelect.emit(viewId);
  }
  
  get currentYear(): number {
    return new Date().getFullYear();
  }
}