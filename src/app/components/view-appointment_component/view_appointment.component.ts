import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AppointmentService } from '../../../services/appointment.service';
import { StorageService } from '../../../services/storage.service';
import { FormsModule } from '@angular/forms';
import { Appointment } from '../../../models/Appointment'; // Adjust path as needed

@Component({
  selector: 'app-view-appointment',
  templateUrl: './view_appointment.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./view_appointment.component.css']
})
export class ViewAppointmentComponent implements OnInit {
  appointments: Appointment[] = []; // This will hold the appointments
  filteredAppointments: Appointment[] = []; // This will hold filtered appointments
  selectedDate: string = ''; // Format: 'YYYY-MM-DD'
  isLoading: boolean = false;
  errorMessage: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(
    private http: HttpClient,
    private router: Router,
    private appointmentService: AppointmentService,
    private storageService: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.getAppointments();
  }

  getAppointments(): void {
    this.isLoading = true;

    if (isPlatformBrowser(this.platformId)) {
      const userData = this.storageService.getItem('user');
      if (userData) {
        const { trCompanyId } = JSON.parse(userData);
        this.appointmentService.getAppointments(trCompanyId).subscribe(
          (data: Appointment[]) => {
            this.appointments = data;
            this.filteredAppointments = this.appointments; // Initialize filtered appointments
            this.isLoading = false;
          },
          (error: { error: { message: string; }; }) => {
            this.errorMessage = error?.error?.message || 'Failed to fetch appointments.';
            this.isLoading = false;
          }
        );
      } else {
        this.isLoading = false;
      }
    } else {
      this.isLoading = false;
    }
  }

  // In your ViewAppointmentComponent

  filterAppointmentsByDate(): void {
    if (this.selectedDate === 'all') {
      this.filteredAppointments = this.appointments; // Show all appointments
    } else if (this.selectedDate) {
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