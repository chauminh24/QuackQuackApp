// ovulation-tracker.page.ts
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CycleService } from '../../services/cycle.service';
import { DetailedCycleComponent } from '../../components/detailed-cycle/detailed-cycle.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

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

  constructor(
    private cycleService: CycleService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.updateDate();
    this.loadCycleData();
  }

  updateDate() {
    this.currentDate = new Date().toLocaleDateString();
  }

  async loadCycleData() {
    this.cycleData = await this.cycleService.getCurrentCycle();
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