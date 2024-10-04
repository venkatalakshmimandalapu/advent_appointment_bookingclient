import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
//   styleUrls: ['./reset-password.component.css'],
standalone:true,
imports:[RouterLink,CommonModule,ReactiveFormsModule]
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup): void {
    if (form.get('password')?.value !== form.get('confirmPassword')?.value) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    }
  }

  onResetPassword(): void {
    if (this.resetPasswordForm.valid) {
      // Implement the logic to reset the password here

      this.successMessage = 'Password has been reset successfully!';
      this.errorMessage = null;
      // Optionally navigate to login page
      this.router.navigate(['/login']);
    }
  }
}
