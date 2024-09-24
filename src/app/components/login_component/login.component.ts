import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {  HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';







@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports:[ReactiveFormsModule, CommonModule , RouterModule, HttpClientModule]
//   styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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
          this.router.navigate(['/employees']);  // Navigate to employees list after login
        },
        (error: any) => {
          console.error('Login failed', error);
        }
      );
    }
  }
}
