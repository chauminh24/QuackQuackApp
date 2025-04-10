import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OvulationTrackerPage } from './ovulation-tracker.page';

const routes: Routes = [
  {
    path: '',
    component: OvulationTrackerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OvulationTrackerPageRoutingModule {}
