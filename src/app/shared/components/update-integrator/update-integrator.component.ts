import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Users } from '../../../models/users.model';
import { Integrators } from '../../../models/integrators.model';

@Component({
  selector: 'app-update-integrator',
  templateUrl: './update-integrator.component.html',
  styleUrls: ['./update-integrator.component.scss'],
})
export class UpdateIntegratorComponent  implements OnInit {

  @Input() integrator: Integrators;

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  user= {} as Users;

  form = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', [Validators.required, Validators.minLength(5)]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(5)]),
    categoria: new FormControl('', [Validators.required, Validators.minLength(5)]),
    fechaCreacion: new FormControl('', [Validators.required]),
    estado: new FormControl('', [Validators.required, Validators.minLength(5)]),
    responsables: new FormControl('', [Validators.required, Validators.minLength(5)]),
    idUsuario: new FormControl(''),
    img: new FormControl('', [Validators.required]),
  })

  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
    if(this.integrator)this.form.setValue(this.integrator);
  }

  async submit() {
    if(this.form.valid){
      if(this.integrator) this.updateIntegrator();
      else this.createIntegrator();
    }
  }

  async createIntegrator() {
    let path = `integradoras`; // Colección de integradoras
  
    const loading = await this.utilsService.loading();
    await loading.present();
  
    // Registrar la acción (Creación de integradora)
    const accion = 'Creación de integradora: '+ this.user.tipo;
    const usuarioId = this.user.uid;  // ID del usuario registrado
    const detalles = `Usuario: ${this.user.nombre} - Integradora: ${this.form.value.nombre}`;
    await this.firebaseService.registrarAccion(this.user.uid, usuarioId, accion, detalles);
  
    // Asignar el ID del usuario al campo idUsuario
    this.form.controls.idUsuario.setValue(usuarioId);  // Aquí asignas el ID de usuario al formulario
  
    // Si tienes imagen, la actualizas
    let dataUrl = this.form.value.img;
    let imgPath = `${this.user.uid}/${Date.now()}`;
    let imgUrl = await this.firebaseService.updateImage(imgPath, dataUrl);
    this.form.controls.img.setValue(imgUrl);
  
    // Eliminar el campo id si existe
    delete this.form.value.id;
  
    // Agregar la nueva integradora a Firestore
    this.firebaseService.addDocument(path, this.form.value)
      .then(async resp => {
        // Se desactiva el modal y se muestra el mensaje de éxito
        this.utilsService.dismissModal({ succes: true });
  
        this.utilsService.presentToast({
          message: 'Integradora creada correctamente',
          duration: 3000,
          color: 'success',
          position: 'bottom',
          icon: 'checkmark-circle'
        });
        this.utilsService.dismissModal(true);
      }).catch(error => {
        console.log(error);
        this.utilsService.presentToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'bottom',
          icon: 'alert-circle'
        });
      }).finally(() => {
        loading.dismiss();
      });
  }

  async updateIntegrator() {
    let path = `integradoras/${this.integrator.id}`
    /* let path = `integradoras/${this.integrator.id}` */

    const loading = await this.utilsService.loading();
    await loading.present();

    // Registrar la acción (Actualizacion de integradora)
    const accion = 'Modificación de integradora: ' + this.user.tipo;
    const usuarioId = this.user.uid;  // ID del usuario registrado
    const detalles = `Usuario: ${this.user.nombre} - Integradora: ${this.form.value.nombre}`;
    await this.firebaseService.registrarAccion(this.user.uid, usuarioId, accion, detalles);

    if(this.form.value.img !== this.integrator.img){
      let dataUrl = this.form.value.img;
      let imgPath = await this.firebaseService.getFilePath(this.integrator.img);
      let imgUrl = await this.firebaseService.updateImage(imgPath, dataUrl);

      this.form.controls.img.setValue(imgUrl);
    }

    delete this.form.value.id;

    this.firebaseService.updateDocument(path, this.form.value)
      .then( async resp =>{

        this.utilsService.dismissModal({ succes: true });

        this.utilsService.presentToast({
          message: 'Integradora modificada correctamente',
          duration: 4000,
          color: 'success',
          position: 'bottom',
          icon: 'checkmark-circle'
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
  
  async takeImage() {
    const dataUrl = (await this.utilsService.takePicture('Portada de la integradora')).dataUrl// Extraer la respuesta
    this.form.controls.img.setValue(dataUrl)
  }
}
