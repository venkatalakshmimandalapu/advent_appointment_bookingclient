import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']  
})
export class HomeComponent {

  constructor(private router: Router) {}

  // Navigate to Login
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Navigate to Registration
  goToRegistration(): void {
    this.router.navigate(['/registration']);
  }
}
