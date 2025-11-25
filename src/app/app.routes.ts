import { Routes } from '@angular/router';
import { provideRouter} from '@angular/router';
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

export const routes: Routes = [
//   { path: '', component: HomeComponent }, // Default route
{ path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'properties', component: PropertiesComponent },
  { path: 'tenancies', component: TenanciesComponent },
  { path: 'payments', component: PaymentsComponent },
  { path: 'maintenance', component: MaintenanceComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'landlordDashboard', component: LandlordDashboardComponent },
  { path: 'landlordPropeties', component: PropertiesListComponent },
  { path: '**', redirectTo: 'login' },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
  ],
};
