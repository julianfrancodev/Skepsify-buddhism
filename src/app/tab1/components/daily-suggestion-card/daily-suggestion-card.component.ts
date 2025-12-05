import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-daily-suggestion-card',
  templateUrl: './daily-suggestion-card.component.html',
  styleUrls: ['./daily-suggestion-card.component.scss'],
  imports: [IonIcon]
})
export class DailySuggestionCardComponent implements OnInit {

  private router = inject(Router);

  constructor() {
    addIcons({ chevronForwardOutline });
  }

  ngOnInit() { }


  goToShowAllCourses() {
    this.router.navigate(['/tabs/tab3/all-complete-courses']);
  }

}
