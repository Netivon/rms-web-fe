import { Component, OnInit, signal } from '@angular/core';
import { Property } from '../../../shared/model/property';
import { Tenancy } from '../../../shared/model/tenancy';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { MenuItem } from '../../../shared/model/menuItem';
import { User, UserRole } from '../../../shared/model/user';
import { MainLayoutComponent } from "../../../shared/components/main-layout/main-layout.component";

@Component({
  selector: 'app-properties-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MainLayoutComponent],
  templateUrl: './properties-list.component.html',
  styleUrl: './properties-list.component.css',
})
export class PropertiesListComponent implements OnInit {
  currentUser = signal<User | null>(null);
  currentView = signal<string>('properties');

  properties: Property[] = [];
  filteredProperties: Property[] = [];
  searchTerm: string = '';
  statusFilter: string = 'ALL';

  // Modal state
  showAddModal = false;
  isEditing = false;
  currentProperty: Partial<Property> = {
    title: '',
    address: '',
    default_rent_amount: 0,
    status: 'VACANT',
    imageUrl: '',
  };

  // Mock data - replace with API calls
  tenancies: Tenancy[] = [
    {
      id: '1',
      tenant_id: 'tenant1',
      property_id: '1',
      lease_start: new Date('2024-01-01'),
      lease_end: new Date('2024-12-31'),
      rent_amount: 1500,
      status: 'ACTIVE',
    },
    {
      id: '2',
      tenant_id: 'tenant2',
      property_id: '2',
      lease_start: new Date('2024-02-01'),
      lease_end: new Date('2025-01-31'),
      rent_amount: 2000,
      status: 'ACTIVE',
    },
  ];

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    // Mock data - replace with API call
    this.properties = [
      {
        id: '1',
        title: 'Downtown Apartment',
        address: '123 Main St, Apartment 4B, New York, NY 10001',
        default_rent_amount: 1500,
        status: 'OCCUPIED',
        landlordId: 'landlord1',
        imageUrl: 'assets/images/home.jpg',
      },
      {
        id: '2',
        title: 'Suburban House',
        address: '456 Oak Avenue, Brooklyn, NY 11201',
        default_rent_amount: 2000,
        status: 'VACANT',
        landlordId: 'landlord1',
        imageUrl: 'assets/images/home.jpg',
      },
      {
        id: '3',
        title: 'Garden Unit',
        address: '789 Pine Street, Queens, NY 11355',
        default_rent_amount: 1200,
        status: 'MAINTENANCE',
        landlordId: 'landlord1',
        imageUrl: 'assets/images/home.jpg',
      },
    ];
    this.filteredProperties = [...this.properties];
  }

  filterProperties() {
    this.filteredProperties = this.properties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus =
        this.statusFilter === 'ALL' || property.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange() {
    this.filterProperties();
  }

  onStatusFilterChange() {
    this.filterProperties();
  }

  getPropertyStats() {
    return {
      total: this.properties.length,
      occupied: this.properties.filter((p) => p.status === 'OCCUPIED').length,
      vacant: this.properties.filter((p) => p.status === 'VACANT').length,
      maintenance: this.properties.filter((p) => p.status === 'MAINTENANCE')
        .length,
    };
  }

  getActiveTenants(propertyId: string): number {
    return this.tenancies.filter(
      (t) => t.property_id === propertyId && t.status === 'ACTIVE'
    ).length;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'OCCUPIED':
        return 'badge badge-success';
      case 'VACANT':
        return 'badge badge-warning';
      case 'MAINTENANCE':
        return 'badge badge-error';
      default:
        return 'badge badge-ghost';
    }
  }

  // Modal Methods
  openAddModal() {
    this.isEditing = false;
    this.currentProperty = {
      title: '',
      address: '',
      default_rent_amount: 0,
      status: 'VACANT',
      imageUrl: '',
    };
    this.showAddModal = true;
  }

  openEditModal(property: Property) {
    this.isEditing = true;
    this.currentProperty = { ...property };
    this.showAddModal = true;
  }

  closeModal() {
    this.showAddModal = false;
    this.currentProperty = {
      title: '',
      address: '',
      default_rent_amount: 0,
      status: 'VACANT',
      imageUrl: '',
    };
  }

  submitProperty() {
    if (this.isFormValid()) {
      if (this.isEditing) {
        // Update existing property
        const index = this.properties.findIndex(
          (p) => p.id === this.currentProperty.id
        );
        if (index !== -1) {
          this.properties[index] = {
            ...this.properties[index],
            ...this.currentProperty,
            imageUrl: this.currentProperty.imageUrl || 'assets/images/home.jpg',
          } as Property;
        }
      } else {
        // Add new property
        const newProperty: Property = {
          id: Date.now().toString(),
          title: this.currentProperty.title!,
          address: this.currentProperty.address!,
          default_rent_amount: this.currentProperty.default_rent_amount!,
          status: this.currentProperty.status!,
          landlordId: 'landlord1',
          imageUrl: this.currentProperty.imageUrl || 'assets/images/home.jpg', // Set default image
        };
        this.properties.push(newProperty);
      }

      this.filterProperties();
      this.closeModal();
    }
  }

  isFormValid(): boolean {
    return (
      !!this.currentProperty.title &&
      !!this.currentProperty.address &&
      !!this.currentProperty.default_rent_amount &&
      this.currentProperty.default_rent_amount > 0
    );
  }

  deleteProperty(propertyId: string) {
    if (confirm('Are you sure you want to delete this property?')) {
      this.properties = this.properties.filter((p) => p.id !== propertyId);
      this.filterProperties();
    }
  }

  viewPropertyDetails(propertyId: string) {
    // Navigate to property details page or show details modal
    console.log('View property details:', propertyId);
  }

  // Navigation Items matching the new Interface
  myNavItems: MenuItem[] = [
    { id: '1', label: 'Dashboard', route: '/landlord/dashboard' },
    { id: '2', label: 'Properties', route: '/landlord/propeties' },
    { id: '3', label: 'Tenants', route: '/landlord/tenancies' },
    { id: '4', label: 'Payments', route: '/landlord/payments' },
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
