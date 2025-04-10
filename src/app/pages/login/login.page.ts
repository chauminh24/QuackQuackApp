import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, Platform } from '@ionic/angular'; // Import Platform
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class LoginPage {
  loginForm: FormGroup;
  isLoginMode = true;
  isIOS: boolean; // Add the isIOS property

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private platform: Platform // Inject Platform service
  ) {
    this.isIOS = this.platform.is('ios'); // Determine if the platform is iOS
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    
    try {
      if (this.isLoginMode) {
        await this.auth.login(this.loginForm.value);
      } else {
        await this.auth.register(this.loginForm.value);
      }
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: (error as Error).message,
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      await loading.dismiss();
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}