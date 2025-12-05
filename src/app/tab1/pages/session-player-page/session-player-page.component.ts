import { Component, OnInit, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  IonButton,
  IonProgressBar,
  IonChip
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  playOutline,
  pauseOutline,
  arrowBackCircleOutline,
  volumeHighOutline,
  volumeMuteOutline,
  timeOutline,
  personOutline,
  musicalNotesOutline,
  alertCircleOutline,
  documentTextOutline
} from 'ionicons/icons';
import { FirestoreService } from '../../../core/services/firestore.service';
import { ProgramSession } from '../../../core/models/models';

@Component({
  selector: 'app-session-player-page',
  templateUrl: './session-player-page.component.html',
  styleUrls: ['./session-player-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonSpinner,
    IonButton,
    IonProgressBar,
    IonChip
  ]
})
export class SessionPlayerPageComponent implements OnInit {

  @ViewChild('audioPlayer', { static: false }) audioPlayer!: ElementRef<HTMLAudioElement>;

  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private firestoreService = inject(FirestoreService);

  sessionId = signal<string>('');
  session = signal<ProgramSession | null>(null);
  loading = signal<boolean>(true);
  error = signal<string>('');

  // Audio player state
  isPlaying = signal<boolean>(false);
  isMuted = signal<boolean>(false);
  currentTime = signal<number>(0);
  duration = signal<number>(0);
  progress = signal<number>(0);

  constructor() {
    addIcons({ arrowBackCircleOutline, alertCircleOutline, musicalNotesOutline, personOutline, timeOutline, volumeMuteOutline, volumeHighOutline, pauseOutline, playOutline, documentTextOutline });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.sessionId.set(id);
      await this.loadSession(id);
    } else {
      this.error.set('No se proporcionó un ID de sesión');
      this.loading.set(false);
    }
  }

  async loadSession(sessionId: string) {
    this.loading.set(true);
    this.error.set('');

    try {
      // Buscar la sesión en todos los programas y paquetes
      const programs = await this.firestoreService.getPrograms();

      let sessionData: ProgramSession | null = null;

      // Buscar en todos los programas
      for (const program of programs) {
        const packages = await this.firestoreService.getPackagesByProgram(program.id);

        // Buscar en todos los paquetes
        for (const pkg of packages) {
          const sessions = await this.firestoreService.getSessionsByPackage(program.id, pkg.id);
          const foundSession = sessions.find(s => s.id === sessionId);

          if (foundSession) {
            sessionData = foundSession;
            break;
          }
        }

        if (sessionData) break;
      }

      if (sessionData) {
        this.session.set(sessionData);
      } else {
        this.error.set('No se encontró la sesión');
      }
    } catch (err) {
      console.error('Error cargando sesión:', err);
      this.error.set('Error al cargar la sesión');
    } finally {
      this.loading.set(false);
    }
  }

  // Audio player controls
  togglePlay() {
    const audio = this.audioPlayer?.nativeElement;
    if (!audio) return;

    if (this.isPlaying()) {
      audio.pause();
      this.isPlaying.set(false);
    } else {
      audio.play();
      this.isPlaying.set(true);
    }
  }

  toggleMute() {
    const audio = this.audioPlayer?.nativeElement;
    if (!audio) return;

    audio.muted = !audio.muted;
    this.isMuted.set(audio.muted);
  }

  onTimeUpdate(event: Event) {
    const audio = event.target as HTMLAudioElement;
    this.currentTime.set(audio.currentTime);
    this.duration.set(audio.duration);
    this.progress.set((audio.currentTime / audio.duration) * 100);
  }

  onLoadedMetadata(event: Event) {
    const audio = event.target as HTMLAudioElement;
    this.duration.set(audio.duration);
  }

  onEnded() {
    this.isPlaying.set(false);
    this.currentTime.set(0);
    this.progress.set(0);
  }

  seek(event: Event) {
    const audio = this.audioPlayer?.nativeElement;
    if (!audio) return;

    const progressBar = event.target as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const clickX = (event as MouseEvent).clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * audio.duration;

    audio.currentTime = newTime;
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  goBack() {
    this.location.back();
  }

}
