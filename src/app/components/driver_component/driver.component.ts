import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DriverService } from '../../../services/driver.service';
import { Driver } from '../../../models/Driver';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule]
})
export class DriverComponent implements OnInit {
addDriver() {
throw new Error('Method not implemented.');
}
  drivers: Driver[] = [];
  selectedDriver: Driver | null = null; // Use a more specific type
newDriver: any;

  constructor(private driverService: DriverService, private router: Router) {}

  ngOnInit() {
    this.getDrivers();
  }

  getDrivers() {
    this.driverService.getAllDrivers().subscribe(
      (data: Driver[]) => {
        this.drivers = data;
      },
      (error) => {
        console.error('Error fetching drivers', error);
      }
    );
  }

  viewDriver(driverId: number) {
    this.router.navigate(['/dashboard/drivers', driverId]);
  }

  deleteDriver(driverId: number) {
    this.driverService.deleteDriver(driverId).subscribe(
      () => {
        this.getDrivers(); // Refresh the list after deletion
      },
      (error: any) => {
        console.error('Error deleting driver', error);
      }
    );
  }

  selectDriver(driver: Driver) {
    this.selectedDriver = driver; // Update the selected driver
  }

  updateDriver() {
    // Implement the update logic here if needed
    if (this.selectedDriver) {
      this.driverService.updateDriver(Driver.driverId, this.selectedDriver).subscribe(
        () => {
          console.log('Driver updated successfully');
          this.getDrivers(); // Refresh the list after updating
          this.selectedDriver = null; // Clear selection
        },
        (error: any) => {
          console.error('Error updating driver', error);
        }
      );
    }
  }

  resetSelection() {
    this.selectedDriver = null; // Method to reset selection
  }
}
