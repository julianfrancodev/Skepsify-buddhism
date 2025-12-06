import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { playOutline } from 'ionicons/icons';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { ProgramSession } from 'src/app/core/models/models';

@Component({
  selector: 'app-resume-session-card',
  templateUrl: './resume-session-card.component.html',
  styleUrls: ['./resume-session-card.component.scss'],
  imports: [IonIcon]
})
export class ResumeSessionCardComponent implements OnInit {

  private router = inject(Router);
  private firestoreService = inject(FirestoreService);

  trendingSession: ProgramSession | null = null;
  isLoading = true;

  constructor() {
    addIcons({ playOutline });
  }

  async ngOnInit() {
    await this.loadTrendingSession();
  }

  async loadTrendingSession() {
    this.isLoading = true;
    try {
      this.trendingSession = await this.firestoreService.getDailySession();
    } catch (error) {
      console.error('Error cargando sesión trending:', error);
    } finally {
      this.isLoading = false;
    }
  }

  goToSession() {
    if (this.trendingSession) {
      this.router.navigate(['/tabs/sessions-player', this.trendingSession.id]);
    }
  }

}
