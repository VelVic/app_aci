import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LoginInputComponent } from './components/login-input/login-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { UpdateIntegratorComponent } from './components/update-integrator/update-integrator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HmodalComponent } from './components/hmodal/hmodal.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';



@NgModule({
  declarations: [
    HeaderComponent,
    HmodalComponent,
    LoginInputComponent,
    LogoComponent,
    UpdateUserComponent,

    UpdateIntegratorComponent
  ],
  exports: [
    HeaderComponent,
    HmodalComponent,
    LoginInputComponent,
    LogoComponent,
    UpdateUserComponent,

    UpdateIntegratorComponent,

    FormsModule,
    ReactiveFormsModule
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class SharedModule { }
