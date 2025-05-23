import { Component, inject, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Integrators } from 'src/app/models/integrators.model';
import { Users } from 'src/app/models/users.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateIntegratorComponent } from 'src/app/shared/components/update-integrator/update-integrator.component';

@Component({
  selector: 'app-integrator',
  templateUrl: './integrator.page.html',
  styleUrls: ['./integrator.page.scss'],
})
export class IntegratorPage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);

  loading: boolean = false;

  integrator: Integrators[] = [];

  ngOnInit() {
    this.getIntegrator();
  }

  ionViewWillEnter() {
    this.getIntegrator();
  }

  async addUpdateIntegrator(integrator?: Integrators) {
    let modal = await this.utilsService.getModal({
      component: UpdateIntegratorComponent,
      cssClass: 'add-update-integrator',
      componentProps: { integrator }
    })
    if (modal) this.getIntegrator();
  }

  user(): Users {
    return this.utilsService.getLocalStorage('user');
  }

  getIntegrator() {
    let userId = this.user().uid; // El ID del usuario autenticado
    let path = `integradoras`;  // Path de la colección de integradoras

    this.loading = true;

    let sub = this.firebaseService.getCollectionData(path)
      .snapshotChanges().pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })))
      ).subscribe({
        next: (resp: any) => {
          // Filtrar las integradoras donde el idUsuario sea igual al id del usuario autenticado
          this.integrator = resp.filter((integrator: any) => integrator.idUsuario === userId);

         /*  console.log(this.integrator); */
          this.loading = false;
          sub.unsubscribe();
        }
      });
}


  doRefresh(event: any) {
    setTimeout(() => {
      this.getIntegrator();
      event.target.complete();
    }, 1000);
  }

  async deleteIntegrator(integrator: Integrators) {
    const path = `integradoras/${integrator.id}`;
    /* const path = `empleados/${employee.id}`; */
    const loading = await this.utilsService.loading();

    try {
      await loading.present();

      // Verificar si existe una imagen asociada y eliminarla
      if (integrator.img) {
        const imgPath = await this.firebaseService.getFilePath(integrator.img);
        await this.firebaseService.deleteFile(imgPath);
      }

      // Eliminar el documento de la integradora
      await this.firebaseService.deleteDocument(path);

      // Registrar la acción (Actualizacion de integradora)
      const accion = 'Eliminación de integradora' + this.user().tipo;
      const usuarioId = this.user().uid;  // ID del usuario registrado
      const detalles = `Usuario: ${this.user().nombre} - Integradora: ${integrator.nombre}`;
      await this.firebaseService.registrarAccion(this.user().uid, usuarioId, accion, detalles);

      // Actualizar la lista local de empleados
      this.integrator = this.integrator.filter(existingIntegrator => existingIntegrator.id !== integrator.id);

      // Mostrar mensaje de éxito
      await this.utilsService.presentToast({
        message: 'Integradora eliminada exitosamente',
        duration: 2500,
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-circle',
      });

      // Cerrar el modal con éxito
      this.utilsService.dismissModal({ success: true });

    } catch (error) {
      // Manejo de errores
      console.error('Error al eliminar la integradora: ', error);

      this.utilsService.presentToast({
        message: error.message || 'Error al eliminar la integradora',
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

  async confirmDeleteEmployee(integrator: Integrators) {
    await this.utilsService.presentAlert({
      header: 'Eliminar integradora',
      message: '¿Deseas eliminar esta integradora?',
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
            await this.deleteIntegrator(integrator);
          },
        },
      ],
    });
  }

}
