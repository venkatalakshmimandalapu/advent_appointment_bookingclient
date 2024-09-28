import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { Appointment } from '../../../models/Appointment';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class TerminalComponent implements OnInit {
  appointments: Appointment[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private storageService: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.getTerminalAppointments();
  }

  getTerminalAppointments(): void {
    this.isLoading = true;

    // Check if running in the browser
    if (isPlatformBrowser(this.platformId)) {
      const userData = this.storageService.getItem('user');
      if (userData) {
        const { terminalId } = JSON.parse(userData);
        console.log(userData);
        this.appointmentService.getAppointmentsByTerminal(terminalId).subscribe(
            (data) => {
              this.appointments = data;
              console.log('Fetched terminal appointments:', this.appointments);
              this.isLoading = false;
            },
            (error) => {
              console.error('Error fetching terminal appointments', error);
              console.error('Error details:', error.error); // Log error details
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
}
