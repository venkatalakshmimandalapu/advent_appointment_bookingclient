import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import { RegistrationService } from '../../../services/registration.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule]
})
export class RegistrationComponent implements OnInit {

  registrationForm!: FormGroup;
  userType: string = ''; // Initialize userType as an empty string

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userType: ['', Validators.required],  // Added userType as a form control
      companyName: [''],  // TruckingCompany specific
      transportLicNo: [''],  // TruckingCompany specific
      gstNo: [''],  // TruckingCompany specific
      address: [''],  // Terminal specific
      city: [''],  // Terminal specific
      state: [''],  // Terminal specific
      country: ['']  // Terminal specific
    });

    // Initialize to default user type, such as "TruckingCompany" or "Terminal"
    this.onUserTypeChange('TruckingCompany');  // Set a default user type on initialization
  }

  onUserTypeChange(userType: string): void {
    this.userType = userType;
    this.registrationForm.controls['userType'].setValue(userType);  // Set the userType in form control

    // Clear validators for all fields initially
    this.clearValidators();

    // Set validators based on the selected user type
    if (userType === 'TruckingCompany') {
      this.registrationForm.controls['companyName'].setValidators([Validators.required]);
      this.registrationForm.controls['transportLicNo'].setValidators([Validators.required]);
      this.registrationForm.controls['gstNo'].setValidators([Validators.required]);
    } else if (userType === 'Terminal') {
      this.registrationForm.controls['address'].setValidators([Validators.required]);
      this.registrationForm.controls['city'].setValidators([Validators.required]);
      this.registrationForm.controls['state'].setValidators([Validators.required]);
      this.registrationForm.controls['country'].setValidators([Validators.required]);
    }

    // Update the validity of the form fields
    this.updateFormValidity();
  }

  clearValidators(): void {
    this.registrationForm.controls['companyName'].clearValidators();
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

  onRegister(): void {
    if (this.registrationForm.invalid) {
      console.log("Form is invalid");
      return;
    }

    const formData = this.registrationForm.value;

    if (formData.userType === 'TruckingCompany') {
      this.registrationService.registerTruckingCompany(formData).subscribe(
        response => {
          console.log('Trucking Company Registered Successfully', response);
        },
        error => {
          console.error('Trucking Company Registration Failed', error);
        }
      );
    } else if (formData.userType === 'Terminal') {
      this.registrationService.registerTerminal(formData).subscribe(
        response => {
          console.log('Terminal Registered Successfully', response);
        },
        error => {
          console.error('Terminal Registration Failed', error);
        }
      );
    }
  }
}
