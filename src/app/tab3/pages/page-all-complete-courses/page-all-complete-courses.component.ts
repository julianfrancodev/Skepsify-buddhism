import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FirestoreService } from '../../../core/services/firestore.service';
import { Program, MeditationPackage } from '../../../core/models/models';

interface ProgramWithPackages {
  program: Program;
  packages: MeditationPackage[];
}

@Component({
  selector: 'app-page-all-complete-courses',
  templateUrl: './page-all-complete-courses.component.html',
  styleUrls: ['./page-all-complete-courses.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
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
export class PageAllCompleteCoursesComponent implements OnInit {

  private firestoreService = inject(FirestoreService);
  private router = inject(Router);
  private location = inject(Location);

  programsWithPackages = signal<ProgramWithPackages[]>([]);
  loading = signal<boolean>(true);
  totalPackages = signal<number>(0);

  constructor() {
    addIcons({ folderOutline, timeOutline, playCircleOutline, arrowBackCircleOutline });
  }

  async ngOnInit() {
    await this.loadAllCourses();
  }

  async loadAllCourses() {
    this.loading.set(true);

    try {
      const programs = await this.firestoreService.getPrograms();
      const programsData: ProgramWithPackages[] = [];
      let totalCount = 0;

      for (const program of programs) {
        const packages = await this.firestoreService.getPackagesByProgram(program.id);
        if (packages.length > 0) {
          programsData.push({
            program,
            packages
          });
          totalCount += packages.length;
        }
      }

      this.programsWithPackages.set(programsData);
      this.totalPackages.set(totalCount);
    } catch (error) {
      console.error('Error cargando cursos:', error);
    } finally {
      this.loading.set(false);
    }
  }

  getCategoryName(category: string): string {
    const names: Record<string, string> = {
      'compassion': 'Compasión',
      'mindfulness': 'Atención Plena',
      'wisdom': 'Sabiduría',
      'concentration': 'Concentración'
    };
    return names[category] || category;
  }

  getLevelName(level: string): string {
    const names: Record<string, string> = {
      'beginner': 'Principiante',
      'intermediate': 'Intermedio',
      'advanced': 'Avanzado'
    };
    return names[level] || level;
  }

  navigateToPackageDetails(packageId: string) {
    this.router.navigate(['/tabs/sessions-details', packageId]);
  }

  goBack() {
    this.location.back();
  }

}
