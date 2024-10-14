import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Driver } from '../models/Driver';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private apiUrl = 'http://localhost:5232/api/driver'; 

  constructor(private http: HttpClient, private storageService: StorageService) {}

  private createAuthorizationHeader(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this.storageService.getItem('authToken');
    console.log('Retrieved Token:', token); 
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getAllDrivers(companyId: number): Observable<Driver[]> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<Driver[]>(`${this.apiUrl}/trCompanyId/${companyId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getDriver(driverId: number): Observable<Driver> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<Driver>(`${this.apiUrl}/${driverId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createDriver(driver: Driver): Observable<Driver> {
    const headers = this.createAuthorizationHeader();
    return this.http.post<Driver>(this.apiUrl, driver, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateDriver(driverId: number, driver: Driver): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.put(`${this.apiUrl}/${driverId}`, driver, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteDriver(driverId: number): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.delete(`${this.apiUrl}/${driverId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error); 
    const errorMessage = error.error?.message || 'Server error'; 
    return throwError(errorMessage); 
  }
}
