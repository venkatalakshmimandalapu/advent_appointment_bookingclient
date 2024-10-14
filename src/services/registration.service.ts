import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private apiUrl = 'http://localhost:5232/api/registration'; 

  constructor(private http: HttpClient) {}

  // Register Trucking Company
  registerTruckingCompany(company: { TrCompanyName: string; Email: string; Password: string; GstNo?: string; TransportLicNo?: string; }): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.post(`${this.apiUrl}/truckingcompany`, company, { headers })
      .pipe(
        catchError((error) => {
          console.error('Trucking Company registration failed', error);
          return throwError(this.getErrorMessage(error));
        })
      );
  }

  // Register Terminal
  registerTerminal(terminal: { PortName: string; Email: string; Password: string; Address: string; City: string; Country: string; State?: string; }): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.post(`${this.apiUrl}/terminal`, terminal, { headers })
      .pipe(
        catchError((error) => {
          console.error('Terminal registration failed', error);
          return throwError(this.getErrorMessage(error));
        })
      );
  }

  // Create headers with JWT Bearer token
  private createAuthorizationHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // Handle error messages from the API response
  private getErrorMessage(error: any): string {
    if (error.error && error.error.message) {
      return error.error.message;
    } else if (error.error && error.error.errors) {
      return Object.values(error.error.errors).join(', '); 
    } else {
      return 'An unknown error occurred.';
    }
  }
}
