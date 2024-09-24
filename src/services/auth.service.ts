import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5232/api';  // Update with your API URL

  constructor(private http: HttpClient) {}

  /**
   * Login function that accepts email, password, and userType (TruckingCompany or Terminal)
   */
  login(email: string, password: string, userType: string): Observable<any> {
    const body = { email, password, userType };
    
    return this.http.post(`${this.apiUrl}/auth/login`, body).pipe(
      map((response: any) => {
        // Store the token in local storage if login is successful
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
        }
        return response;
      }),
      catchError(this.handleError) // Handle error
    );
  }

  /**
   * Check if user is logged in by verifying if token is present
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Logout function to clear token from local storage and optionally inform the server
   */
  logout(): void {
    localStorage.removeItem('authToken');
    
    // Optionally notify the server to invalidate the token
    // this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe();
  }

  /**
   * Get token for authorization headers
   */
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Add authorization headers for authenticated requests
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  /**
   * Example of a method that requires authorization
   */
  getUserData(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/user/profile`, { headers }).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  /**
   * Error handling
   */
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}
