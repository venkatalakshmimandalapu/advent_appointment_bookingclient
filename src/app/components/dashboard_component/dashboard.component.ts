import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, RouterLink } from '@angular/router';  
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl:'./dashboard.component.css',
    standalone: true,
    imports: [CommonModule, RouterOutlet, HttpClientModule, ReactiveFormsModule, RouterLink]
})
export class DashboardComponent implements OnInit {
    user: any;
    userType!: string;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router  
    ) {}

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            const userData = localStorage.getItem('user');
    
            if (userData) {
                console.log('Retrieved user data from localStorage:', userData);
                try {
                    const parsedData = JSON.parse(userData);
                    this.user = parsedData; 
                    this.userType = this.user.trCompanyName ? 'TruckingCompany' : 'Terminal';
                } catch (error) {
                    console.error('Failed to parse user data:', error);
                    this.user = null; 
                }
            } else {
                console.warn('No user data found in localStorage.');
                this.user = null; 
            }
        } else {
            console.warn('localStorage is not available in this environment.');
            this.user = null; 
        }
    }

    // Method to navigate to the driver page
    goToDrivers() {
        this.router.navigate(['/drivers']); 
    }

    // Method to navigate to the create appointment page
    createAppointment() {
        this.router.navigate(['/appointments/create']); // Adjust the path based on your routing setup
    }
    viewAppointments(){
        this.router.navigate(['/appointments/view']);
    }
    ViewAppointmentsTerminal(){
        this.router.navigate(['terminal/appointments'])
    }
    
}
