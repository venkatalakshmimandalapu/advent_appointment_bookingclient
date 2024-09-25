import { Routes } from '@angular/router';
import { HomeComponent } from './components/home_component/home.component';
import { LoginComponent } from './components/login_component/login.component';
import { RegistrationComponent } from './components/registration_component/registration.component';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/trucking_comp_dashboard/dashboard.component';


export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home route
  { path: 'login', component: LoginComponent }, // Login route
  { path: 'registration', component: RegistrationComponent }, // Registration route
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '' } // Redirect any unknown route to home
];

