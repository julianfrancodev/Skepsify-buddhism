import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { arrowForwardOutline, calendarOutline, exitOutline, libraryOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sections-info-user',
  templateUrl: './sections-info-user.component.html',
  styleUrls: ['./sections-info-user.component.scss'],
  imports: [IonIcon]
})
export class SectionsInfoUserComponent implements OnInit {

  @Input() iconName: string = '';
  @Input() title: string = '';
  @Output() OnClickOpenScreen = new EventEmitter<void>();

  constructor() {
    addIcons({ timeOutline, calendarOutline, libraryOutline, exitOutline, arrowForwardOutline })
  }

  ngOnInit() { }

  handleClick() {
    this.OnClickOpenScreen.emit();
  }

}
