import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon } from '@ionic/angular/standalone';
import { ProfilePictureComponent } from './components/profile-picture/profile-picture.component';
import { RefugeDetailsComponent } from './components/refuge-details/refuge-details.component';
import { StatsPractionerComponent } from './components/stats-practioner/stats-practioner.component';
import { SectionsInfoUserComponent } from './components/sections-info-user/sections-info-user.component';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, ProfilePictureComponent, RefugeDetailsComponent, StatsPractionerComponent, SectionsInfoUserComponent]
})
export class Tab4Page implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
