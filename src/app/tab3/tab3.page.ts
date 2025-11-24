import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { CategorySessionsComponent } from './components/category-sessions/category-sessions.component';
import { FreeBasicTimerComponent } from './components/free-basic-timer/free-basic-timer.component';
import { FullPackSessionsComponent } from './components/full-pack-sessions/full-pack-sessions.component';
import { SearchBarSessionsComponent } from './components/search-bar-sessions/search-bar-sessions.component';
import { TitleHeaderComponent } from './components/title-header/title-header.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonContent, CategorySessionsComponent, FreeBasicTimerComponent, FullPackSessionsComponent, SearchBarSessionsComponent, TitleHeaderComponent],
})
export class Tab3Page {
  constructor() { }
}
