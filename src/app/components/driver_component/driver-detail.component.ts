import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { DriverService } from '../../../services/driver.service';
import { Driver } from '../../../models/Driver';

@Component({
  standalone: true,
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
})
export class DriverDetailComponent implements OnInit {
  driverId!: number;
  driver!: Driver;

  constructor(
    private driverService: DriverService,
    private route: ActivatedRoute,
    private router: Router // Keep it private or change to public
  ) {}

  ngOnInit(): void {
    this.driverId = +this.route.snapshot.paramMap.get('id')!;
    this.getDriverDetails(this.driverId);
  }

  getDriverDetails(driverId: number): void {
    this.driverService.getDriver(driverId).subscribe(
      (data: Driver) => {
        this.driver = data;
      },
      (error: any) => {
        console.error('Error fetching driver details', error);
      }
    );
  }

  // Method to delete driver
  deleteDriver(driverId: number): void {
    this.driverService.deleteDriver(driverId).subscribe(
      (response: string) => {
        console.log('Driver deleted successfully:', response);
        this.router.navigate(['/dashboard/drivers']); // Navigate after deletion
      },
      (error: any) => {
        console.error('Error deleting driver', error);
      }
    );
  }

  // New method to navigate back (if using private router)
  navigateBack(): void {
    this.router.navigate(['/dashboard/drivers']);
  }
}
