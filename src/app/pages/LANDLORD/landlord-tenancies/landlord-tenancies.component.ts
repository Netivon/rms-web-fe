import { Component, OnInit, signal } from '@angular/core';
import { Property } from '../../../shared/model/property';
import { User, UserRole } from '../../../shared/model/user';
import { Tenancy } from '../../../shared/model/tenancy';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from '../../../shared/components/main-layout/main-layout.component';
import { MenuItem } from '../../../shared/model/menuItem';

@Component({
  selector: 'app-landlord-tenancies',
  standalone: true,
  imports: [CommonModule, FormsModule, MainLayoutComponent],
  templateUrl: './landlord-tenancies.component.html',
  styleUrl: './landlord-tenancies.component.css'
})
export class LandlordTenanciesComponent implements OnInit {
  properties: Property[] = [];
  tenants: User[] = [];
  tenancies: Tenancy[] = []; // Use base Tenancy interface only

  currentUser = signal<User | null>(null);
  currentView = signal<string>('tenancies');

  // Filters
  statusFilter: 'all' | 'ACTIVE' | 'UPCOMING' | 'ENDED' = 'all';
  searchTerm: string = '';
  
  // New Tenancy Wizard
  showNewTenancyWizard: boolean = false;
  newTenancy: Partial<Tenancy> = {};
  wizardStep: number = 1;
  
  // UI State
  showRentIncreaseAlert: boolean = false;
  rentIncreaseDetails: { current: number, previous: number, percentage: number } | null = null;

  // History Modal State
  showHistoryModal: boolean = false;
  selectedPropertyHistory: Tenancy[] = [];
  selectedProperty: Property | undefined;

  // Navigation Items matching the new Interface
    myNavItems: MenuItem[] = [
      { id: '1', label: 'Dashboard', route: '/landlord/dashboard' },
      { id: '2', label: 'Properties', route: '/landlord/propeties' },
      { id: '3', label: 'Tenants', route: '/landlord/tenancies' },
      { id: '4', label: 'Payments', route: '/landlord/payments' },
    ];

  ngOnInit() {
    this.loadSampleData();
  }

  loadSampleData() {
    // Sample properties
    this.properties = [
      { 
        id: '1', 
        title: 'Main St Apartment',
        address: '123 Main St, Apt 4B', 
        default_rent_amount: 1500, 
        landlordId: '1',
        status: 'OCCUPIED',
        imageUrl: 'assets/property1.jpg'
      },
      { 
        id: '2', 
        title: 'Oak Avenue Unit',
        address: '456 Oak Ave, Unit 2', 
        default_rent_amount: 1800, 
        landlordId: '1',
        status: 'OCCUPIED',
        imageUrl: 'assets/property2.jpg'
      },
      { 
        id: '3', 
        title: 'Pine Road Suite',
        address: '789 Pine Rd, Suite 5', 
        default_rent_amount: 2200, 
        landlordId: '1',
        status: 'VACANT',
        imageUrl: 'assets/property3.jpg'
      }
    ];

    // Sample tenants
    this.tenants = [
      { 
        id: '101', 
        name: 'John Smith',
        email: 'john@example.com', 
        role: 'TENANT' as UserRole, 
        avatar: 'assets/avatars/john.jpg'
      },
      { 
        id: '102', 
        name: 'Sarah Johnson',
        email: 'sarah@example.com', 
        role: 'TENANT' as UserRole, 
        avatar: 'assets/avatars/sarah.jpg'
      },
      { 
        id: '103', 
        name: 'Mike Brown',
        email: 'mike@example.com', 
        role: 'TENANT' as UserRole, 
        avatar: 'assets/avatars/mike.jpg'
      }
    ];

    // Sample tenancies - using base Tenancy interface only
    this.tenancies = [
      {
        id: '1',
        property_id: '1',
        tenant_id: '101',
        lease_start: new Date('2024-01-01'),
        lease_end: new Date('2024-12-31'),
        rent_amount: 1500,
        previous_rent_amount: 1400,
        status: 'ACTIVE'
      },
      {
        id: '2',
        property_id: '2',
        tenant_id: '102',
        lease_start: new Date('2024-03-01'),
        lease_end: new Date('2025-02-28'),
        rent_amount: 1800,
        previous_rent_amount: 1700,
        status: 'ACTIVE'
      },
      {
        id: '3',
        property_id: '3',
        tenant_id: '103',
        lease_start: new Date('2024-06-01'),
        lease_end: new Date('2024-11-30'),
        rent_amount: 2200,
        status: 'UPCOMING'
      }
    ];
  }

  // === LOOKUP METHODS ===
  
  getPropertyForTenancy(tenancy: Tenancy): Property | undefined {
    return this.properties.find(p => p.id === tenancy.property_id);
  }

  getTenantForTenancy(tenancy: Tenancy): User | undefined {
    return this.tenants.find(t => t.id === tenancy.tenant_id);
  }

  // === FILTER METHODS ===

