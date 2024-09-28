import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/Appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  [x: string]: any;
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

  // Create appointment
  createAppointment(appointment: Appointment): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, appointment, { headers: this.getHeaders() });
  }
  

  // Get all appointments
  getAppointments(trCompanyId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/get-all`, { headers: this.getHeaders() });
  }

  // Update appointment
  updateAppointment(appointmentId: number, appointment: Appointment): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${appointmentId}`, appointment, { headers: this.getHeaders() });
  }

  // Delete appointment
  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${appointmentId}`, { headers: this.getHeaders() });
  }
  getAppointmentsByTerminal(terminalId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`/api/appointments/terminal/${terminalId}`);
}


}
