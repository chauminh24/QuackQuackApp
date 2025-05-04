import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CycleService {
  private CYCLE_KEY = 'user_cycles';
  private _storage: Storage | null = null;
  private isWeb: boolean;

  constructor(private storage: Storage) {
    this.isWeb = !this.isNativePlatform(); // Determine if running on the web
    this.init();
  }

  private isNativePlatform(): boolean {
    // Check if running in a native environment (Cordova/Capacitor)
    return !!(window as any).cordova || !!(window as any).Capacitor?.isNativePlatform;
  }

  async init() {
    if (!this.isWeb) {
      if (!this._storage) {
        const storage = await this.storage.create();
        this._storage = storage;
      }
    }
  }

  // Check if the user has saved any cycle data
  async isFirstTimeUser(): Promise<boolean> {
    if (this.isWeb) {
      const cycles = JSON.parse(localStorage.getItem(this.CYCLE_KEY) || '[]');
      return cycles.length === 0;
    } else {
      await this.init();
      const cycles = await this._storage?.get(this.CYCLE_KEY) || [];
      return cycles.length === 0;
    }
  }

  // Get the current (latest) cycle
  async getCurrentCycle(): Promise<any> {
    if (this.isWeb) {
      const cycles = JSON.parse(localStorage.getItem(this.CYCLE_KEY) || '[]');
      return cycles.length > 0 ? cycles[0] : null;
    } else {
      await this.init();
      const cycles = await this._storage?.get(this.CYCLE_KEY) || [];
      return cycles.length > 0 ? cycles[0] : null;
    }
  }

  // Add a new cycle to storage
  async addNewCycle(startDate: Date, cycleLength: number = 28): Promise<void> {
    if (this.isWeb) {
      const cycles = JSON.parse(localStorage.getItem(this.CYCLE_KEY) || '[]');
      cycles.unshift({
        startDate: startDate.toISOString(),
        cycleLength,
        ovulationDay: Math.floor(cycleLength * 0.5)
      });
      localStorage.setItem(this.CYCLE_KEY, JSON.stringify(cycles));
    } else {
      await this.init();
      const cycles = await this._storage?.get(this.CYCLE_KEY) || [];
      cycles.unshift({
        startDate: startDate.toISOString(),
        cycleLength,
        ovulationDay: Math.floor(cycleLength * 0.5)
      });
      await this._storage?.set(this.CYCLE_KEY, cycles);
    }
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
    if (this.isWeb) {
      return JSON.parse(localStorage.getItem(this.CYCLE_KEY) || '[]');
    } else {
      await this.init();
      return await this._storage?.get(this.CYCLE_KEY) || [];
    }
  }
}