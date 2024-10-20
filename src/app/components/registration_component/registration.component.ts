import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../../../services/registration.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { RouterModule } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Add imports here
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  userType: string = 'TruckingCompany'; 
  StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{6,}$/;

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(this.StrongPasswordRegx)]],
      userType: [this.userType, Validators.required],
      TrCompanyName: [''],
      transportLicNo: [''],
      gstNo: [''],
      portName: [''],
      address: [''],
      city: [''],
      state: [''],
      country: ['']
    });

    this.onUserTypeChange(this.userType);
  }

  onUserTypeChange(userType: string): void {
    this.userType = userType;
    this.registrationForm.controls['userType'].setValue(userType);
    this.clearValidators();

    if (userType === 'TruckingCompany') {
      this.registrationForm.controls['TrCompanyName'].setValidators([Validators.required]);
      this.registrationForm.controls['transportLicNo'].setValidators([Validators.required]);
      this.registrationForm.controls['gstNo'].setValidators([Validators.required]);
    } else if (userType === 'Terminal') {
      this.registrationForm.controls['address'].setValidators([Validators.required]);
      this.registrationForm.controls['city'].setValidators([Validators.required]);
      this.registrationForm.controls['state'].setValidators([Validators.required]);
      this.registrationForm.controls['country'].setValidators([Validators.required]);
    }

    this.updateFormValidity();
  }

  clearValidators(): void {
    this.registrationForm.controls['TrCompanyName'].clearValidators();
    this.registrationForm.controls['transportLicNo'].clearValidators();
    this.registrationForm.controls['gstNo'].clearValidators();
    this.registrationForm.controls['address'].clearValidators();
    this.registrationForm.controls['city'].clearValidators();
    this.registrationForm.controls['state'].clearValidators();
    this.registrationForm.controls['country'].clearValidators();
  }

  updateFormValidity(): void {
    Object.keys(this.registrationForm.controls).forEach(control => {
      this.registrationForm.controls[control].updateValueAndValidity();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.registrationForm.get(controlName);
    if (control?.invalid && control?.touched) {
      const errors = control.errors;

      if (errors) {
        if (errors['required']) {
          return `${controlName} is required.`;
        }
        if (errors['email']) {
          return 'Invalid email address.';
        }
        if (errors['minlength']) {
          return `Minimum length is ${errors['minlength'].requiredLength} characters.`;
        }
        if (errors['pattern']) {
          return 'Password should contain atleast one Uppercase,one lowercase,one digit and one special character.';
        }
      }
    }
    return '';
  }

  onRegister(): void {
    if (this.registrationForm.invalid) {
      console.log("Form is invalid");
      return;
    }

    const formData = this.registrationForm.value;

    console.log('User Type:', this.userType);
    console.log('Form Data:', formData);

    if (formData.userType === 'TruckingCompany') {
      this.registrationService.registerTruckingCompany(formData).subscribe(
        response => {
          console.log('Trucking Company Registered Successfully', response);
          if (response.TrCompanyId) {
            localStorage.setItem('TrCompanyId', response.TrCompanyId);
          }
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Trucking Company Registration Failed', error);
        }
      );
    } else if (formData.userType === 'Terminal') {
      this.registrationService.registerTerminal(formData).subscribe(
        response => {
          console.log('Terminal Registered Successfully', response);
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Terminal Registration Failed', error);
        }
      );
    }
  }
}
