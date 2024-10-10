import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AppointmentService } from '../../../services/appointment.service';
import { StorageService } from '../../../services/storage.service';
import { FormsModule } from '@angular/forms';
import { Appointment } from '../../../models/Appointment'; // Adjust path as needed
import Swal from 'sweetalert2'; // Import SweetAlert

@Component({
  selector: 'app-view-appointment',
  templateUrl: './view_appointment.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./view_appointment.component.css']
})
export class ViewAppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  selectedDate: string = '';
  selectedStatus: string = '';
  isLoading: boolean = false;
  errorMessage: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  sortOrder: 'asc' | 'desc' = 'asc';
  currentSortColumn: string = '';
  searchTerm: string = ''; // New property for search term

  constructor(
    private http: HttpClient,
    private router: Router,
    private appointmentService: AppointmentService,
    private storageService: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

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
            this.filteredAppointments = this.appointments;
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

  toggleSortOrder(column: string): void {
    if (this.currentSortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortColumn = column;
      this.sortOrder = 'asc';
    }
    this.sortAppointments();
  }

  sortAppointments(): void {
    this.filteredAppointments.sort((a, b) => {
      let comparison = 0;
  
      if (this.currentSortColumn === 'sizeType') {
        const sizeA = this.extractSize(a.sizeType);
        const sizeB = this.extractSize(b.sizeType);
        comparison = sizeA - sizeB;
      } else if (this.currentSortColumn === 'appointmentId') {
        comparison = a.appointmentId - b.appointmentId;
      }
  
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  private extractSize(size: string): number {
    const match = size.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  }

  filterAppointmentsByDate(): void {
    this.applyFilters();
  }

  filterAppointmentsByStatus(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredAppointments = this.appointments.filter(appointment => {
      const dateMatch = !this.selectedDate || new Date(appointment.appointmentCreated).toDateString() === new Date(this.selectedDate).toDateString();
      const statusMatch = !this.selectedStatus || appointment.appointmentStatus === this.selectedStatus;
      const searchMatch = this.searchTerm ? 
        Object.values(appointment).some(value => 
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        ) : true;

      return dateMatch && statusMatch && searchMatch;
    });
    this.currentPage = 1;
    this.sortAppointments();
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

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this appointment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appointmentService.deleteAppointment(id).subscribe(
          () => {
            Swal.fire('Deleted!', 'Appointment deleted successfully!', 'success');
            this.getAppointments();
          },
          (error) => {
            console.error('Error deleting appointment', error);
            this.errorMessage = error?.error?.message || 'Failed to delete appointment.';
          }
        );
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }
}
