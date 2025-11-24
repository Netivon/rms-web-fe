import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../model/menuItem';
import { User } from '../model/user';
import { ThemeToggleComponent } from "../../components/theme-toggle/theme-toggle.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, ThemeToggleComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() menuItems: MenuItem[] = [];
  @Input() currentView: string = 'dashboard';
  @Input() user: User | null = null;
  @Output() selectView = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  handleNav(id: string) {
    this.selectView.emit(id);
    this.isMenuOpen = false; // Close menu on selection
  }
}
