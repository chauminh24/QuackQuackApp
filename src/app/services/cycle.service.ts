// cycle.service.ts
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CycleService {
  private CYCLE_KEY = 'user_cycles';

  constructor(private storage: Storage) {}

  async getCurrentCycle(): Promise<any> {
    const cycles = await this.storage.get(this.CYCLE_KEY) || [];
    return cycles.length > 0 ? cycles[0] : null;
  }

  async addNewCycle(startDate: Date, cycleLength: number = 28): Promise<void> {
    const cycles = await this.storage.get(this.CYCLE_KEY) || [];
    cycles.unshift({
      startDate,
      cycleLength,
      ovulationDay: Math.floor(cycleLength * 0.5) // Simplified ovulation calculation
    });
    await this.storage.set(this.CYCLE_KEY, cycles);
  }

  calculateCycleDay(cycle: any): number {
    const start = moment(cycle.startDate);
    const today = moment();
    return today.diff(start, 'days') + 1;
  }

  calculateDaysLeft(cycle: any): number {
    const cycleDay = this.calculateCycleDay(cycle);
    return cycle.cycleLength - cycleDay;
  }

  async getCycleHistory(): Promise<any[]> {
    return await this.storage.get(this.CYCLE_KEY) || [];
  }
}