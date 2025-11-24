import { Component, Input, OnInit } from '@angular/core';
import { IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { arrowForwardOutline, calendarOutline, exitOutline, libraryOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sections-info-user',
  templateUrl: './sections-info-user.component.html',
  styleUrls: ['./sections-info-user.component.scss'],
  imports: [IonIcon]
})
export class SectionsInfoUserComponent  implements OnInit {

  @Input() iconName: string = '';
  @Input() title: string = '';
  @Input() OnClickOpenScreen: () => void = () => {};

  constructor() {
    addIcons({timeOutline, calendarOutline, libraryOutline, exitOutline, arrowForwardOutline})
   }

  ngOnInit() {}

}
