import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { NgondroCardsComponent } from './components/ngondro-cards/ngondro-cards.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonContent, NgondroCardsComponent]
})
export class Tab2Page {

  constructor() { }

}
