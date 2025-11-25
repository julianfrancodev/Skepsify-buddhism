import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonIcon, IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackCircleOutline, keypadOutline } from 'ionicons/icons';

@Component({
  selector: 'app-details-counter-ngondro',
  templateUrl: './details-counter-ngondro.component.html',
  styleUrls: ['./details-counter-ngondro.component.scss'],
  imports: [IonIcon, IonContent]
})
export class DetailsCounterNgondroComponent implements OnInit {

  practiceId: string = '';
  pageTitle: string = 'Cargando...';
  pageEmoji: string = '🙏';

  constructor(private router: Router, private route: ActivatedRoute) {
    addIcons({ arrowBackCircleOutline, keypadOutline })
  }

  ngOnInit() {
    this.practiceId = this.route.snapshot.paramMap.get('id') || '';
    console.log('El ID recibido es:', this.practiceId); // Para proba
    this.setupPageData();
  }

  goBack() {
    this.router.navigate(['/tabs/tab2']);
  }

  // Una función simple para cambiar textos según el ID
  setupPageData() {
    switch (this.practiceId) {
      case '1':
        this.pageTitle = 'Refugio y Bodhicitta';
        this.pageEmoji = '🙏';
        break;

      case '2':
        this.pageTitle = 'Vajrasattva';
        this.pageEmoji = '✨';
        break;

      case '3':
        this.pageTitle = 'Ofrenda de Mandala';
        this.pageEmoji = '🪷';
        break;

      case '4':
        this.pageTitle = 'Guru Yoga';
        this.pageEmoji = '🧘';
        break;

      default:
        this.pageTitle = 'Práctica';
    }
  }
}
