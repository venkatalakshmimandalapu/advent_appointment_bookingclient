import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Driver } from '../models/Driver';
import { StorageService } from './storage.service'; // Import the StorageService

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private apiUrl = 'http://localhost:5232/api/driver'; // Adjust the URL as needed

  constructor(private http: HttpClient, private storageService: StorageService) {}

  // Method to create authorization headers
  private createAuthorizationHeader(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this.storageService.getItem('authToken');
    console.log('Retrieved Token:', token); // Debug token retrieval
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      console.log('Headers:', headers.keys(), headers.get('Authorization')); // Debug headers
    }
    return headers;
  }

  // Fetch all drivers
  getAllDrivers(companyId: number): Observable<Driver[]> {
    const headers = this.createAuthorizationHeader();
    // Pass companyId as a query parameter
    return this.http.get<Driver[]>(`${this.apiUrl}?companyId=${companyId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch a single driver by ID
  getDriver(driverId: number): Observable<Driver> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<Driver>(`${this.apiUrl}/${driverId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Create a new driver
  createDriver(driver: Driver): Observable<Driver> {
    const headers = this.createAuthorizationHeader();
    return this.http.post<Driver>(this.apiUrl, driver, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing driver
  updateDriver(driverId: number, driver: Driver): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.put(`${this.apiUrl}/${driverId}`, driver, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a driver
  deleteDriver(driverId: number): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.delete(`${this.apiUrl}/${driverId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Handle errors from the API response
  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error); // Log the error to console
    const errorMessage = error.error?.message || 'Server error'; // User-friendly error message
    return throwError(errorMessage); // Return an observable with the error message
  }
}
