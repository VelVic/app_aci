import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Users } from 'src/app/models/users.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  hide: boolean = true; // Estado de visibilidad de la contraseña

  firebaseService = inject(FirebaseService);
  utillsService = inject(UtilsService);

  form = new FormGroup({
    uid: new FormControl(''),
    nombre: new FormControl('', [Validators.required, Validators.minLength(5)]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    tipo: new FormControl('alumno', [Validators.required, Validators.minLength(5)]),
    contraseña: new FormControl('', [Validators.required, Validators.minLength(6)]),
    fecha: new FormControl(new Date().toISOString().substring(0, 10), [Validators.required]),
    img: new FormControl(''),
  });
  
  ngOnInit() {
  }

  togglePasswordVisibility() {
    this.hide = !this.hide; // Alternar visibilidad
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utillsService.loading();
  
      // Mostrar el loading antes de realizar cualquier acción
      await loading.present();
  
      try {
        // Verificar si la imagen está vacía y asignar una imagen por defecto si es necesario
        if (!this.form.value.img) {
          this.form.controls.img.setValue('assets/icon/logo.png');  // URL de la imagen por defecto
        }
  
        // Registro del nuevo usuario
        const resp = await this.firebaseService.singUp(this.form.value as Users);
  
        // Actualizar el perfil del usuario con el nombre
        await this.firebaseService.updateUser(this.form.value.nombre);
  
        let uid = resp.user.uid;
        this.form.controls.uid.setValue(uid);
  
        // Registrar la acción (Registro de usuario)
        const accion = 'Registro de usuario';
        const usuarioId = uid;  // ID del usuario registrado
        const detalles = `Nombre: ${this.form.value.nombre} - Correo: ${this.form.value.correo} - Tipo: ${this.form.value.tipo}`;
        await this.firebaseService.registrarAccion(uid, usuarioId, accion, detalles);
  
        // Llamar a la función para setear la información del usuario
        this.setUserInfo(uid);
  
      } catch (error) {
        console.log(error);
        // Mostrar mensaje de error si algo falla
        this.utillsService.presentToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'bottom',
          icon: 'alert-circle-outline'
        });
      } finally {
        // Asegúrate de que loading.dismiss() se llame incluso si ocurre un error
        loading.dismiss();
      }
    }
  }
  

  async setUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utillsService.loading();

      await loading.present();

      let path = `usuarios/${uid}`;
      delete this.form.value.contraseña;

      this.firebaseService.setDocument(path, this.form.value)
        .then(async resp => {
          this.utillsService.savelocalStorage('user', this.form.value);
          this.utillsService.routerLink('main/home');
          this.form.reset();

        }).catch(error => {
          console.log(error);
          this.utillsService.presentToast({
            message: error.message,
            duration: 2500,
            color: 'danger',
            position: 'bottom',
            icon: 'alert-circle-outline'
          })
        }).finally(() => {
          loading.dismiss();
        });
    }
  }

}
