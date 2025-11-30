import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ApplicationConfig } from '@angular/core';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PropertiesComponent } from './pages/properties/properties.component';
import { TenanciesComponent } from './pages/tenancies/tenancies.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { LoginComponent } from './pages/login/login.component';
import { LandlordDashboardComponent } from './pages/LANDLORD/landlord-dashboard/landlord-dashboard.component';
import { PropertiesListComponent } from './pages/LANDLORD/properties-list/properties-list.component';
import { LandlordTenanciesComponent } from './pages/LANDLORD/landlord-tenancies/landlord-tenancies.component';
import { LandlordPaymentsComponent } from './pages/LANDLORD/landlord-payments/landlord-payments.component';
import { NotFoundComponent } from './pages/404/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'properties', component: PropertiesComponent },
  { path: 'tenancies', component: TenanciesComponent },
  { path: 'payments', component: PaymentsComponent },
  { path: 'maintenance', component: MaintenanceComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'landlord/dashboard', component: LandlordDashboardComponent },
  { path: 'landlord/propeties', component: PropertiesListComponent },
  { path: 'landlord/tenancies', component: LandlordTenanciesComponent },
  { path: 'landlord/payments', component: LandlordPaymentsComponent },
  { path: '**', component: NotFoundComponent }
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
