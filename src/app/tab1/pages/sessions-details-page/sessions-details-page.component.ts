import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent, IonButton, IonChip
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { playCircleOutline, timeOutline, arrowBackCircleOutline, alertCircleOutline, musicalNotesOutline, personOutline } from 'ionicons/icons';
import { FirestoreService } from '../../../core/services/firestore.service';
import { ProgramSession, MeditationPackage } from '../../../core/models/models';

@Component({
  selector: 'app-sessions-details-page',
  templateUrl: './sessions-details-page.component.html',
  styleUrls: ['./sessions-details-page.component.scss'],
  standalone: true,
  imports: [IonChip, IonButton,
    CommonModule,
    IonContent,
    IonIcon,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ]
})
export class SessionsDetailsPageComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private firestoreService = inject(FirestoreService);

  packageId = signal<string>('');
  packageInfo = signal<MeditationPackage | null>(null);
  sessions = signal<ProgramSession[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');

  constructor() {
    addIcons({
      playCircleOutline,
      timeOutline,
      arrowBackCircleOutline,
      personOutline,
      musicalNotesOutline,
      alertCircleOutline
    });
  }

  async ngOnInit() {
    // Obtener el packageId de los parámetros de la ruta
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.packageId.set(id);
      await this.loadPackageAndSessions(id);
    } else {
      this.error.set('No se proporcionó un ID de paquete');
      this.loading.set(false);
    }
  }

  async loadPackageAndSessions(packageId: string) {
    this.loading.set(true);
    this.error.set('');

    try {
      // Primero necesitamos obtener todos los programas para encontrar el paquete
      const programs = await this.firestoreService.getPrograms();

      let packageData: MeditationPackage | null = null;
      let programId: string = '';

      // Buscar el paquete en todos los programas
      for (const program of programs) {
        const packages = await this.firestoreService.getPackagesByProgram(program.id);
        const foundPackage = packages.find(pkg => pkg.id === packageId);

        if (foundPackage) {
          packageData = foundPackage;
          programId = program.id;
          break;
        }
      }

      if (packageData && programId) {
        this.packageInfo.set(packageData);

        // Obtener las sesiones del paquete
        const sessions = await this.firestoreService.getSessionsByPackage(
          programId,
          packageId
        );

        // Ordenar las sesiones por orden
        const sortedSessions = sessions.sort((a, b) => a.order - b.order);
        this.sessions.set(sortedSessions);
      } else {
        this.error.set('No se encontró el paquete');
      }
    } catch (err) {
      console.error('Error cargando sesiones:', err);
      this.error.set('Error al cargar las sesiones del paquete');
    } finally {
      this.loading.set(false);
    }
  }

  playSession(session: ProgramSession) {
    // Navegar a la página del reproductor con el ID de la sesión
    this.router.navigate(['/tabs/sessions-player', session.id]);
  }

  goBack() {
    this.router.navigate(['/tabs/tab3/all-complete-courses']);
  }

}
