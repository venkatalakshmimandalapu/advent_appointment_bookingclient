
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Terminal } from '../models/Terminal'; 
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {
    [x: string]: Object;
  private baseUrl = 'http://localhost:5232/api/terminal'; 

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

  
getAllTerminals(companyId: number): Observable<Terminal[]> {
    return this.http.get<Terminal[]>(`${this.baseUrl}`,{ headers: this.getHeaders() }); 
}

 
  createTerminal(terminal: Terminal): Observable<Terminal> {
    return this.http.post<Terminal>(this.baseUrl, terminal);
  }
}
