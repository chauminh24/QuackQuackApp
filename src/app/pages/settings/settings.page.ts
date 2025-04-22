import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class SettingsPage {
  user: any = {
    name: 'User Name',
    avatar: 'assets/images/default-avatar.png'
  };

  settings = {
    appLock: false,
    notifications: true,
    reminders: true
  };

  constructor(
    public auth: AuthService,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
