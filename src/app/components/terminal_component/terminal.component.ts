import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { Appointment } from '../../../models/Appointment';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { StorageService } from '../../../services/storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
  standalone: true,
  imports: [CommonModule,FormsModule]
})
export class TerminalComponent implements OnInit, OnDestroy {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = []; 
  selectedDate: string = ''; 

  isLoading: boolean = false;
  errorMessage: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 5;


  private unsubscribe$ = new Subject<void>();

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,

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
              this.appointments = data.filter(appointment => 
                !appointment.isDeleted && 
                appointment.appointmentStatus !== 'Canceled');
              this.filteredAppointments = this.appointments; // Initialize filtered appointments
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

  filterAppointmentsByDate(): void {
    if (this.selectedDate) {
      const selected = new Date(this.selectedDate);
      this.filteredAppointments = this.appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentCreated); // Adjust as needed
        return appointmentDate.toDateString() === selected.toDateString();
      });
    } else {
      this.filteredAppointments = this.appointments; // Reset to all if no date is selected
    }
    this.currentPage = 1; // Reset to first page on filter
  }

  paginatedAppointments(): Appointment[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredAppointments.slice(start, start + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.filteredAppointments.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
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

  cancelAppointment(appointmentId: number): void {
    this.isLoading = true;
  
    this.appointmentService.updateAppointmentStatus(appointmentId, 'canceled')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response) => {
          console.log('Appointment canceled:', response);
          this.getAppointments();
          
          // Update the appointment status in the array
          const appointment = this.appointments.find(a => a.appointmentId === appointmentId);
          if (appointment) {
            appointment.status = 'canceled'; // Update the status
          }
          
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
  goHome(): void {
    this['router'].navigate(['/dashboard']);
  }
}
