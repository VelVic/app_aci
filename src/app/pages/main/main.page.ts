import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/users.model';

import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  router = inject(Router);
  firebaseService = inject(FirebaseService);
  utillsService = inject(UtilsService);
  currentPath = '';

  pages = [
    {
      title: 'Inicio',
      url: '/main/home',
      icon: 'home',
    },
    {
      title: 'Integradora',
      url: '/main/integrator',
      icon: 'business',
    },
    {
      title: 'Perfil',
      url: '/main/profile',
      icon: 'person',
    },
  ];

  admin = [
    {
      title: 'Historial',
      url: '/main/record',
      icon: 'document',
    },
    {
      title: 'Usuarios',
      url: '/main/users',
      icon: 'people',
    },
  ];

  constructor() { }

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url
    })
  }

  signOut(){
    this.firebaseService.signOut();
  }

  user(): Users{
    return this.utillsService.getLocalStorage('user');
  }

}
