// src/app/services/terminal.service.ts
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Terminal } from '../models/Terminal'; // Adjust the import path as necessary
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {
    [x: string]: Object;
  private baseUrl = 'http://localhost:5232/api/terminal'; // Base URL for terminal API

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  // Method to get all terminals for a given company
  // src/app/services/terminal.service.ts
getAllTerminals(companyId: number): Observable<Terminal[]> {
    return this.http.get<Terminal[]>(`${this.baseUrl}`,{ headers: this.getHeaders() }); // Make sure the endpoint matches your backend route
}

  // Method to create a new terminal
  createTerminal(terminal: Terminal): Observable<Terminal> {
    return this.http.post<Terminal>(this.baseUrl, terminal);
  }

  // Additional methods can be added here as needed
}
