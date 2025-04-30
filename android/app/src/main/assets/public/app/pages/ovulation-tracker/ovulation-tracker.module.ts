import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OvulationTrackerPageRoutingModule } from './ovulation-tracker-routing.module';

import { OvulationTrackerPage } from './ovulation-tracker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OvulationTrackerPageRoutingModule
  ],
  declarations: [OvulationTrackerPage]
})
export class OvulationTrackerPageModule {}
