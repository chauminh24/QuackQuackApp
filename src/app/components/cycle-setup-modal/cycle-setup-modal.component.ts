// cycle-setup-modal.component.ts
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { IonicModule, Platform } from '@ionic/angular'; // Import Platform for isIOS detection

import { Component } from '@angular/core';
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

  async saveCycleData() {
    if (this.lastPeriodDate) {
      await this.cycleService.addNewCycle(new Date(this.lastPeriodDate), this.cycleDuration);
      this.modalCtrl.dismiss(true); // Dismiss with success flag
    }
  }

  cancel() {
    this.modalCtrl.dismiss(false); // Dismiss with cancel flag
  }
}