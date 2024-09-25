import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, RouterLink } from '@angular/router';  // Import Router
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';



@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    standalone: true,
    imports: [CommonModule, RouterOutlet, HttpClientModule , ReactiveFormsModule, CommonModule, RouterLink]
})
export class DashboardComponent implements OnInit {
    user: any;
    userType!: string;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router  // Inject Router
    ) {}

    ngOnInit() {
        // Check if running in the browser
        if (isPlatformBrowser(this.platformId)) {
            const userData = localStorage.getItem('user');
            this.user = userData ? JSON.parse(userData) : null;

            // Access user data correctly
            if (this.user && this.user.data) {
                this.user = this.user.data; // Now user is just the data object

                // Determine user type
                if (this.user.trCompanyName) {
                    this.userType = 'TruckingCompany';
                } else {
                    this.userType = 'Terminal'; // Adjust as needed for other user types
                }
            }
        } else {
            console.warn('localStorage is not available in this environment.');
        }
    }

    // Method to navigate to the driver page
    goToDrivers() {
        this.router.navigate(['/drivers']); // Navigate to the drivers route
    }
}
