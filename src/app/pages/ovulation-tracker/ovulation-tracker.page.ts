// ovulation-tracker.page.ts
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CycleService } from '../../services/cycle.service';
import { DetailedCycleComponent } from '../../components/detailed-cycle/detailed-cycle.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CycleSetupModalComponent } from '../../components/cycle-setup-modal/cycle-setup-modal.component';

@Component({
  selector: 'app-ovulation-tracker',
  templateUrl: './ovulation-tracker.page.html',
  styleUrls: ['./ovulation-tracker.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class OvulationTrackerPage implements OnInit {
  currentDate: string = '';
  cycleDay: number = 0;
  daysLeft: number = 0;
  isCalendarExpanded = false;
  cycleData: any;
  hasData: boolean = false;

  constructor(
    private cycleService: CycleService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    this.updateDate();
    await this.checkInitialSetup();
    this.loadCycleData();
  }

  updateDate() {
    this.currentDate = new Date().toLocaleDateString();
  }

  async checkInitialSetup() {
    const cycleData = await this.cycleService.getCurrentCycle();
    if (!cycleData) {
      await this.showSetupModal();
    }
  }

  async showSetupModal() {
    const modal = await this.modalCtrl.create({
      component: CycleSetupModalComponent,
      backdropDismiss: false // Force user to complete setup
    });
    
    await modal.present();
    const { data } = await modal.onWillDismiss();
    
    if (!data) {
      // User cancelled setup - you might want to handle this case
      // For example, redirect back to home page
    }
  }

  async loadCycleData() {
    this.cycleData = await this.cycleService.getCurrentCycle();
    this.hasData = !!this.cycleData;
    
    if (this.cycleData) {
      this.cycleDay = this.cycleService.calculateCycleDay(this.cycleData);
      this.daysLeft = this.cycleService.calculateDaysLeft(this.cycleData);
    }
  }

  toggleCalendar() {
    this.isCalendarExpanded = !this.isCalendarExpanded;
  }

  async openDetailedCycle() {
    const modal = await this.modalCtrl.create({
      component: DetailedCycleComponent,
      componentProps: {
        cycleData: this.cycleData
      }
    });
    await modal.present();
  }
}