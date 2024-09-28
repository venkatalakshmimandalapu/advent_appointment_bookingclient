import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, HttpClientModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false; // Loading state
  errorMessage: string | null = null; // Error message for user feedback

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      userType: ['', Validators.required]  // TruckingCompany or Terminal
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.loading = true; // Set loading to true during login
      this.errorMessage = null; // Reset error message

      const { email, password, userType } = this.loginForm.value;
      this.authService.login(email, password, userType).subscribe(
        (response: any) => {
          console.log('Login successful', response);
          const token = response.token;
          
          // Optionally save additional user data
          if (userType === 'TruckingCompany' && response.data.TrCompanyId) {
            localStorage.setItem('TrCompanyId', response.data.TrCompanyId.toString());
          }

          // Save the token
          this.storageService.setItem('authToken', token);

          // Save user data correctly
          localStorage.setItem('user', JSON.stringify(response.data));
          console.log('User data saved to localStorage:', response.data);

          // Redirect to dashboard
          this.router.navigate(['/dashboard']);
        },
        (error: any) => {
          console.error('Login failed', error);
          this.errorMessage = 'Login failed. Please check your credentials.'; // Provide feedback to the user
        },
        () => {
          this.loading = false; // Reset loading state when API call is complete
        }
      );
    }
  }
}
