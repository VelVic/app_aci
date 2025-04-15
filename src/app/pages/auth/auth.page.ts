import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { FirebaseService } from '../../services/firebase.service';
import { Users } from 'src/app/models/users.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  hide: boolean = true; // Estado de visibilidad de la contraseña

  firebaseService = inject(FirebaseService);
  utillsService = inject(UtilsService);

  // Formulario reactivo
  form = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]), // Campo de correo
    contraseña: new FormControl('', [Validators.required, Validators.minLength(6)]) // Campo de contraseña
  });

  constructor() { }

  ngOnInit() {
  }

  togglePasswordVisibility() {
    this.hide = !this.hide; // Alternar visibilidad
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utillsService.loading();

      await loading.present();

      this.firebaseService.signIn(this.form.value as Users)
        .then(resp => {

          this.getUserInfo(resp.user.uid)

        }).catch(error => {
          console.log(error);
          this.utillsService.presentToast({
            message: error.message,
            duration: 3000,
            color: 'danger',
            position: 'bottom',
            icon: 'alert-circle'
          })
        }).finally(() => {
          loading.dismiss();
        });
    }
  }

  async getUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utillsService.loading();

      await loading.present();

      let path = `usuarios/${uid}`;

      this.firebaseService.getDocument(path)
        .then((user: Users) => {

          this.utillsService.savelocalStorage('user', user);
          this.utillsService.routerLink('main/home');
          this.form.reset();

          this.utillsService.presentToast({
            message: `Bienvenido ${user.nombre}`,
            duration: 4000,
            color: 'success',
            position: 'middle',
            icon: 'person-circle'
          })

        }).catch(error => {
          console.log(error);
          this.utillsService.presentToast({
            message: error.message,
            duration: 3000,
            color: 'danger',
            position: 'bottom',
            icon: 'alert-circle'
          })
        }).finally(() => {
          loading.dismiss();
        });
    }
  }
}
