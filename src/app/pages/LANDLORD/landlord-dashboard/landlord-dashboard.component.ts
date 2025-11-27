import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { Property } from '../../../shared/model/property';
import { Tenancy } from '../../../shared/model/tenancy';
import { Payment } from '../../../shared/model/payment';
import { MaintenanceRequest } from '../../../shared/model/maintenanceRequest';
import { User, UserRole } from '../../../shared/model/user';
import { MainLayoutComponent } from '../../../shared/components/main-layout/main-layout.component';
import { MenuItem } from '../../../shared/model/menuItem';

@Component({
  selector: 'app-landlord-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MainLayoutComponent],
  templateUrl: './landlord-dashboard.component.html',
  styleUrl: './landlord-dashboard.component.css',
})
export class LandlordDashboardComponent implements OnInit {
  currentUser = signal<User | null>(null);
  currentView = signal<string>('dashboard');

  properties: Property[] = [
    {
      id: '1',
      title: 'Main Street Apartment',
      address: '123 Main St, Apartment 4B',
      default_rent_amount: 1500,
      status: 'OCCUPIED',
      landlordId: 'landlord1',
      imageUrl: '/assets/property1.jpg',
    },
  ];

  tenancies: Tenancy[] = [
    {
      id: '1',
      tenant_id: 'tenant1',
      property_id: '1',
      lease_start: new Date('2024-01-01'),
      lease_end: new Date('2024-12-31'),
      rent_amount: 1500,
      previous_rent_amount: 1400,
      status: 'ACTIVE',
    },
  ];

  payments: Payment[] = [
    {
      id: '1',
      tenancy_id: '1',
      amount: 1500,
      due_date: new Date('2024-03-01'),
      paid_date: new Date('2024-02-28'),
      status: 'PAID',
      month: 'March 2024',
    },
  ];

  maintenanceRequests: MaintenanceRequest[] = [
    {
      id: '1',
      tenancy_id: '1',
      title: 'Leaky Faucet',
      description: 'Kitchen faucet has been leaking for 2 days',
      status: 'PENDING',
      priority: 'MEDIUM',
      created_at: new Date('2024-03-15'),
    },
  ];

  stats = {
    totalProperties: 0,
    activeTenancies: 0,
    pendingRequests: 0,
    monthlyRevenue: 0,
  };

  ngOnInit() {
    this.calculateStats();
  }

  calculateStats() {
    this.stats.totalProperties = this.properties.length;
    this.stats.activeTenancies = this.tenancies.filter(
      (t) => t.status === 'ACTIVE'
    ).length;
    this.stats.pendingRequests = this.maintenanceRequests.filter(
      (mr) => mr.status === 'PENDING'
    ).length;
    this.stats.monthlyRevenue = this.tenancies
      .filter((t) => t.status === 'ACTIVE')
      .reduce((sum, tenancy) => sum + tenancy.rent_amount, 0);
  }

  getRentIncrease(tenancy: Tenancy): number {
    if (!tenancy.previous_rent_amount) return 0;
    return (
      ((tenancy.rent_amount - tenancy.previous_rent_amount) /
        tenancy.previous_rent_amount) *
      100
    );
  }

  getDaysUntilDue(payment: Payment): number {
    const today = new Date();
    const dueDate = new Date(payment.due_date);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'HIGH':
        return 'badge badge-error';
      case 'MEDIUM':
        return 'badge badge-warning';
      case 'LOW':
        return 'badge badge-info';
      default:
        return 'badge badge-ghost';
    }
  }

  getPropertyPendingRequests(propertyId: string): number {
    // Cache the result or pre-calculate this if it becomes a performance issue
    const propertyTenancies = this.tenancies.filter(
      (t) => t.property_id === propertyId
    );
    const propertyTenancyIds = propertyTenancies.map((t) => t.id);
    return this.maintenanceRequests.filter(
      (mr) =>
        propertyTenancyIds.includes(mr.tenancy_id) && mr.status === 'PENDING'
    ).length;
  }

  getPropertyAddress(propertyId: string): string {
    const property = this.properties.find((p) => p.id === propertyId);
    return property ? property.address : 'Unknown Property';
  }

  getPropertyAddressFromTenancy(tenancyId: string): string {
    const tenancy = this.tenancies.find((t) => t.id === tenancyId);
    if (!tenancy) return 'Unknown Tenancy';
    return this.getPropertyAddress(tenancy.property_id);
  }

  get vacantPropertiesCount(): number {
    return this.properties.filter((p) => p.status === 'VACANT').length;
  }

  get upcomingTenanciesCount(): number {
    return this.tenancies.filter((t) => t.status === 'UPCOMING').length;
  }

  get highPriorityRequestsCount(): number {
    return this.maintenanceRequests.filter((mr) => mr.priority === 'HIGH')
      .length;
  }

  // Navigation Items matching the new Interface
  myNavItems: MenuItem[] = [
    { id: '1', label: 'Dashboard', route: '/landlord/dashboard' },
    { id: '2', label: 'Properties', route: '/landlord/propeties' },
    { id: '3', label: 'Tenants', route: '/landlord/tenancies' },
    { id: '4', label: 'Settings', route: '/settings' },
  ];

  // mock user
  login(role: UserRole) {
    let mockUser: User;
    mockUser = {
      id: 'u2',
      name: 'John Landlord',
      email: 'john@realty.com',
      role: 'LANDLORD',
      avatar: 'https://i.pravatar.cc/150?u=u2',
    };
    this.currentUser.set(mockUser);
  }

  // set user null
  logout() {
    this.currentUser.set(null);
  }

  setView(viewId: string) {
    this.currentView.set(viewId);
  }
}
