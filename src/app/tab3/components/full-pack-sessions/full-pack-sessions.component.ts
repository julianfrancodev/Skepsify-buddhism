import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonSpinner, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline } from 'ionicons/icons';
import { FirestoreService } from '../../../core/services/firestore.service';
import { MeditationPackage } from '../../../core/models/models';

@Component({
  selector: 'app-full-pack-sessions',
  templateUrl: './full-pack-sessions.component.html',
  styleUrls: ['./full-pack-sessions.component.scss'],
  standalone: true,
  imports: [CommonModule, IonSpinner, IonIcon]
})
export class FullPackSessionsComponent implements OnInit {

  private router = inject(Router);
  private firestoreService = inject(FirestoreService);

  packages = signal<MeditationPackage[]>([]);
  loading = signal<boolean>(true);

  constructor() {
    addIcons({ lockClosedOutline });
  }

  async ngOnInit() {
    await this.loadDailyPackages();
  }

  async loadDailyPackages() {
    this.loading.set(true);
    try {
      const dailyPackages = await this.firestoreService.getDailyPackages();
      this.packages.set(dailyPackages);
    } catch (error) {
      console.error('Error cargando paquetes diarios:', error);
    } finally {
      this.loading.set(false);
    }
  }

  getLevelName(level: string): string {
    const names: Record<string, string> = {
      'beginner': 'Principiante',
      'intermediate': 'Intermedio',
      'advanced': 'Avanzado'
    };
    return names[level] || level;
  }

  navigateToPackage(pkg: MeditationPackage) {
    this.router.navigate(['/tabs/sessions-details', pkg.id]);
  }

  goToShowAllCourses() {
    this.router.navigate(['/tabs/tab3/all-complete-courses']);
  }

}
