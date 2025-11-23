import { Component } from '@angular/core';
import {IonContent } from '@ionic/angular/standalone';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { NgondroProgressCardComponent } from './components/ngondro-progress-card/ngondro-progress-card.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonContent, DashboardHeaderComponent, NgondroProgressCardComponent],
})
export class Tab1Page {
  constructor() {}
}
