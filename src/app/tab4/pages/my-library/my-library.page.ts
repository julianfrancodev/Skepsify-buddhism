import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonBadge, IonCardContent, IonCardTitle, IonCardSubtitle, IonSearchbar, IonIcon, IonButton, IonButtons } from '@ionic/angular/standalone';

@Component({
  selector: 'app-my-library',
  templateUrl: './my-library.page.html',
  styleUrls: ['./my-library.page.scss'],
  standalone: true,
  imports: [IonButtons, IonButton, IonIcon, IonSearchbar, IonCardSubtitle, IonCardTitle, IonCardContent, IonBadge, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MyLibraryPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
