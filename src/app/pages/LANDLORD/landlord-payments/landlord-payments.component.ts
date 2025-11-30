import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from '../../../shared/components/main-layout/main-layout.component';
import { Payment } from '../../../shared/model/payment';
import { Property } from '../../../shared/model/property';
import { Tenancy } from '../../../shared/model/tenancy';
import { User } from '../../../shared/model/user';
import { MenuItem } from '../../../shared/model/menuItem';

@Component({
  selector: 'app-landlord-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, MainLayoutComponent],
  templateUrl: './landlord-payments.component.html',
  styleUrl: './landlord-payments.component.css'
})
export class LandlordPaymentsComponent {

  payments: Payment[] = [];
  tenancies: Tenancy[] = [];
  properties: Property[] = [];
  tenants: User[] = [];

  currentUser = signal<User | null>(null);
  currentView = signal<string>('payments');

  // Filters
  statusFilter: 'all' | 'PENDING' | 'PAID' | 'OVERDUE' = 'all';
  propertyFilter: string = 'all';
  monthFilter: string = '';
  searchTerm: string = '';

  // UI State
  showGeneratePaymentsModal: boolean = false;
  showPaymentModal: boolean = false;
  selectedPayment: Payment | null = null;

  // New Payment
  newPayment: {
    paid_date: string;
    payment_method: string;
    reference_number: string;
  } = {
    paid_date: new Date().toISOString().split('T')[0],
    payment_method: 'BANK_TRANSFER',
    reference_number: ''
  };

  // Stats
  stats = {
    totalRevenue: 0,
    pendingPayments: 0,
    overduePayments: 0,
    collectedThisMonth: 0
  };

  // Available months for filter
  availableMonths: string[] = [];

  // Navigation Items matching the new Interface
      myNavItems: MenuItem[] = [
        { id: '1', label: 'Dashboard', route: '/landlord/dashboard' },
        { id: '2', label: 'Properties', route: '/landlord/propeties' },
        { id: '3', label: 'Tenants', route: '/landlord/tenancies' },
        { id: '4', label: 'Payments', route: '/landlord/payments' },
      ];

  ngOnInit() {
    this.loadSampleData();
    this.calculateStats();
    this.updateAvailableMonths();
  }

