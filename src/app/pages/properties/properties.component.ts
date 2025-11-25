import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../../shared/navbar/navbar.component";

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent {
  showModal = false;

  properties = [
    { address: '123 Main Street', defaultRent: 1200 }
  ];

  newProperty = {
    address: '',
    defaultRent: null as number | null
  };

  openAddModal() {
    this.resetForm();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveProperty() {
    const rent = Number(this.newProperty.defaultRent);
    if (!this.newProperty.address || !rent || rent <= 0) {
      return; 
    }

    this.properties.push({
      address: this.newProperty.address,
      defaultRent: rent
    });
    this.closeModal();
  }

  private resetForm() {
    this.newProperty = { address: '', defaultRent: null };
  }
}
