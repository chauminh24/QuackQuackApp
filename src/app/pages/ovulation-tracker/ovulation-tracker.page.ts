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
  currentTime: string = '';
  cycleDay: number = 0;
  daysLeft: number = 0;
  cycleData: any;
  hasData: boolean = false;
  
  // New properties for cycle tracking
  currentPhase: string = '';
  nextEvent: string = '';
  daysUntilNextEvent: number = 0;
  cycleProgress: number = 0;
  nextPeriodDate: Date = new Date();

  constructor(
    private cycleService: CycleService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 60000);
    
    await this.checkInitialSetup();
    this.loadCycleData();
  }

  updateDateTime() {
    const now = new Date();
    this.currentDate = now.toLocaleDateString();
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      backdropDismiss: false
    });
    
    await modal.present();
    const { data } = await modal.onWillDismiss();
    
    if (data) {
      await this.loadCycleData();
    }
  }

  async loadCycleData() {
    this.cycleData = await this.cycleService.getCurrentCycle();
    this.hasData = !!this.cycleData;
    
    if (this.cycleData) {
      this.calculateCycleInfo();
    }
  }

  calculateCycleInfo() {
    const now = new Date();
    const startDate = new Date(this.cycleData.startDate);
    const cycleLength = this.cycleData.cycleLength || 28;
    
    // Calculate cycle day
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    this.cycleDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Calculate cycle progress
    this.cycleProgress = (this.cycleDay / cycleLength) * 100;
    
    // Determine current phase
    const ovulationDay = Math.floor(cycleLength * 0.5);
    const fertileStart = ovulationDay - 5;
    const fertileEnd = ovulationDay + 1;
    const lutealStart = ovulationDay + 2;
    
    if (this.cycleDay <= 5) {
      this.currentPhase = 'Menstrual';
      this.nextEvent = 'Fertile Window';
      this.daysUntilNextEvent = 6 - this.cycleDay;
    } else if (this.cycleDay >= fertileStart && this.cycleDay <= fertileEnd) {
      this.currentPhase = 'Fertile';
      this.nextEvent = 'Ovulation';
      this.daysUntilNextEvent = ovulationDay - this.cycleDay;
    } else if (this.cycleDay === ovulationDay) {
      this.currentPhase = 'Ovulation';
      this.nextEvent = 'Luteal Phase';
      this.daysUntilNextEvent = 1;
    } else if (this.cycleDay > ovulationDay) {
      this.currentPhase = 'Luteal';
      this.nextEvent = 'Period';
      this.daysUntilNextEvent = cycleLength - this.cycleDay;
    } else {
      this.currentPhase = 'Follicular';
      this.nextEvent = 'Fertile Window';
      this.daysUntilNextEvent = fertileStart - this.cycleDay;
    }
    
    // Calculate next period date
    this.nextPeriodDate = new Date(startDate);
    this.nextPeriodDate.setDate(startDate.getDate() + cycleLength);
    
    // Calculate days left
    this.daysLeft = cycleLength - this.cycleDay;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async openSettings() {
    // Implement your settings modal opening logic
  }

  async openDetailedCycle() {
    const modal = await this.modalCtrl.create({
      component: DetailedCycleComponent,
      componentProps: {
        cycleData: this.cycleData,
        currentPhase: this.currentPhase,
        nextEvent: this.nextEvent,
        daysUntilNextEvent: this.daysUntilNextEvent
      }
    });
    await modal.present();
  }
}