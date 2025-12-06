import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { ProgramSession } from 'src/app/core/models/models';

@Component({
  selector: 'app-daily-suggestion-card',
  templateUrl: './daily-suggestion-card.component.html',
  styleUrls: ['./daily-suggestion-card.component.scss'],
  imports: [IonIcon]
})
export class DailySuggestionCardComponent implements OnInit {

  private router = inject(Router);
  private firestoreService = inject(FirestoreService);

  dailySessions: ProgramSession[] = [];
  isLoading = true;

  constructor() {
    addIcons({ chevronForwardOutline });
  }

  async ngOnInit() {
    await this.loadDailySessions();
  }

  async loadDailySessions() {
    this.isLoading = true;
    try {
      this.dailySessions = await this.firestoreService.getDailySessions();
    } catch (error) {
      console.error('Error cargando sesiones diarias:', error);
    } finally {
      this.isLoading = false;
    }
  }

  goToShowAllCourses() {
    this.router.navigate(['/tabs/tab3/all-complete-courses']);
  }

  goToSession(session: ProgramSession) {
    this.router.navigate(['/tabs/sessions-player', session.id]);
  }

}
