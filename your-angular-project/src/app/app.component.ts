import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import 'uikit/dist/css/uikit.min.css';
import 'uikit/dist/js/uikit.min.js';
import 'uikit/dist/js/uikit-icons.min.js';
import { SignupComponent } from './signup/signup.component';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , LoginComponent , SignupComponent],
  templateUrl: './app.component.html',
  viewProviders : [AuthService],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'your-angular-project';
}
