import { Component, computed, signal } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { User, UserRole } from '../../shared/model/user';
import { Property } from '../../shared/model/property';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  currentUser = signal<User | null>(null);
  currentView = signal<string>('dashboard');

  filteredProperties = computed(() => {
    const user = this.currentUser();
    if (!user) return [];
    // if (user.role === 'ADMIN') return this.properties();
    // if (user.role === 'LANDLORD') return this.properties().filter(p => p.landlordId === user.id);
    return []; 
  });

  menuItems = computed(() => {
    const role = 'LANDLORD';
    const base = [{ id: 'dashboard', label: 'Dashboard', icon: this.getIcon('chart') }];
    
    // if (role === 'ADMIN') {
    //   return [
    //     ...base,
    //     { id: 'properties', label: 'All Properties', icon: this.getIcon('building') },
    //     { id: 'users', label: 'User Management', icon: this.getIcon('users') },
    //     { id: 'requests', label: 'Maintenance', icon: this.getIcon('tool') },
    //   ];
    // } else if (role === 'LANDLORD') {
       return [
        ...base,
        { id: 'properties', label: 'My Properties', icon: this.getIcon('building') },
        { id: 'requests', label: 'Requests', icon: this.getIcon('tool') },
        { id: 'financials', label: 'Financials', icon: this.getIcon('wallet') },
      ];
    // } else {
    //    return [
    //     ...base,
    //     { id: 'lease', label: 'My Lease', icon: this.getIcon('doc') },
    //     { id: 'requests', label: 'Maintenance', icon: this.getIcon('tool') },
    //   ];
    // }
  });

  login(role: UserRole) {
    let mockUser: User;
    if (role === 'ADMIN') {
      mockUser = { id: 'u1', name: 'Sarah Admin', email: 'admin@sys.com', role: 'ADMIN', avatar: 'https://i.pravatar.cc/150?u=u1' };
    } else if (role === 'LANDLORD') {
      mockUser = { id: 'u2', name: 'John Landlord', email: 'john@realty.com', role: 'LANDLORD', avatar: 'https://i.pravatar.cc/150?u=u2' };
    } else {
      mockUser = { id: 'u3', name: 'Mike Tenant', email: 'mike@renter.com', role: 'TENANT', avatar: 'https://i.pravatar.cc/150?u=u3' };
    }
    this.currentUser.set(mockUser);
    this.currentView.set('dashboard');
  }

  logout() {
    this.currentUser.set(null);
  }

  setView(viewId: string) {
    this.currentView.set(viewId);
  }

  handleManageProperty(prop: Property) {
    console.log('Manage property:', prop.title);
    // Logic to manage property details would go here
  }

  getPageTitle() {
    return this.menuItems().find(i => i.id === this.currentView())?.label || 'Dashboard';
  }

  getIcon(name: string): string {
    const icons: any = {
      chart: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>`,
      building: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>`,
      users: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`,
      tool: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`,
      alert: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
      wallet: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>`,
      calendar: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`,
      doc: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`
    };
    return icons[name] || '';
  }

}
