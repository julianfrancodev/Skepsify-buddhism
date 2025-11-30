import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  router = inject(Router);

  constructor() { }

  ngOnInit() {
    addIcons({ searchCircleOutline })
  }

  goToBasicSearch() {
    this.router.navigate(['tabs/tab3/basic-search']);
  }

}
