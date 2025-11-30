import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonChip,
  IonIcon,
  IonButton, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { playCircleOutline, timeOutline, personOutline, folderOutline } from 'ionicons/icons';
import { FirestoreService } from '../../../core/services/firestore.service';
import { Program, MeditationPackage, ProgramSession } from '../../../core/models/models';

type SearchFilter = 'all' | 'programs' | 'packages' | 'sessions';

interface SearchResult {
  type: 'program' | 'package' | 'session';
  data: Program | MeditationPackage | ProgramSession;
  programTitle?: string;
  packageTitle?: string;
}

@Component({
  selector: 'app-page-basic-search',
  templateUrl: './page-basic-search.component.html',
  styleUrls: ['./page-basic-search.component.scss'],
  standalone: true,
  imports: [IonSpinner,
    CommonModule,
    FormsModule,
    IonContent,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonChip,
    IonIcon,
    IonButton
  ]
})
export class PageBasicSearchComponent implements OnInit {
  private firestoreService = inject(FirestoreService);

  // Signals
  searchQuery = signal<string>('');
  currentFilter = signal<SearchFilter>('all');
  allPrograms = signal<Program[]>([]);
  allPackages = signal<{ pkg: MeditationPackage, programTitle: string }[]>([]);
  allSessions = signal<{ session: ProgramSession, programTitle: string, packageTitle: string }[]>([]);
  isLoading = signal<boolean>(true);

  // Computed - Resultados filtrados
  searchResults = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.currentFilter();

    if (!query) {
      // Sin búsqueda: mostrar sesiones aleatorias
      return this.getRandomSessions();
    }

    const results: SearchResult[] = [];

    // Filtrar programas
    if (filter === 'all' || filter === 'programs') {
      this.allPrograms().forEach(program => {
        if (
          program.title.toLowerCase().includes(query) ||
          program.description.toLowerCase().includes(query) ||
          program.instructor.toLowerCase().includes(query)
        ) {
          results.push({ type: 'program', data: program });
        }
      });
    }

    // Filtrar paquetes
    if (filter === 'all' || filter === 'packages') {
      this.allPackages().forEach(({ pkg, programTitle }) => {
        if (
          pkg.title.toLowerCase().includes(query) ||
          pkg.description.toLowerCase().includes(query)
        ) {
          results.push({
            type: 'package',
            data: pkg,
            programTitle
          });
        }
      });
    }

    // Filtrar sesiones
    if (filter === 'all' || filter === 'sessions') {
      this.allSessions().forEach(({ session, programTitle, packageTitle }) => {
        if (
          session.title.toLowerCase().includes(query) ||
          session.description.toLowerCase().includes(query) ||
          session.tags.some(tag => tag.toLowerCase().includes(query))
        ) {
          results.push({
            type: 'session',
            data: session,
            programTitle,
            packageTitle
          });
        }
      });
    }

    return results;
  });

  constructor() {
    addIcons({ playCircleOutline, timeOutline, personOutline, folderOutline });
  }

  async ngOnInit() {
    await this.loadAllData();
  }

  async loadAllData() {
    try {
      this.isLoading.set(true);

      // Cargar todos los programas
      const programs = await this.firestoreService.getPrograms();
      this.allPrograms.set(programs);

      // Cargar todos los paquetes y sesiones
      const packages: { pkg: MeditationPackage, programTitle: string }[] = [];
      const sessions: { session: ProgramSession, programTitle: string, packageTitle: string }[] = [];

      for (const program of programs) {
        const pkgs = await this.firestoreService.getPackagesByProgram(program.id);

        for (const pkg of pkgs) {
          packages.push({ pkg, programTitle: program.title });

          const pkgSessions = await this.firestoreService.getSessionsByPackage(program.id, pkg.id);
          pkgSessions.forEach(session => {
            sessions.push({
              session,
              programTitle: program.title,
              packageTitle: pkg.title
            });
          });
        }
      }

      this.allPackages.set(packages);
      this.allSessions.set(sessions);

    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  getRandomSessions(): SearchResult[] {
    const allSessions = this.allSessions();
    if (allSessions.length === 0) return [];

    // Obtener 6 sesiones aleatorias
    const shuffled = [...allSessions].sort(() => 0.5 - Math.random());
    const randomSessions = shuffled.slice(0, 6);

    return randomSessions.map(({ session, programTitle, packageTitle }) => ({
      type: 'session' as const,
      data: session,
      programTitle,
      packageTitle
    }));
  }

  onSearchChange(event: any) {
    this.searchQuery.set(event.detail.value || '');
  }

  onFilterChange(event: any) {
    this.currentFilter.set(event.detail.value as SearchFilter);
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
      'advanced': 'Avanzado',
      'all': 'Todos'
    };
    return names[level] || level;
  }

  // Type-safe helpers para el template
  asProgram(data: Program | MeditationPackage | ProgramSession): Program {
    return data as Program;
  }

  asPackage(data: Program | MeditationPackage | ProgramSession): MeditationPackage {
    return data as MeditationPackage;
  }

  asSession(data: Program | MeditationPackage | ProgramSession): ProgramSession {
    return data as ProgramSession;
  }
}
