// src/app/components/appointment_component/appointment.component.ts
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { Appointment } from '../../../models/Appointment';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrl: './appointment.component.css'
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
    gateCode: ''
  };

  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private storageService: StorageService,
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
        console.error('No user data found in localStorage');
        this.isLoading = false;
      }
    } else {
      console.error('localStorage is not available');
      this.isLoading = false;
    }
  }

  createAppointment(): void {
    // Log the appointment data being sent
    console.log('Creating appointment with data:', this.appointment);
    
    this.appointmentService.createAppointment(this.appointment).subscribe(
      (response) => {
        console.log('Appointment created successfully', response);
        this.getAppointments();
        this.resetAppointment();
      },
      (error) => {
        console.error('Error creating appointment', error);
        if (error.error) {
          console.error('Error response body:', error.error);
          this.errorMessage = error?.error?.message || 'Failed to create appointment.';
        } else {
          console.error('Unexpected error:', error);
          this.errorMessage = 'An unexpected error occurred.';
        }
      }
    );
  }
  

  resetAppointment(): void {
    this.appointment = {
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
}
