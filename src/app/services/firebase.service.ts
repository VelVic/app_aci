import { inject, Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Users } from '../models/users.model';

import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { deleteObject, getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage';

import { Timestamp } from 'firebase/firestore'; // Para manejar fechas en Firestore
import { Records } from '../models/records.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsService = inject(UtilsService);

  dataRef: AngularFirestoreCollection<Users>;

  gethAuth() {
    return getAuth();
  }

  signIn(user: Users) {
    return signInWithEmailAndPassword(getAuth(), user.correo, user.contraseña);
  }

  singUp(user: Users) {
    return createUserWithEmailAndPassword(getAuth(), user.correo, user.contraseña);
  }

  updateUser(displayName: any) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  setDocument(path: any, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path: any) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsService.routerLink('/auth');
  }

  addDocument(path: any, data: any) {// esto ira enlazado a: 'users/id/empleados
    return addDoc(collection(getFirestore(), path), data) //add guarda los datos en la coleccion
  }

  async updateImage(path: any, data_url: any) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url')
      .then(() => {
        return getDownloadURL(ref(getStorage(), path))
      })
  }

  getCollectionData(path: any): AngularFirestoreCollection<Users> {
    this.dataRef = this.firestore.collection(path, ref => ref.orderBy('nombre', 'asc'));
    return this.dataRef;
  }

  getCollectionRecord(path: any): AngularFirestoreCollection<Users> {
    this.dataRef = this.firestore.collection(path, ref => ref.orderBy('fecha', 'desc'));
    return this.dataRef;
  }

  //Obtener la ruta de la imagen con su url
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }

  updateDocument(path: any, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  deleteDocument(path: any) {
    return deleteDoc(doc(getFirestore(), path));
  }

  deleteFile(path: any) {
    return deleteObject(ref(getStorage(), path));
  }

  async registrarAccion(idUsuario: string, idIntegradora: string, accion: string, detalles?: string) {
    try {
      const path = 'historial/'; // Nombre de la colección en Firestore

      // Crear el objeto que sigue la interfaz Records
      const data: Records = {
        id: doc(collection(getFirestore(), path)).id,  // Genera un ID único usando Firestore
        usuarioId: idUsuario,                  // ID del usuario que realiza la acción
        proyectoId: idIntegradora,             // ID de la integradora/proyecto
        accion: accion,                        // Descripción de la acción
        fecha: Timestamp.now().toDate().toISOString().substring(0, 10), // Fecha actual
        detalles: detalles || '',              // Detalles adicionales (si los hay)
      };

      // Guardar el registro en Firestore
      await addDoc(collection(getFirestore(), path), data);
      /* console.log('Acción registrada en historial:', data); */
    } catch (error) {
      console.error('Error al registrar la acción en historial:', error);
    }

  }
  }