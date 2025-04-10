import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule // Add FormsModule to imports
  ],
})
export class LoginPage {
  email: string = ''; // Bind this to the email input field
  password: string = ''; // Bind this to the password input field

  constructor(private router: Router, private authService: AuthService) {}

  async onLogin() {
    try {
      // Perform login logic with user-provided credentials
      await this.authService.login({ email: this.email, password: this.password });

      // Navigate to the loading page after successful login
      this.router.navigate(['loading'], { replaceUrl: true });
    } catch (error) {
      console.error('Login failed', error);
    }
  }
}