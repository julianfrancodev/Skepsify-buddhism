import { Component, OnInit } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { playOutline } from 'ionicons/icons';

@Component({
  selector: 'app-resume-session-card',
  templateUrl: './resume-session-card.component.html',
  styleUrls: ['./resume-session-card.component.scss'],
  imports: [IonIcon]
})
export class ResumeSessionCardComponent  implements OnInit {

  constructor() {
        addIcons({ playOutline });

   }

  ngOnInit() {}

}
