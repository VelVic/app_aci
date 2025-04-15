import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntegratorPage } from './integrator.page';

const routes: Routes = [
  {
    path: '',
    component: IntegratorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntegratorPageRoutingModule {}
