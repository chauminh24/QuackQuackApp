// cycle.service.ts
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CycleService {
  private CYCLE_KEY = 'user_cycles';
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    if (!this._storage) {
      const storage = await this.storage.create(); // No arguments!
      this._storage = storage;
    }
  }

  // Check if the user has saved any cycle data
  async isFirstTimeUser(): Promise<boolean> {
    await this.init();
    const cycles = await this._storage?.get(this.CYCLE_KEY) || [];
    return cycles.length === 0;
  }

  // Get the current (latest) cycle
  async getCurrentCycle(): Promise<any> {
    await this.init();
    const cycles = await this._storage?.get(this.CYCLE_KEY) || [];
    return cycles.length > 0 ? cycles[0] : null;
  }

  // Add a new cycle to storage
  async addNewCycle(startDate: Date, cycleLength: number = 28): Promise<void> {
    await this.init();
    const cycles = await this._storage?.get(this.CYCLE_KEY) || [];
    cycles.unshift({
      startDate: startDate.toISOString(), // Save as ISO string for consistency
      cycleLength,
      ovulationDay: Math.floor(cycleLength * 0.5) // Simplified ovulation day
    });
    await this._storage?.set(this.CYCLE_KEY, cycles);
  }

  // Calculate which day of the cycle it is today
  calculateCycleDay(cycle: any): number {
    const start = moment(cycle.startDate);
    const today = moment();
    return today.diff(start, 'days') + 1;
  }

  // Calculate how many days are left until the cycle ends
  calculateDaysLeft(cycle: any): number {
    const cycleDay = this.calculateCycleDay(cycle);
    return cycle.cycleLength - cycleDay;
  }

  // Get full history of cycles
  async getCycleHistory(): Promise<any[]> {
    await this.init();
    return await this._storage?.get(this.CYCLE_KEY) || [];
  }
}
