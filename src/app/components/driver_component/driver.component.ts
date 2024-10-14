import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DriverService } from '../../../services/driver.service';
import { Driver } from '../../../models/Driver';
import { StorageService } from '../../../services/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  styleUrl: './driver.component.css'
})
export class DriverComponent implements OnInit {
  drivers: Driver[] = [];
  driverForm: FormGroup;
  editingDriverId: number | null = null; 

  constructor(
    private driverService: DriverService,
    private fb: FormBuilder,
    private router: Router,
    private storageService: StorageService
  ) {
    // Initialize the form with validators
    this.driverForm = this.fb.group({
      driverName: ['', Validators.required],
      plateNo: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadDrivers();
  }

  // Load all drivers for the logged-in trucking company
  loadDrivers(): void {
    const companyId = this.getCompanyIdFromLocalStorage();
    console.log('Fetching drivers for Company ID:', companyId); // Debugging line
    
    if (companyId) {
      this.driverService.getAllDrivers(companyId).subscribe({
        next: (data: Driver[]) => {
          console.log('Drivers fetched:', data); // Log fetched drivers
          this.drivers = data;
        },
        error: (err) => this.handleError('loading drivers', err),
      });
    } else {
      console.error('No company ID found.');
    }
  }

  private getCompanyIdFromLocalStorage(): number | null {
    const userData = this.storageService.getItem('user');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        return parsedData.trCompanyId || null;
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  addDriver(): void {
    if (this.driverForm.invalid) return;

    const companyId = this.getCompanyIdFromLocalStorage();
    if (!companyId) {
      console.error('No company ID found. Cannot add driver.');
      return;
    }

    const newDriver: Driver = {
      driverId: 0, 
      trCompanyId: companyId,
      driverName: this.driverForm.value.driverName,
      plateNo: this.driverForm.value.plateNo,
      phoneNumber: this.driverForm.value.phoneNumber,
    };

    this.driverService.createDriver(newDriver).subscribe({
      next: (driver: Driver) => {
        this.drivers.push(driver); // Add new driver to the list
        this.resetForm();
      },
      error: (err) => this.handleError('adding driver', err),
    });
  }

  editDriver(driver: Driver): void {
    this.editingDriverId = driver.driverId;
    this.driverForm.patchValue({
      driverName: driver.driverName,
      plateNo: driver.plateNo,
      phoneNumber: driver.phoneNumber,
    });
  }

  updateDriver(): void {
    if (this.driverForm.invalid || this.editingDriverId === null) return;

    const updatedDriver: Driver = {
      driverId: this.editingDriverId,
      trCompanyId: this.getCompanyIdFromLocalStorage()!,
      driverName: this.driverForm.value.driverName,
      plateNo: this.driverForm.value.plateNo,
      phoneNumber: this.driverForm.value.phoneNumber,
    };

    this.driverService.updateDriver(this.editingDriverId, updatedDriver).subscribe({
      next: () => {
        this.loadDrivers(); 
        this.resetForm();
        this.editingDriverId = null; 
      },
      error: (err) => this.handleError('updating driver', err),
    });
  }

  deleteDriver(driverId: number): void {
    this.driverService.deleteDriver(driverId).subscribe({
      next: () => {
        this.drivers = this.drivers.filter((driver) => driver.driverId !== driverId); 
        console.log('Driver deleted successfully');
      },
      error: (err) => this.handleError('deleting driver', err),
    });
  }

  resetForm(): void {
    this.driverForm.reset();
    this.editingDriverId = null;
  }

  private handleError(action: string, error: any): void {
    console.error(`Error ${action}:`, error);
  }

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }
}
