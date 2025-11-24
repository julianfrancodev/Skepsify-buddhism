import { Component, OnInit } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { flower, flowerOutline, pencilOutline } from 'ionicons/icons';

@Component({
  selector: 'app-refuge-details',
  templateUrl: './refuge-details.component.html',
  styleUrls: ['./refuge-details.component.scss'],
  imports: [IonIcon]
})
export class RefugeDetailsComponent  implements OnInit {

  constructor() {
    addIcons({pencilOutline, flowerOutline})
  }

  ngOnInit() {}

}
