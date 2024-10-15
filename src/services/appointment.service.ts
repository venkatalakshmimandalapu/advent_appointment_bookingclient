import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/Appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:5232/api/appointment';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  // Create a new appointment
  createAppointment(appointment: Appointment): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, appointment, { headers: this.getHeaders() });
  }

  // Get all appointments for a specific trucking company
  getAppointments(trCompanyId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/get-all?trCompanyId=${trCompanyId}`, { headers: this.getHeaders() });
  }

  // Update an existing appointment
  updateAppointment(appointmentId: number, appointment: Appointment): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${appointmentId}`, appointment, { headers: this.getHeaders() });
  }

  // Delete an appointment by ID
  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${appointmentId}`, { headers: this.getHeaders() });
  }

  // Get appointments by terminal ID
  getAppointmentsByTerminal(terminalId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/get-all-terminal`, { headers: this.getHeaders() });
  }

  // Update appointment status (approve or cancel)
  updateAppointmentStatus(appointmentId: number, status: 'approved' | 'canceled'): Observable<any> {
    const endpoint = status === 'approved' 
        ? `${this.apiUrl}/approve/${appointmentId}`
        : `${this.apiUrl}/cancel/${appointmentId}`;

    return this.http.put(endpoint, {}, { headers: this.getHeaders() });
  }

  // Get drivers for a specific company
  getDrivers(companyId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5232/api/driver/trCompanyId/${companyId}`, { headers: this.getHeaders() });
  }
}
