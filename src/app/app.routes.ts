import { Routes } from '@angular/router';
import { HomeComponent } from './components/home_component/home.component';
import { LoginComponent } from './components/login_component/login.component';
import { RegistrationComponent } from './components/registration_component/registration.component';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard_component/dashboard.component';
import { DriverComponent } from './components/driver_component/driver.component'; // Import DriverComponent
import { DriverDetailComponent } from './components/driver_component/driver-detail.component'; // Import DriverDetailComponent
import { AppointmentComponent } from './components/appointment_component/appointment.component';
import { ViewAppointmentComponent } from './components/view-appointment_component/view_appointment.component';
import { TerminalComponent } from './components/terminal_component/terminal.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home route
  { path: 'login', component: LoginComponent }, // Login route
  { path: 'registration', component: RegistrationComponent }, // Registration route
  { path: 'dashboard', component: DashboardComponent }, // Dashboard route

  // Add the following routes for drivers
  { path: 'dashboard/drivers', component: DriverComponent }, // List all drivers
  { path: 'dashboard/drivers/:id', component: DriverDetailComponent }, // View driver details for CRUD
  {path:'appointments/create',component:AppointmentComponent},
  {path:'appointments/view',component:ViewAppointmentComponent},
  {path:'terminal/appointments',component:TerminalComponent},
  { path: '**', redirectTo: '' } // Redirect any unknown route to home
];
