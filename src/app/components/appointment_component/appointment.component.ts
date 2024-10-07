import { Component, Inject, NgModule, OnInit, PLATFORM_ID } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { Appointment } from '../../../models/Appointment';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../../../services/storage.service';
import { TerminalService } from '../../../services/terminal.service';
import { Router, RouterModule, RouterLink } from '@angular/router';



@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, RouterLink],
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  [x: string]: any;
  appointments: Appointment[] = [];
  
  // Initialize appointment without trCompanyId
  appointment: Appointment = {
    appointmentId: 0,
    trCompanyId: 0,  // Set this to 0 initially
    terminalId: 0,
    driverId: 0,
    moveType: '',
    containerNumber: '',
    sizeType: '',
    line: '',
    chassisNo: '',
    appointmentStatus: '',
    appointmentCreated: new Date(),
    appointmentValidThrough: new Date(),
    appointmentLastModified: new Date(),
    gateCode: ''
  };

  terminals: any[] = [];
  drivers: any[] = [];
  filteredAppointments: Appointment[] = []; // This will hold filtered appointments
  selectedDate: string = ''; 
  isLoading: boolean = false;
  errorMessage: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  constructor(
    private appointmentService: AppointmentService,
    private storageService: StorageService,
    private terminalService: TerminalService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router  

  ) {}

  ngOnInit(): void {
    this.getCompanyIdFromLocalStorage(); // Fetch company ID on init
    this.getAppointments();
    this.loadTerminals(); // Load terminals after company ID is set
    this.loadDrivers();
  }

  getCompanyIdFromLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userData = this.storageService.getItem('user');
      if (userData) {
        const { trCompanyId } = JSON.parse(userData);
        this.appointment.trCompanyId = trCompanyId; // Set company ID here
      } else {
        console.error('No user data found in localStorage');
      }
    } else {
      console.error('localStorage is not available');
    }
  }

  getAppointments(): void {
    this.isLoading = true;

    // Fetch appointments based on the company ID
    if (this.appointment.trCompanyId) {
      this.appointmentService.getAppointments(this.appointment.trCompanyId).subscribe(
        (data) => {
          this.appointments = data;
          console.log('Fetched appointments:', this.appointments);
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching appointments', error);
          this.errorMessage = error?.error?.message || 'Failed to fetch appointments.';
          this.isLoading = false;
        }
      );
    } else {
      console.error('Company ID is not set, cannot fetch appointments.');
      this.isLoading = false;
    }
  }
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
  loadTerminals(): void {
    if (this.appointment.trCompanyId) {
      this.terminalService.getAllTerminals(this.appointment.trCompanyId).subscribe(
        (data) => {
          this.terminals = data;
          console.log('Terminals loaded:', this.terminals);
        },
        (error) => {
          console.error('Error fetching terminals', error);
          this.errorMessage = 'Failed to fetch terminals.';
        }
      );
    } else {
      console.error('Company ID is not set, cannot load terminals.');
    }
  }

  loadDrivers(): void {
    if (this.appointment.trCompanyId) {
      this.appointmentService.getDrivers(this.appointment.trCompanyId).subscribe(
        (data) => {
          this.drivers = data;
          console.log('Drivers loaded:', this.drivers);
        },
        (error) => {
          console.error('Error fetching drivers', error);
          this.errorMessage = 'Failed to fetch drivers.';
        }
      );
    } else {
      console.error('Company ID is not set, cannot load drivers.');
    }
  }

  createAppointment(): void {
    console.log('Creating appointment with data:', this.appointment);
    
    this.appointmentService.createAppointment(this.appointment).subscribe(
      (response) => {
        console.log('Appointment created successfully', response);
        this.getAppointments();
        this.resetAppointment();
      },
      (error) => {
        console.error('Error creating appointment', error);
        this.errorMessage = error?.error?.message || 'Failed to create appointment.';
      }
    );
  }

  resetAppointment(): void {
    this.appointment = {
      appointmentId: 0,
      trCompanyId: this.appointment.trCompanyId, // Preserve the company ID
      terminalId: 0,
      driverId: 0,
      moveType: '',
      containerNumber: '',
      sizeType: '',
      line: '',
      chassisNo: '',
      appointmentStatus: '',
      appointmentCreated: new Date(),
      appointmentValidThrough: new Date(),
      appointmentLastModified: new Date(),
      gateCode: ''
    };
    this.errorMessage = null; // Reset error message
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
    this.router.navigate(['/dashboard']);
  }
 
}


