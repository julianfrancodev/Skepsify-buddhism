import { Component, OnInit } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-daily-suggestion-card',
  templateUrl: './daily-suggestion-card.component.html',
  styleUrls: ['./daily-suggestion-card.component.scss'],
  imports: [IonIcon]
})
export class DailySuggestionCardComponent  implements OnInit {

  constructor() {
    addIcons({ chevronForwardOutline });
  }

  ngOnInit() {}

}
