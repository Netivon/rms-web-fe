import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../../shared/navbar/navbar.component";

@Component({
  selector: 'app-tenancies',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './tenancies.component.html',
  styleUrls: ['./tenancies.component.css']
})
export class TenanciesComponent {
  showModal = false;

  tenancies = [
    { property: '123 Main Street', tenant: 'John Doe', startDate: '2023-01-01', endDate: '2023-12-31', rent: 1200 }
  ];

  newTenancy = {
    property: '',
    tenant: '',
    startDate: '',
    endDate: '',
    rent: null as number | null
  };

  openAddModal() {
    this.resetForm();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveTenancy() {
    const rent = Number(this.newTenancy.rent);
    if (!this.newTenancy.property || !this.newTenancy.tenant || !this.newTenancy.startDate || !rent || rent <= 0) {
      return;
    }

    this.tenancies.push({
      property: this.newTenancy.property,
      tenant: this.newTenancy.tenant,
      startDate: this.newTenancy.startDate,
      endDate: this.newTenancy.endDate,
      rent: rent
    });

    this.closeModal();
  }

  private resetForm() {
    this.newTenancy = { property: '', tenant: '', startDate: '', endDate: '', rent: null };
  }

}
