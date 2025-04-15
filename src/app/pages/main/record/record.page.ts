import { Component, inject, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Records } from 'src/app/models/records.model';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss'],
})
export class RecordPage implements OnInit {

  firebaseService = inject(FirebaseService);

  record: Records[] = [];

  loading: boolean = false;

  ngOnInit() {
    this.getRecord();
  }

getRecord() {
    let path = `historial/`;//path de la coleccion de integradoras
    /* let path = `empleados/`; */

    this.loading = true;

    let sub = this.firebaseService.getCollectionRecord(path)
      .snapshotChanges().pipe(
        map(changes => changes.map(c => ({ //map recorre la coleccion de integradoras para mostrarlas
          id: c.payload.doc.id,
          ...c.payload.doc.data()//... operador de propagacion
        })))
      ).subscribe({
        next: (resp: any) => {
          this.record = resp

          /* console.log(this.record); */
          this.loading = false;
          sub.unsubscribe();
        }
      })
  }

   doRefresh(event: any) {
    setTimeout(() => {
      this.getRecord();
      event.target.complete();
    }, 1000);
  }

}
