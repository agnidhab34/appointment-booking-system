import { Routes } from '@angular/router';
import { authGuard, customerGuard, providerGuard, guestGuard } from './guards/auth.guard';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { ServicesListComponent } from './components/services-list/services-list.component';
import { ServiceDetailsComponent } from './components/service-details/service-details.component';
import { BookAppointmentComponent } from './components/book-appointment/book-appointment.component';
import { MyAppointmentsComponent } from './components/my-appointments/my-appointments.component';

import { ProviderDashboardComponent } from './components/provider-dashboard/provider-dashboard.component';
import { ManageServicesComponent } from './components/manage-services/manage-services.component';
import { ManageAvailabilityComponent } from './components/manage-availability/manage-availability.component';
import { ProviderAppointmentsComponent } from './components/provider-appointments/provider-appointments.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },

  { path: 'services', component: ServicesListComponent, canActivate: [authGuard] },
  { path: 'services/:id', component: ServiceDetailsComponent, canActivate: [authGuard] },

  { path: 'customer/dashboard', component: CustomerDashboardComponent, canActivate: [customerGuard] },
  { path: 'customer/book/:serviceId', component: BookAppointmentComponent, canActivate: [customerGuard] },
  { path: 'customer/appointments', component: MyAppointmentsComponent, canActivate: [customerGuard] },

  { path: 'provider/dashboard', component: ProviderDashboardComponent, canActivate: [providerGuard] },
  { path: 'provider/services', component: ManageServicesComponent, canActivate: [providerGuard] },
  { path: 'provider/availability', component: ManageAvailabilityComponent, canActivate: [providerGuard] },
  { path: 'provider/appointments', component: ProviderAppointmentsComponent, canActivate: [providerGuard] },

  { path: '**', redirectTo: '' }
];
