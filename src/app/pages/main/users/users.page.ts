import { Component, inject, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { map } from 'rxjs';
import { Users } from 'src/app/models/users.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateUserComponent } from 'src/app/shared/components/update-user/update-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);

  loading: boolean = false;

  users: Users[] = [];

  ngOnInit() {
    this.getUser();
  }

  ionViewWillEnter() {
    this.getUser();
  }

  async addUpdateUser(users?: Users) {
    let modal = await this.utilsService.getModal({
      component: UpdateUserComponent,
      cssClass: 'add-update-user',
      componentProps: { users }
    })
    if (modal) this.getUser();
  }

  user(): Users {
    return this.utilsService.getLocalStorage('user');
  }

  getUser() {
    let path = `usuarios/`;
    /* let path = `users/${this.user().uid}/empleados`; */

    this.loading = true;

    let sub = this.firebaseService.getCollectionData(path)
      .snapshotChanges().pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })))
      ).subscribe({
        next: (resp: any) => {
          this.users = resp

          this.loading = false;
          sub.unsubscribe();
        }
      })
  }


  doRefresh(event: any) {
    setTimeout(() => {
      this.getUser();
      event.target.complete();
    }, 1000);
  }

  async deleteUser(user: Users) {
    const path = `usuarios/${user.uid}`;
    /* const path = `empleados/${employee.id}`; */
    const loading = await this.utilsService.loading();

    try {
      await loading.present();

      // Verificar si existe una imagen asociada y eliminarla
      if (user.img) {
        const imgPath = await this.firebaseService.getFilePath(user.img);
        await this.firebaseService.deleteFile(imgPath);
      }

      // Eliminar el documento de la integradora
      await this.firebaseService.deleteDocument(path);

      // Registrar la acción (Actualizacion de integradora)
      const accion = 'Eliminación de usuario';
      const usuarioId = this.user().uid;  // ID del usuario registrado
      const detalles = `Usuario: ${this.user().nombre} - Usuario: ${user.nombre}`;
      await this.firebaseService.registrarAccion(this.user().uid, usuarioId, accion, detalles);

      // Actualizar la lista local de empleados
      this.users = this.users.filter(existingIntegrator => existingIntegrator.uid !== user.uid);

      // Mostrar mensaje de éxito
      await this.utilsService.presentToast({
        message: 'Usuario eliminado exitosamente',
        duration: 2500,
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-circle',
      });

      // Cerrar el modal con éxito
      this.utilsService.dismissModal({ success: true });

    } catch (error) {
      // Manejo de errores
      console.error('Error al eliminar el usuario: ', error);

      this.utilsService.presentToast({
        message: error.message || 'Error al eliminar el usuario',
        duration: 2500,
        color: 'danger',
        position: 'bottom',
        icon: 'alert-circle',
      });

    } finally {
      // Ocultar el loading independientemente del resultado
      await loading.dismiss();
    }
  }

  async confirmDeleteUser(users: Users) {
    await this.utilsService.presentAlert({
      header: 'Eliminar integradora',
      message: '¿Deseas eliminar esta usuario?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          role: 'destructive',
          handler: async () => {
            await this.deleteUser(users);
          },
        },
      ],
    });
  }

}
