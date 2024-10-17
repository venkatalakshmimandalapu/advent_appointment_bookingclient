import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AppointmentService } from '../../../services/appointment.service';
import { StorageService } from '../../../services/storage.service';
import { FormsModule } from '@angular/forms';
import { Appointment } from '../../../models/Appointment';
import Swal from 'sweetalert2'; 
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

@Component({
  selector: 'app-view-appointment',
  templateUrl: './view_appointment.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule],
  styleUrls: ['./view_appointment.component.css']
})
export class ViewAppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  selectedDate: string = '';
  selectedStatus: string = '';
  isLoading: boolean = false;
  errorMessage: string | null = null;
  sortOrder: 'asc' | 'desc' = 'asc';
  currentSortColumn: string = 'appointmentId';
  searchTerm: string = '';
  totalRecords: number = 0; 
  itemsPerPage: number = 5; 


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
        const first = 0;
        const rows = 5; 
  
        this.appointmentService.getAppointments(trCompanyId, first, rows).subscribe(
          (data: any) => {
            console.log('Fetched appointments:', data);
            if (data && Array.isArray(data.appointments)) {
              this.appointments = data.appointments;
              this.filteredAppointments = this.appointments; 
              this.totalRecords = data.totalCount; 
            } else {
              console.error('Expected an array but received:', data);
              this.appointments = [];
              this.filteredAppointments = [];
              this.totalRecords = 0; 
            }
            this.isLoading = false;
          },
          (error) => {
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
  
  loadAppointments($event: TableLazyLoadEvent): void {
    this.isLoading = true;
    console.log('First:', $event.first, 'Rows:', $event.rows);

    if (isPlatformBrowser(this.platformId)) {
      const userData = this.storageService.getItem('user');
      if (userData) {
        const { trCompanyId } = JSON.parse(userData);
        const first = $event.first || 0;
        const rows = $event.rows || this.itemsPerPage;
  
        this.appointmentService.getAppointments(trCompanyId, first, rows).subscribe(
          (data: any) => {
            console.log('Fetched appointments on lazy load:', data);
            if (data && Array.isArray(data.appointments)) {
              this.appointments = data.appointments;
              this.filteredAppointments = this.appointments; 
              this.totalRecords = data.totalCount; 
            } else {
              console.error('Expected an array but received:', data);
              this.appointments = [];
              this.filteredAppointments = [];
              this.totalRecords = 0; 
            }
            this.isLoading = false;
          },
          (error) => {
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
      } else if (this.currentSortColumn === 'appointmentCreated') {
        comparison = new Date(a.appointmentCreated).getTime() - new Date(b.appointmentCreated).getTime();
      } else if (this.currentSortColumn === 'ticketNumber') {
        comparison = (a.ticketNumber ?? '').localeCompare(b.ticketNumber ?? '');
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  extractSize(sizeType: string): number {
    const sizeMap: { [key: string]: number } = {
      '20ft': 20,
      '40ft': 40,
    };
    return sizeMap[sizeType] || 0;
  }

  applyFilters(): void {
    this.filterAppointments();
  }

  filterAppointmentsByDate(): void {
    this.filterAppointments();
  }

  filterAppointmentsByStatus(): void {
    this.filterAppointments();
  }

  filterAppointments(): void {
    this.filteredAppointments = this.appointments.filter(appointment => {
      const matchesDate = this.selectedDate
        ? new Date(appointment.appointmentCreated).toISOString().substring(0, 10) === this.selectedDate
        : true;

      const matchesStatus = this.selectedStatus
        ? appointment.appointmentStatus === this.selectedStatus
        : true;

      const matchesSearchTerm = this.searchTerm
        ? (appointment.ticketNumber?.includes(this.searchTerm) || 
           appointment.containerNumber.includes(this.searchTerm) || 
           appointment.sizeType.includes(this.searchTerm) || 
           appointment.moveType.includes(this.searchTerm) || 
           appointment.line.includes(this.searchTerm) || 
           appointment.appointmentStatus.includes(this.searchTerm) || 
           appointment.chassisNo.includes(this.searchTerm) || 
           appointment.gateCode.includes(this.searchTerm) || 
           appointment.appointmentId.toString().includes(this.searchTerm))
        : true;

      return matchesDate && matchesStatus && matchesSearchTerm;
    });
  }

  deleteAppointment(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this appointment!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appointmentService.deleteAppointment(id).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Your appointment has been deleted.', 'success');
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

  logout(): void {
    this.router.navigate(['/login']); 
    this.storageService.removeItem('authToken');
    this.storageService.removeItem('user');
  }
}
