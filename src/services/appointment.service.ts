import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/Appointment';
import { Terminal } from '../models/Terminal';

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

  createAppointment(appointment: Appointment): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, appointment, { headers: this.getHeaders() });
  }

  getAppointments(trCompanyId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/get-all`, { headers: this.getHeaders() });
  }

  updateAppointment(appointmentId: number, appointment: Appointment): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${appointmentId}`, appointment, { headers: this.getHeaders() });
  }

  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${appointmentId}`, { headers: this.getHeaders() });
  }


  getAppointmentsByTerminal(terminalId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`/api/appointments/terminal/${terminalId}`);
  }

  updateAppointmentStatus(appointmentId: number, status: string): Observable<any> {
    const endpoint = status === 'approved' 
        ? `${this.apiUrl}/approve/${appointmentId}`
        : `${this.apiUrl}/cancel/${appointmentId}`;

    return this.http.put(endpoint, {}, { headers: this.getHeaders() });
}

getDrivers(companyId: number): Observable<any[]> {
  return this.http.get<any[]>(`http://localhost:5232/api/driver/trCompanyId/${companyId}`,{ headers: this.getHeaders() });
}

    
    
}
