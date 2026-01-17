import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonChip,
  IonIcon,
  IonButton,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { folderOutline, timeOutline, playCircleOutline, arrowBackCircleOutline } from 'ionicons/icons';
import { FirestoreService } from '../../../core/services/firestore.service';
import { ProgramSession } from '../../../core/models/models';

@Component({
  selector: 'app-all-courses-by-category',
  templateUrl: './all-courses-by-category.page.html',
  styleUrls: ['./all-courses-by-category.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonChip,
    IonIcon,
    IonButton,
    IonSpinner
  ]
})
export class AllCoursesByCategoryPage implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private firestoreService = inject(FirestoreService);

  categoryId = signal<string>('');
  categoryName = signal<string>('');
  courses = signal<ProgramSession[]>([]);
  loading = signal<boolean>(true);

  constructor() {
    addIcons({ folderOutline, timeOutline, playCircleOutline, arrowBackCircleOutline });
  }

  async ngOnInit() {
    // Obtener parámetros de la ruta
    this.route.params.subscribe(async params => {
      if (params['categoryId']) {
        const categoryId = params['categoryId'];
        this.categoryId.set(categoryId);
        this.categoryName.set(this.getCategoryName(categoryId));
        await this.loadCoursesByCategory(categoryId);
      }
    });
  }

  async loadCoursesByCategory(categoryId: string) {
    this.loading.set(true);
    try {
      // Aquí llamamos al servicio para obtener los cursos filtrados por categoría
      const allCourses = await this.firestoreService.getSessionsByCategory(categoryId);
      this.courses.set(allCourses);
    } catch (error) {
      console.error('Error loading courses by category:', error);
      this.courses.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Helper: Obtiene el nombre de la categoría
   */
  private getCategoryName(category: string): string {
    const names: Record<string, string> = {
      'compassion': 'Compasión',
      'mindfulness': 'Atención Plena',
      'wisdom': 'Sabiduría',
      'concentration': 'Concentración'
    };
    return names[category] || category;
  }

  navigateToSessionDetails(sessionId: string) {
    this.router.navigate(['/tabs/sessions-player', sessionId]);
  }

  goBack() {
    this.location.back();
  }

}