  loadSampleData() {
    // Sample tenancies
    this.tenancies = [
      {
        id: '1',
        property_id: '1',
        tenant_id: '101',
        lease_start: new Date('2024-01-01'),
        lease_end: new Date('2024-12-31'),
        rent_amount: 1500,
        status: 'ACTIVE'
      },
      {
        id: '2',
        property_id: '2',
        tenant_id: '102',
        lease_start: new Date('2024-03-01'),
        lease_end: new Date('2025-02-28'),
        rent_amount: 1800,
        status: 'ACTIVE'
      }
    ];

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
      }
    ];

    // Sample tenants
    this.tenants = [
      { 
        id: '101', 
        name: 'John Smith',
        email: 'john@example.com', 
        role: 'TENANT', 
        avatar: 'assets/avatars/john.jpg'
      },
      { 
        id: '102', 
        name: 'Sarah Johnson',
        email: 'sarah@example.com', 
        role: 'TENANT', 
        avatar: 'assets/avatars/sarah.jpg'
      }
    ];

    // Sample payments - using your Payment interface
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
    const nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 7);

    this.payments = [
      {
        id: '1',
        tenancy_id: '1',
        amount: 1500,
        due_date: new Date('2024-01-01'),
        paid_date: new Date('2024-01-02'),
        status: 'PAID',
        month: '2024-01'
      },
      {
        id: '2',
        tenancy_id: '1',
        amount: 1500,
        due_date: new Date('2024-02-01'),
        paid_date: new Date('2024-02-01'),
        status: 'PAID',
        month: '2024-02'
      },
      {
        id: '3',
        tenancy_id: '2',
        amount: 1800,
        due_date: new Date('2024-02-01'),
        status: 'PENDING',
        month: '2024-02'
      },
      {
        id: '4',
        tenancy_id: '1',
        amount: 1500,
        due_date: new Date(),
        status: 'PENDING',
        month: currentMonth
      },
      {
        id: '5',
        tenancy_id: '2',
        amount: 1800,
        due_date: new Date('2024-01-05'),
        status: 'OVERDUE',
        month: '2024-01'
      }
    ];
  }

  updateAvailableMonths() {
    const months = new Set(this.payments.map(p => p.month));
    this.availableMonths = Array.from(months).sort().reverse();
  }

  // === FILTER METHODS ===
  get filteredPayments(): Payment[] {
    return this.payments.filter(payment => {
      const matchesStatus = this.statusFilter === 'all' || payment.status === this.statusFilter;
      const matchesProperty = this.propertyFilter === 'all' || 
        this.getTenancyForPayment(payment)?.property_id === this.propertyFilter;
      const matchesMonth = !this.monthFilter || payment.month === this.monthFilter;
      
      const tenancy = this.getTenancyForPayment(payment);
      const property = this.getPropertyForTenancy(tenancy);
      const tenant = this.getTenantForTenancy(tenancy);
      
      const matchesSearch = !this.searchTerm || 
        property?.address.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        tenant?.name.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesStatus && matchesProperty && matchesMonth && matchesSearch;
    });
  }

  // === LOOKUP METHODS ===
  getTenancyForPayment(payment: Payment): Tenancy | undefined {
    return this.tenancies.find(t => t.id === payment.tenancy_id);
  }

  getPropertyForTenancy(tenancy: Tenancy | undefined): Property | undefined {
    if (!tenancy) return undefined;
    return this.properties.find(p => p.id === tenancy.property_id);
  }

  getTenantForTenancy(tenancy: Tenancy | undefined): User | undefined {
    if (!tenancy) return undefined;
    return this.tenants.find(t => t.id === tenancy.tenant_id);
  }

  getTenantName(tenantId: string): string {
    const tenant = this.tenants.find(t => t.id === tenantId);
    return tenant?.name || 'Unknown Tenant';
  }

  getTenantAvatar(tenantId: string): string {
    const tenant = this.tenants.find(t => t.id === tenantId);
    return tenant?.avatar || 'assets/avatars/default-avatar.png';
  }

  // === STATISTICS METHODS ===
  calculateStats() {
    const currentMonth = new Date().toISOString().slice(0, 7);

    this.stats = {
      totalRevenue: this.payments
        .filter(p => p.status === 'PAID')
        .reduce((sum, p) => sum + p.amount, 0),
      
      pendingPayments: this.payments.filter(p => p.status === 'PENDING').length,
      
      overduePayments: this.payments.filter(p => p.status === 'OVERDUE').length,
      
      collectedThisMonth: this.payments
        .filter(p => p.status === 'PAID' && p.month === currentMonth)
        .reduce((sum, p) => sum + p.amount, 0)
    };
  }

  // === PAYMENT MANAGEMENT ===
  generateMonthlyPayments() {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const monthString = nextMonth.toISOString().slice(0, 7);

    this.tenancies.forEach(tenancy => {
      // Check if payment for next month already exists
      const existingPayment = this.payments.find(p => 
        p.tenancy_id === tenancy.id && p.month === monthString
      );

      if (!existingPayment && tenancy.status === 'ACTIVE') {
        const newPayment: Payment = {
          id: (Math.max(...this.payments.map(p => parseInt(p.id))) + 1).toString(),
          tenancy_id: tenancy.id,
          amount: tenancy.rent_amount,
          due_date: nextMonth,
          status: 'PENDING',
          month: monthString
        };
        this.payments.push(newPayment);
      }
    });

    this.updateAvailableMonths();
    this.calculateStats();
    this.showGeneratePaymentsModal = false;
  }

  markAsPaid(payment: Payment) {
    this.selectedPayment = payment;
    this.showPaymentModal = true;
  }

  confirmPayment() {
    if (this.selectedPayment && this.newPayment.paid_date) {
      this.selectedPayment.status = 'PAID';
      this.selectedPayment.paid_date = new Date(this.newPayment.paid_date);
      
      this.calculateStats();
      this.closePaymentModal();
    }
  }

  closePaymentModal() {
    this.showPaymentModal = false;
    this.selectedPayment = null;
    this.newPayment = {
      paid_date: new Date().toISOString().split('T')[0],
      payment_method: 'BANK_TRANSFER',
      reference_number: ''
    };
  }

  // === UTILITY METHODS ===
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PAID':
        return 'badge badge-success';
      case 'PENDING':
        return 'badge badge-warning';
      case 'OVERDUE':
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

  formatMonth(month: string): string {
    const date = new Date(month + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  }

  isOverdue(payment: Payment): boolean {
    return payment.status === 'PENDING' && new Date(payment.due_date) < new Date();
  }

  getDaysOverdue(payment: Payment): number {
    if (payment.status !== 'PENDING') return 0;
    const dueDate = new Date(payment.due_date);
    const today = new Date();
    const diffTime = today.getTime() - dueDate.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  // === EXPORT METHODS ===
  exportToCSV() {
    const headers = ['Month', 'Tenant', 'Property', 'Amount', 'Due Date', 'Status', 'Paid Date'];
    const csvData = this.filteredPayments.map(payment => {
      const tenancy = this.getTenancyForPayment(payment);
      const property = this.getPropertyForTenancy(tenancy);
      const tenant = this.getTenantForTenancy(tenancy);

      return [
        this.formatMonth(payment.month),
        tenant?.name || 'N/A',
        property?.address || 'N/A',
        this.formatCurrency(payment.amount),
        payment.due_date.toDateString(),
        payment.status,
        payment.paid_date ? payment.paid_date.toDateString() : 'N/A'
      ];
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // === REPORT METHODS ===
  generateRevenueReport() {
    const paidPayments = this.payments.filter(p => p.status === 'PAID');
    const monthlyRevenue: { [key: string]: number } = {};

    paidPayments.forEach(payment => {
      monthlyRevenue[payment.month] = (monthlyRevenue[payment.month] || 0) + payment.amount;
    });

    console.log('Monthly Revenue Report:', monthlyRevenue);
    
    // Show report in alert (in real app, use a chart or detailed modal)
    let reportMessage = 'Monthly Revenue Report:\n\n';
    Object.keys(monthlyRevenue).sort().forEach(month => {
      reportMessage += `${this.formatMonth(month)}: ${this.formatCurrency(monthlyRevenue[month])}\n`;
    });
    
    alert(reportMessage);
  }

  // Get payments by month for charts/reports
  getPaymentsByMonth(): { month: string; paid: number; pending: number; overdue: number }[] {
    const months = new Set(this.payments.map(p => p.month));
    const result: { month: string; paid: number; pending: number; overdue: number }[] = [];

    months.forEach(month => {
      const monthPayments = this.payments.filter(p => p.month === month);
      result.push({
        month,
        paid: monthPayments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0),
        pending: monthPayments.filter(p => p.status === 'PENDING').length,
        overdue: monthPayments.filter(p => p.status === 'OVERDUE').length
      });
    });

    return result.sort((a, b) => a.month.localeCompare(b.month));
  }

  get activeTenancies(): Tenancy[] {
  return this.tenancies.filter(t => t.status === 'ACTIVE');
}

// set user null
  logout() {
    this.currentUser.set(null);
  }

  setView(viewId: string) {
    this.currentView.set(viewId);
  }
}
