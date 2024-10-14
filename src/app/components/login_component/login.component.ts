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
  loading = false; 
  errorMessage: string | null = null; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      userType: ['', Validators.required]  
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.loading = true; 
      this.errorMessage = null; 

      const { email, password, userType } = this.loginForm.value;
      this.authService.login(email, password, userType).subscribe(
        (response: any) => {
          console.log('Login successful', response);
          const token = response.token;
          
          
          if (userType === 'TruckingCompany' && response.data.TrCompanyId) {
            localStorage.setItem('TrCompanyId', response.data.TrCompanyId.toString());
          }

          
          this.storageService.setItem('authToken', token);
          
         
          localStorage.setItem('user', JSON.stringify(response.data));
          console.log('User data saved to localStorage:', response.data);

          
          this.router.navigate(['/dashboard']);
        },
        (error: any) => {
          console.error('Login failed', error);
          
          this.errorMessage = error.status === 401 
            ? 'Invalid credentials. Please try again.' 
            : 'Login failed. Invalid credentials. Please try again.';
        },
        () => {
          this.loading = false; 
        }
      );
    }
  }
}
