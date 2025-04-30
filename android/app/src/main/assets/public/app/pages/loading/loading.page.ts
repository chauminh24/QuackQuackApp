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
      // Simulate data loading or updating
      await this.simulateLoading();

      // Navigate to the home page after loading
      this.router.navigate(['home'], { replaceUrl: true });
    } catch (error) {
      console.error('Error during loading', error);
      this.router.navigate(['login'], { replaceUrl: true });
    }
  }

  private async simulateLoading(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 2000)); // Simulate 2 seconds of loading
  }
}