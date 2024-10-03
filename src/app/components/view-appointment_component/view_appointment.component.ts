import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AppointmentService } from '../../../services/appointment.service';// Adjust path as needed
import { StorageService } from '../../../services/storage.service'; // Adjust path as needed
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-view-appointment',
    templateUrl: './view_appointment.component.html',
    standalone: true,
    imports: [CommonModule,FormsModule],
    styleUrl: './view_appointment.component.css'
})
export class ViewAppointmentComponent implements OnInit {
    appointments: any[] = []; // This will hold the appointments
    isLoading: boolean = false;
    errorMessage: string | null = null;

    constructor(
        private http: HttpClient,
        private router: Router,
        private appointmentService: AppointmentService, // Make sure this service is defined
        private storageService: StorageService, // Make sure this service is defined
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit(): void {
        this.getAppointments();
    }

    getAppointments(): void {
        this.isLoading = true;

        // Check if running in the browser
        if (isPlatformBrowser(this.platformId)) {
            const userData = this.storageService.getItem('user');
            if (userData) {
                const { trCompanyId } = JSON.parse(userData);
                console.log(userData);
                this.appointmentService.getAppointments(trCompanyId).subscribe(
                    (data: any[]) => {
                        this.appointments = data;
                        console.log('Fetched appointments:', this.appointments);
                        this.isLoading = false;
                    },
                    (error: { error: { message: string; }; }) => {
                        console.error('Error fetching appointments', error);
                        this.errorMessage = error?.error?.message || 'Failed to fetch appointments.';
                        this.isLoading = false;
                    }
                );
            } else {
                console.error('No user data found in localStorage');
                this.isLoading = false;
            }
        } else {
            console.error('localStorage is not available');
            this.isLoading = false;
        }
    }

    deleteAppointment(id: number): void {
        if (!id) {
          console.error('Appointment ID is not defined');
          return;
        }
    
        this.appointmentService.deleteAppointment(id).subscribe(
          (response) => {
            console.log('Appointment deleted successfully', response);
            this.getAppointments(); // Refresh the list after deletion
          },
          (error) => {
            console.error('Error deleting appointment', error);
            this.errorMessage = error?.error?.message || 'Failed to delete appointment.';
          }
        );
      }

      goHome(): void {
        this['router'].navigate(['/dashboard']);
      }
    }