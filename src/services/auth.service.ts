import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5232/api/auth';  

  constructor(private http: HttpClient) {}

  // Login method
  login(email: string, password: string, userType: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };

    
    return this.http.post(`${this.apiUrl}?userType=${userType}`, body, { headers })
      .pipe(
        catchError((error) => {
          console.error('Login failed', error);
          return throwError(this.getErrorMessage(error));
        })
      );
  }
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
  }
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
