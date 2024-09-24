import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private apiUrl = 'http://localhost:5232/api';  // Update this to your backend URL

  constructor(private http: HttpClient) {}

  // Register Trucking Company
  // registerTruckingCompany(company: any): Observable<any> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   return this.http.post(`${this.apiUrl}/truckingcompany`, company, { headers })
  //     .pipe(
  //       catchError((error: any) => {
  //         console.error('Registration failed', error);
  //         throw error;
  //       })
  //     );
  // }
  registerTruckingCompany(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registration/truckingcompany`, data)
      .pipe(
        catchError((error) => {
          console.error('Registration failed', error);
          return throwError(error);
        })
      );
  }
  

  // Register Terminal
  registerTerminal(terminal: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/terminal`, terminal, { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Registration failed', error);
          throw error;
        })
      );
  }
}
