import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    standalone: true,
    imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
    user: any;
    userType!: string;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

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
                }
                // else if(this.user.terminal){
                //     this.userType='Terminal';
                
                else {
                    this.userType = 'Terminal'; // Adjust as needed for other user types
                }
            }
        } else {
            console.warn('localStorage is not available in this environment.');
        }
    }
}
