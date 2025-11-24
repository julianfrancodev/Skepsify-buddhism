import { Component, OnInit } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss'],
  imports: [IonIcon]
})
export class ProfilePictureComponent  implements OnInit {

  constructor() {
    addIcons({personCircleOutline})
   }

  ngOnInit() {}

}
