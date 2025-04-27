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

  async saveCycleData() {
    console.log('Saving cycle data:', {
      startDate: this.lastPeriodDate,
      cycleDuration: this.cycleDuration
    });
    // await this.cycleService.addNewCycle(startDate, this.cycleDuration); <-- disable this for now
    this.modalCtrl.dismiss(true); // Just dismiss
  }
  

  cancel() {
    this.modalCtrl.dismiss(false); // Close modal without saving
  }
}