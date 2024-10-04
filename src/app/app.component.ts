import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./components/login_component/login.component";
import {  HttpClient, HttpClientModule} from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent , HttpClientModule,MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'advent_appointment_bookingclient';
}
