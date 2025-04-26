import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController, IonicModule } from '@ionic/angular';
import { CycleService } from '../../services/cycle.service';
import { DetailedCycleComponent } from '../../components/detailed-cycle/detailed-cycle.component';
import { SettingsPage } from '../settings/settings.page';
import { CycleSetupModalComponent } from '../../components/cycle-setup-modal/cycle-setup-modal.component';
import { AnimatedDuckComponent } from '../../components/animated-duck/animated-duck.component';

@Component({
  selector: 'app-ovulation-tracker',
  templateUrl: './ovulation-tracker.page.html',
  styleUrls: ['./ovulation-tracker.page.scss'],
  imports: [
    IonicModule,
    AnimatedDuckComponent,
    CommonModule,
  ],
})
export class OvulationTrackerPage implements OnInit {
  currentDate: string = '';
  currentTime: string = '';
  currentPhase: string = 'Loading...';
  nextEvent: string = '';
  daysUntilNextEvent: number = 0;
  cycleDays: any[] = [];

  constructor(
    private cycleService: CycleService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 60000);
    await this.loadCycleData();
  }

  updateDateTime() {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  async loadCycleData() {
    const cycleData = await this.cycleService.getCurrentCycle();
    if (!cycleData) {
      await this.showSetupModal();
      return;
    }
    this.calculateCyclePhases(cycleData);
  }

  calculateCyclePhases(cycleData: any) {
    const now = new Date();
    const startDate = new Date(cycleData.startDate);
    const cycleLength = cycleData.cycleLength || 28;
    const ovulationDay = Math.floor(cycleLength * 0.5);
    const fertileStart = ovulationDay - 5;
    const fertileEnd = ovulationDay + 1;
    
    // Calculate current day in cycle
    const diffTime = now.getTime() - startDate.getTime();
    const currentDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Determine current phase
    if (currentDay <= 5) {
      this.currentPhase = 'Menstruation';
      this.nextEvent = 'Fertile Window';
      this.daysUntilNextEvent = 6 - currentDay;
    } else if (currentDay >= fertileStart && currentDay <= fertileEnd) {
      this.currentPhase = currentDay === ovulationDay ? 'Ovulation' : 'Follicular';
      this.nextEvent = currentDay < ovulationDay ? 'Ovulation' : 'Luteal Phase';
      this.daysUntilNextEvent = ovulationDay - currentDay;
    } else if (currentDay > ovulationDay) {
      this.currentPhase = 'Luteal';
      this.nextEvent = 'Period';
      this.daysUntilNextEvent = cycleLength - currentDay;
    } else {
      this.currentPhase = 'Follicular';
      this.nextEvent = 'Fertile Window';
      this.daysUntilNextEvent = fertileStart - currentDay;
    }
    
    // Generate weekly cycle view
    this.generateWeeklyCycle(startDate, cycleLength);
  }

  generateWeeklyCycle(startDate: Date, cycleLength: number) {
    const ovulationDay = Math.floor(cycleLength * 0.5);
    const fertileStart = ovulationDay - 5;
    const fertileEnd = ovulationDay + 1;
    const periodDays = 5;
    
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.cycleDays = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dayOfCycle = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      this.cycleDays.push({
        day: daysOfWeek[date.getDay()],
        date: date.getDate(),
        isPeriod: dayOfCycle <= periodDays,
        isFertile: dayOfCycle >= fertileStart && dayOfCycle <= fertileEnd,
        isOvulation: dayOfCycle === ovulationDay
      });
    }
  }

  async showSetupModal() {
    const modal = await this.modalCtrl.create({
      component: CycleSetupModalComponent,
    });
  
    const { data } = await modal.onDidDismiss();
    console.log('Modal dismissed with data:', data);
    if (data) {
      // Reload cycle data after setup
      await this.loadCycleData();
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async openSettings() {
    const modal = await this.modalCtrl.create({
      component: SettingsPage
    });
    await modal.present();
  }

  async showDetailedView() {
    const modal = await this.modalCtrl.create({
      component: DetailedCycleComponent,
      componentProps: {
        currentPhase: this.currentPhase,
        nextEvent: this.nextEvent,
        daysUntilNextEvent: this.daysUntilNextEvent
      }
    });
    await modal.present();
  }
}