import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service'; // Ensure to import StorageService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, HttpClientModule]
  // styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService // Inject StorageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      userType: ['', Validators.required]  // TruckingCompany or Terminal
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { email, password, userType } = this.loginForm.value;
      this.authService.login(email, password, userType).subscribe(
        (response: any) => {
          console.log('Login successful', response);
          const token = response.token;
          if (userType === 'TruckingCompany' && response.data.TrCompanyId) {
            localStorage.setItem('TrCompanyId', response.data.TrCompanyId.toString());
          }

          // Save the token
          this.storageService.setItem('authToken', token);

          // Save user data correctly
          localStorage.setItem('user', JSON.stringify(response.data)); // Make sure you're saving response.data
          console.log('User data saved to localStorage:', response.data);

          // Redirect to dashboard
          this.router.navigate(['/dashboard']);
        },
        (error: any) => {
          console.error('Login failed', error);
        }
      );

    }
  }
}
