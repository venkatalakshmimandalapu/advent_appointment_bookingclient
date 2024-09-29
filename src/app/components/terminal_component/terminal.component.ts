import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { Appointment } from '../../../models/Appointment';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { StorageService } from '../../../services/storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrl:'./terminal.component.css',
  standalone: true,
  imports: [CommonModule]
})
export class TerminalComponent implements OnInit, OnDestroy {
  appointments: Appointment[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private appointmentService: AppointmentService,
    private storageService: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.getAppointments();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getAppointments(): void {
    this.isLoading = true;

    if (isPlatformBrowser(this.platformId)) {
      const userData = this.storageService.getItem('user');
      if (userData) {
        const { trCompanyId } = JSON.parse(userData);
        this.appointmentService.getAppointments(trCompanyId)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(
            (data) => {
              this.appointments = data.filter(appointment => !appointment.isDeleted);
              this.isLoading = false;
            },
            (error) => this.handleError(error)
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

  acceptAppointment(appointmentId: number): void {
    this.isLoading = true;
    const appointment = this.appointments.find(a => a.appointmentId === appointmentId);
    
    if (appointment) {
      const originalStatus = appointment.status; // Store original status
      appointment.status = 'approved'; // Optimistically update

      this.appointmentService.updateAppointmentStatus(appointmentId, 'approved')
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (response) => {
            console.log('Appointment approved:', response);
            this.getAppointments(); // Refresh appointments
          },
          (error) => {
            console.error('Error approving appointment', error);
            this.handleError(error);
            appointment.status = originalStatus; // Restore original status
          }
        );
    }
  }

  // Rename this method to cancelAppointment if it's meant to cancel appointments
  cancelAppointment(appointmentId: number): void {
    this.isLoading = true;

    this.appointmentService.updateAppointmentStatus(appointmentId, 'canceled') // Ensure this status is correct
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
            (response) => {
                console.log('Appointment canceled:', response);
                // Handle successful cancellation
                this.isLoading = false;
            },
            (error) => {
                console.error('Error canceling appointment', error);
                this.handleError(error);
                this.isLoading = false;
            }
        );
}


  private handleError(error: any): void {
    if (error?.status === 403) {
      this.errorMessage = 'You do not have permission to perform this action.';
    } else if (error?.status === 404) {
      this.errorMessage = 'Appointment not found.';
    } else {
      this.errorMessage = error?.error?.message || 'An unexpected error occurred.';
    }
    this.isLoading = false;
  }
}
