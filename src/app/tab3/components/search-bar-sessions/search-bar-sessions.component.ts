import { Component, OnInit } from '@angular/core';
import { IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { searchCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-search-bar-sessions',
  templateUrl: './search-bar-sessions.component.html',
  styleUrls: ['./search-bar-sessions.component.scss'],
  imports: [IonIcon]
})
export class SearchBarSessionsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    addIcons({ searchCircleOutline })
  }

}