  get filteredTenancies(): Tenancy[] {
    return this.tenancies.filter(tenancy => {
      const matchesStatus = this.statusFilter === 'all' || tenancy.status === this.statusFilter;
      const property = this.getPropertyForTenancy(tenancy);
      const tenant = this.getTenantForTenancy(tenancy);
      const matchesSearch = !this.searchTerm || 
        property?.address.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        tenant?.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  // === CALCULATION METHODS ===

  calculateLeaseDuration(start: Date, end: Date): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    return months + (endDate.getMonth() - startDate.getMonth());
  }

  checkRentIncrease(tenancy: Tenancy): boolean {
    return !!tenancy.previous_rent_amount && tenancy.rent_amount > tenancy.previous_rent_amount;
  }

  getRentIncreasePercentage(tenancy: Tenancy): number {
    if (!tenancy.previous_rent_amount) return 0;
    return ((tenancy.rent_amount - tenancy.previous_rent_amount) / tenancy.previous_rent_amount) * 100;
  }

  // === WIZARD METHODS ===

  startNewTenancy() {
    this.showNewTenancyWizard = true;
    this.wizardStep = 1;
    this.newTenancy = {};
  }

  nextStep() {
    if (this.wizardStep < 3) {
      this.wizardStep++;
      
      if (this.wizardStep === 3 && this.newTenancy.property_id && this.newTenancy.rent_amount) {
        this.checkNewTenancyRentIncrease();
      }
    }
  }

  previousStep() {
    if (this.wizardStep > 1) {
      this.wizardStep--;
    }
  }

  canProceedToNextStep(): boolean {
    switch (this.wizardStep) {
      case 1:
        return !!this.newTenancy.property_id;
      case 2:
        return !!this.newTenancy.tenant_id;
      case 3:
        return !!this.newTenancy.lease_start && !!this.newTenancy.lease_end && !!this.newTenancy.rent_amount;
      default:
        return false;
    }
  }

  canCreateTenancy(): boolean {
    return this.canProceedToNextStep();
  }

  checkNewTenancyRentIncrease() {
    const propertyId = this.newTenancy.property_id;
    const newRent = this.newTenancy.rent_amount || 0;
    
    const previousTenancy = this.tenancies
      .filter(t => t.property_id === propertyId && t.status !== 'UPCOMING')
      .sort((a, b) => new Date(b.lease_end).getTime() - new Date(a.lease_end).getTime())[0];
    
    if (previousTenancy && newRent > previousTenancy.rent_amount) {
      const percentage = ((newRent - previousTenancy.rent_amount) / previousTenancy.rent_amount) * 100;
      this.rentIncreaseDetails = {
        current: newRent,
        previous: previousTenancy.rent_amount,
        percentage: percentage
      };
      this.showRentIncreaseAlert = true;
    }
  }

  createTenancy() {
    if (this.newTenancy.property_id && this.newTenancy.tenant_id && 
        this.newTenancy.lease_start && this.newTenancy.lease_end && 
        this.newTenancy.rent_amount) {
      
      const maxId = Math.max(...this.tenancies.map(t => parseInt(t.id)));
      const newId = (isFinite(maxId) ? maxId : 0) + 1;
      
      const newTenancy: Tenancy = {
        id: newId.toString(),
        property_id: this.newTenancy.property_id!,
        tenant_id: this.newTenancy.tenant_id!,
        lease_start: new Date(this.newTenancy.lease_start),
        lease_end: new Date(this.newTenancy.lease_end),
        rent_amount: this.newTenancy.rent_amount!,
        previous_rent_amount: this.newTenancy.previous_rent_amount,
        status: new Date(this.newTenancy.lease_start) > new Date() ? 'UPCOMING' : 'ACTIVE'
      };
      
      this.tenancies.push(newTenancy);
      this.cancelNewTenancy();
    }
  }

  cancelNewTenancy() {
    this.showNewTenancyWizard = false;
    this.wizardStep = 1;
    this.newTenancy = {};
    this.showRentIncreaseAlert = false;
    this.rentIncreaseDetails = null;
  }

  renewTenancy(tenancy: Tenancy) {
    this.newTenancy = {
      property_id: tenancy.property_id,
      tenant_id: tenancy.tenant_id,
      previous_rent_amount: tenancy.rent_amount,
      rent_amount: tenancy.rent_amount
    };
    this.showNewTenancyWizard = true;
    this.wizardStep = 1;
  }

  // === HISTORY METHODS ===

  getPropertyTenancyHistory(propertyId: string): Tenancy[] {
    return this.tenancies
      .filter(t => t.property_id === propertyId)
      .sort((a, b) => new Date(b.lease_start).getTime() - new Date(a.lease_start).getTime());
  }

  viewTenancyHistory(propertyId: string) {
    this.selectedPropertyHistory = this.getPropertyTenancyHistory(propertyId);
    this.selectedProperty = this.properties.find(p => p.id === propertyId);
    this.showHistoryModal = true;
  }

  closeHistoryModal() {
    this.showHistoryModal = false;
    this.selectedPropertyHistory = [];
    this.selectedProperty = undefined;
  }

  // === UI HELPER METHODS ===

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'badge badge-success';
      case 'UPCOMING':
        return 'badge badge-warning';
      case 'ENDED':
        return 'badge badge-error';
      default:
        return 'badge badge-ghost';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getTenantAvatar(tenantId: string): string {
    const tenant = this.tenants.find(t => t.id === tenantId);
    return tenant?.avatar || 'assets/avatars/default-avatar.png';
  }

  getTenantName(tenantId: string): string {
    const tenant = this.tenants.find(t => t.id === tenantId);
    return tenant?.name || 'Unknown Tenant';
  }

  getTenantEmail(tenantId: string): string {
    const tenant = this.tenants.find(t => t.id === tenantId);
    return tenant?.email || '';
  }
  // set user null
  logout() {
    this.currentUser.set(null);
  }

  setView(viewId: string) {
    this.currentView.set(viewId);
  }
}