import { Component, Inject, NgModule, OnInit, PLATFORM_ID } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { Appointment } from '../../../models/Appointment';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../../../services/storage.service';
import { TerminalService } from '../../../services/terminal.service';
import { Router, RouterModule, RouterLink } from '@angular/router';
import Swal from 'sweetalert2'; // Import SweetAlert

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, RouterLink],
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  
  appointment: Appointment = {
    appointmentId: 0,
    trCompanyId: 0,
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
    gateCode: '',
    ticketNumber: '' // Added ticket number field
  };

  terminals: any[] = [];
  drivers: any[] = [];
  filteredAppointments: Appointment[] = [];
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
    this.getCompanyIdFromLocalStorage();
    // this.getAppointments();
    this.loadTerminals();
    this.loadDrivers();
  }

  getCompanyIdFromLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userData = this.storageService.getItem('user');
      if (userData) {
        const { trCompanyId } = JSON.parse(userData);
        this.appointment.trCompanyId = trCompanyId;
      } else {
        console.error('No user data found in localStorage');
      }
    } else {
      console.error('localStorage is not available');
    }
  }

  // getAppointments(): void {
  //   this.isLoading = true;
  
  //   if (this.appointment.trCompanyId) {
  //     const first = 0; // Starting index for pagination
  //     const rows = this.itemsPerPage; // Number of items per page
  
  //     this.appointmentService.getAppointments(trCompanyId, first, rows).subscribe(
  //       (data) => {
  //         this.appointments = data;
  //         this.isLoading = false;
  //       },
  //       (error) => {
  //         console.error('Error fetching appointments', error);
  //         this.errorMessage = error?.error?.message || 'Failed to fetch appointments.';
  //         this.isLoading = false;
  //       }
  //     );
  //   } else {
  //     console.error('Company ID is not set, cannot fetch appointments.');
  //     this.isLoading = false;
  //   }
  // }
  

  loadTerminals(): void {
    if (this.appointment.trCompanyId) {
      this.terminalService.getAllTerminals(this.appointment.trCompanyId).subscribe(
        (data) => {
          this.terminals = data;
        },
        (error) => {
          console.error('Error fetching terminals', error);
          this.errorMessage = 'Failed to fetch terminals.';
        }
      );
    }
  }

  loadDrivers(): void {
    if (this.appointment.trCompanyId) {
      this.appointmentService.getDrivers(this.appointment.trCompanyId).subscribe(
        (data) => {
          this.drivers = data;
        },
        (error) => {
          console.error('Error fetching drivers', error);
          this.errorMessage = 'Failed to fetch drivers.';
        }
      );
    }
  }

  createAppointment(): void {
    this.appointment.ticketNumber = this.generateTicketNumber(); 
    this.appointmentService.createAppointment(this.appointment).subscribe(
      (response) => {
        Swal.fire('Success!', `Appointment created successfully! Your ticket number is ${this.appointment.ticketNumber}`, 'success');
        // this.getAppointments();
        this.resetAppointment();
      },
      (error) => {
        console.error('Error creating appointment', error);
        this.errorMessage = error?.error?.message || 'Failed to create appointment.';
      }
    );
  }

  generateTicketNumber(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = Array.from({ length: 3 }, () => letters.charAt(Math.floor(Math.random() * letters.length))).join('');
    const randomNumbers = Math.floor(1000 + Math.random() * 9000);
    return `${randomLetters}${randomNumbers}`;
  }

  resetAppointment(): void {
    this.appointment = {
      appointmentId: 0,
      trCompanyId: this.appointment.trCompanyId,
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
      gateCode: '',
      ticketNumber: ''
    };
    this.errorMessage = null;
  }

  deleteAppointment(id: number): void {
    this.appointmentService.deleteAppointment(id).subscribe(
      (response) => {
        // this.getAppointments();
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

  getTerminalName(terminalId: number): string {
    const terminal = this.terminals.find(t => t.terminalId === terminalId);
    return terminal ? terminal.portName : 'Unknown Terminal';
  }

  getDriverName(driverId: number): string {
    const driver = this.drivers.find(d => d.driverId === driverId);
    return driver ? driver.driverName : 'Unknown Driver';
  }
}
