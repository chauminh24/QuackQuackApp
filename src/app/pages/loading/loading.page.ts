// loading.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class LoadingPage implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      const isAuthenticated = await this.auth.isLoggedIn();
      this.router.navigate([isAuthenticated ? 'home' : 'login'], { replaceUrl: true });
    } catch (error) {
      this.router.navigate(['login'], { replaceUrl: true });
    }
  }
}