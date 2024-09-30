import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DriverService } from '../../../services/driver.service';
import { Driver } from '../../../models/Driver';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
  styleUrl: './driver-detail.component.css',
  imports:[CommonModule]
})
export class DriverDetailComponent implements OnInit {
  driverId!: number;
  driver!: Driver;

  constructor(
    private driverService: DriverService,
    private route: ActivatedRoute,
    private router: Router
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

  deleteDriver(driverId: number): void {
    this.driverService.deleteDriver(driverId).subscribe(
      () => {
        console.log('Driver deleted successfully');
        this.router.navigate(['/dashboard/drivers']);
      },
      (error: any) => {
        console.error('Error deleting driver', error);
      }
    );
  }

  navigateBack(): void {
    this.router.navigate(['/dashboard/drivers']);
  }
}
