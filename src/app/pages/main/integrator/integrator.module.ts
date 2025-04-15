import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntegratorPageRoutingModule } from './integrator-routing.module';

import { IntegratorPage } from './integrator.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntegratorPageRoutingModule,
    SharedModule
  ],
  declarations: [IntegratorPage]
})
export class IntegratorPageModule {}
