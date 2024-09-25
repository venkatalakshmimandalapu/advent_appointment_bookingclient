import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DriverService } from '../../../services/driver.service';
import { Driver } from '../../../models/Driver';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class DriverComponent implements OnInit {
  drivers: Driver[] = [];
  driverForm: FormGroup;

  constructor(
    private driverService: DriverService,
    private fb: FormBuilder,
    private router: Router,
    private storageService: StorageService
  ) {
    this.driverForm = this.fb.group({
      driverName: ['', Validators.required],
      plateNo: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });
  }

  ngOnInit() {
    console.log('OnInit called');
    setTimeout(() => {
      const companyId = this.getCompanyIdFromLocalStorage();
      console.log('Company ID:', companyId);
    }, 1000); // add a 1-second delay
    this.loadDrivers();
  }

  private loadDrivers() {
    console.log('loadDrivers called'); // Log the call to loadDrivers

    const companyId = this.getCompanyIdFromLocalStorage();
    console.log('Company ID:', companyId); // Log the company ID

    if (companyId) {
        console.log('Fetching drivers for Company ID:', companyId); // Log before making the API call

        this.driverService.getAllDrivers(companyId).subscribe({
            next: (data: Driver[]) => {
                console.log('Drivers fetched:', data); // Log the fetched drivers
                this.drivers = data;
            },
            error: (err) => this.handleError('fetching drivers', err)
        });
    } else {
        console.error('No Company ID found. Cannot load drivers.');
        // this.notificationService.add('Please log in to access driver information.');
    }
}


  private getCompanyIdFromLocalStorage(): number | null {
    const userData = this.storageService.getItem('user');
    
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        console.log('Parsed user data:', parsedData);
        const companyId = parsedData.trCompanyId || null; 
        console.log('Extracted Company ID:', companyId);
        return companyId; 
      } catch (error) {
        console.error('Error parsing user data from local storage:', error);
        return null;
      }
    }
    console.warn('No user data found in local storage');
    return null; 
  }
  
  

  addDriver() {
    if (this.driverForm.invalid) {
        console.warn('Driver form is invalid.');
        return;
    }

    const companyId = this.getCompanyIdFromLocalStorage();
    if (!companyId) {
        console.error('No Company ID found. Cannot add driver.');
        return;
    }

    const newDriver: Driver = {
        trCompanyId: companyId,
        driverName: this.driverForm.value.driverName,
        plateNo: this.driverForm.value.plateNo,
        phoneNumber: this.driverForm.value.phoneNumber
    };

    this.driverService.createDriver(newDriver).subscribe({
        next: (data: Driver) => {
            this.drivers.push(data);
            this.resetForm();
            console.log('Driver added successfully:', data);
        },
        error: (err) => {
            console.error('Error adding driver:', err);
            this.handleError('adding driver', err);
        }
    });
}


  private resetForm() {
    this.driverForm.reset();
  }

  deleteDriver(driver: Driver) {
    if (!driver || !driver.trCompanyId) return;

    this.driverService.deleteDriver(driver.trCompanyId).subscribe({
        next: () => {
            this.loadDrivers(); // Reload the drivers list
            console.log('Driver deleted successfully');
        },
        error: (err) => this.handleError('deleting driver', err)
    });
  }


  private handleError(action: string, error: any) {
    console.error(`Error ${action}:`, error);
  }
}
