import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Users } from 'src/app/models/users.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit {

  @Input() users: Users; // Recibimos los datos del usuario a actualizar

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  form = new FormGroup({
    uid: new FormControl(''),
    nombre: new FormControl('', [Validators.required, Validators.minLength(5)]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    tipo: new FormControl('', [Validators.required, Validators.minLength(5)]),
    contraseña: new FormControl('', [Validators.required, Validators.minLength(6)]),
    fecha: new FormControl('', [Validators.required]),
    img: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    // Aquí no necesitas volver a cargar los datos del usuario desde localStorage
    if (this.users) {
      this.form.setValue({
        uid: this.users.uid,
        nombre: this.users.nombre,
        correo: this.users.correo,
        tipo: this.users.tipo,
        contraseña: this.users.contraseña,
        fecha: this.users.fecha,
        img: this.users.img
      });
    }
  }

  async submit() {
    if (this.form.valid) {
      if (this.users) {
        this.updateIntegrator(); // Actualizar el usuario
      } else {
        this.createIntegrator(); // Crear un nuevo usuario si no existe
      }
    }
  }

  async createIntegrator() {
    let path = `usuarios`; // Colección de usuarios
  
    const loading = await this.utilsService.loading();
    await loading.present();
  
    // Registrar la acción (Creación de usuario)
    const accion = 'Creación de usuario: ' + this.form.value.tipo;
    const usuarioId = this.users?.uid || '';  // ID del usuario (si está disponible)
    const detalles = `Admin: ${this.users?.nombre} - Usuario creado: ${this.form.value.nombre}`;
    await this.firebaseService.registrarAccion(usuarioId, usuarioId, accion, detalles);
    
    // Si tienes imagen, la actualizas
    let dataUrl = this.form.value.img;
    let imgPath = `${usuarioId}/${Date.now()}`;
    let imgUrl = await this.firebaseService.updateImage(imgPath, dataUrl);
    this.form.controls.img.setValue(imgUrl);
  
    // Eliminar el campo uid si existe
    delete this.form.value.uid;
  
    // Agregar la nueva integradora a Firestore
    this.firebaseService.addDocument(path, this.form.value)
      .then(async resp => {
        // Se desactiva el modal y se muestra el mensaje de éxito
        this.utilsService.dismissModal({ succes: true });
  
        this.utilsService.presentToast({
          message: 'Usuario creado correctamente',
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
    let path = `usuarios/${this.users.uid}`; // Usamos el uid del usuario para actualizar
  
    const loading = await this.utilsService.loading();
    await loading.present();

    // Registrar la acción (Actualización de usuario)
    const accion = 'Modificación de usuario: ' + this.form.value.tipo;
    const usuarioId = this.users.uid;  // ID del usuario registrado
    const detalles = `Admin: ${this.users.nombre} - Usuario modificado: ${this.form.value.nombre}`;
    await this.firebaseService.registrarAccion(usuarioId, usuarioId, accion, detalles);

    // Si la imagen ha cambiado, la actualizamos
    if (this.form.value.img !== this.users.img) {
      let dataUrl = this.form.value.img;
      let imgPath = await this.firebaseService.getFilePath(this.users.img);
      let imgUrl = await this.firebaseService.updateImage(imgPath, dataUrl);
      this.form.controls.img.setValue(imgUrl);
    }

    delete this.form.value.uid;

    // Actualizar el documento en Firestore
    this.firebaseService.updateDocument(path, this.form.value)
      .then(async resp => {
        this.utilsService.dismissModal({ succes: true });

        this.utilsService.presentToast({
          message: 'Usuario modificado correctamente',
          duration: 4000,
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

  async takeImage() {
    const dataUrl = (await this.utilsService.takePicture('Foto del usuario')).dataUrl; // Extraer la respuesta
    this.form.controls.img.setValue(dataUrl);
  }
}
