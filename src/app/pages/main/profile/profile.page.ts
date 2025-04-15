import { Component, inject, OnInit } from '@angular/core';
import { Users } from 'src/app/models/users.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  
  ngOnInit() {
  }

  user(): Users {
    return this.utilsService.getLocalStorage('user');
  }  

  async takeImage() {
    let user = this.user();

    let path = `usuarios/${user.uid}`//Path unico para el usuario

    const dataUrl = (await this.utilsService.takePicture('Imagen del perfil')).dataUrl// Extraer la respuesta
    const loading = await this.utilsService.loading();
    await loading.present();

    // Registrar la acción (Actualizacion de integradora)
    const accion = 'Actualizacion de foto de perfil';
    const usuarioId = user.uid;  // ID del usuario registrado
    const detalles = `Usuario: ${user.nombre}`;
    await this.firebaseService.registrarAccion(user.uid, usuarioId, accion, detalles);

    let imgPath = `${user.uid}/perfil`;

    user.img = await this.firebaseService.updateImage(imgPath, dataUrl);

    this.firebaseService.updateDocument(path, { img: user.img })
    .then(async resp =>{

      this.utilsService.savelocalStorage('user', user);

        this.utilsService.presentToast({
          message: 'Imagen agregada correctamente',
          duration: 4000,
          color: 'success',
          position: 'bottom',
          icon: 'checkmark'
        })
        this.utilsService.dismissModal(true);
      }).catch(error => {
        console.log(error);
        this.utilsService.presentToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'bottom',
          icon: 'alert-circle'
        })
      }).finally(() => {
        loading.dismiss();
      });
    }
}
