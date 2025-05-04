import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { CycleService } from '../../services/cycle.service';

@Component({
  selector: 'app-cycle-setup-modal',
  templateUrl: './cycle-setup-modal.component.html',
  styleUrls: ['./cycle-setup-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
})
export class CycleSetupModalComponent {
  lastPeriodDate: string = '';
  cycleDuration: number = 28;

  constructor(
    private modalCtrl: ModalController,
    private cycleService: CycleService
  ) {}

  ionViewWillEnter() {
    this.lastPeriodDate = '';
    this.cycleDuration = 28;
  }
  
  async saveCycleData() {
    console.log('Saving cycle data:', {
      startDate: this.lastPeriodDate,
      cycleDuration: this.cycleDuration
    });
  
    try {
      const startDate = new Date(this.lastPeriodDate);
      await this.cycleService.addNewCycle(startDate, this.cycleDuration);
      this.modalCtrl.dismiss(true); // Dismiss with success
    } catch (error) {
      console.error('Failed to save cycle data:', error);
      const alert = document.createElement('ion-alert');
      alert.header = 'Error';
      alert.message = 'There was a problem saving your cycle. Please try again.';
      alert.buttons = ['OK'];
      document.body.appendChild(alert);
      await alert.present();
    }
  }

  

  cancel() {
    this.modalCtrl.dismiss(false); // Close modal without saving
  }
}