import { EnvironmentInjector, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from '../models/Driver';  // Adjust the path if necessary
import { environment } from '../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private baseUrl: string = `${environment.apiUrl}/drivers`;  // Adjust the URL as per your API

  constructor(private http: HttpClient) {}

  // Create a new driver
  createDriver(driver: Driver): Observable<Driver> {
    return this.http.post<Driver>(`${this.baseUrl}`, driver);
  }

  // Get driver by ID
  getDriver(driverId: number): Observable<Driver> {
    return this.http.get<Driver>(`${this.baseUrl}/${driverId}`);
  }

  // Get all drivers
  getAllDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.baseUrl}`);
  }

  // Update driver details
  updateDriver(driverId: number, driver: Driver): Observable<any> {
    return this.http.put(`${this.baseUrl}/${driverId}`, driver, { responseType: 'text' });
  }

  // Delete driver by ID
  deleteDriver(driverId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${driverId}`, { responseType: 'text' });
  }
}
