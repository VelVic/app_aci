import { Component, inject, Input, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-hmodal',
  templateUrl: './hmodal.component.html',
  styleUrls: ['./hmodal.component.scss'],
})
export class HmodalComponent  implements OnInit {

  @Input() title!: string;
  @Input() isModal!: boolean;
  
  utillsService = inject(UtilsService);

  constructor() { }

  ngOnInit() {}

  dismissModal() {
    this.utillsService.dismissModal();
  }
}