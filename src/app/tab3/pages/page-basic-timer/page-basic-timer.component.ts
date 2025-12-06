import { Component, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { playOutline, pauseOutline, refreshOutline, arrowBackCircleOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { StateService } from 'src/app/core/services/state.service';

@Component({
  selector: 'app-page-basic-timer',
  templateUrl: './page-basic-timer.component.html',
  styleUrls: ['./page-basic-timer.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon]
})
export class PageBasicTimerComponent implements OnDestroy {

  // Signals para el estado del timer
  totalSeconds = signal<number>(300); // 5 minutos por defecto
  remainingSeconds = signal<number>(300);
  isRunning = signal<boolean>(false);

  private intervalId: any = null;
  private startTime: Date | null = null;
  private pausedSeconds: number = 0; // Segundos acumulados cuando se pausa

  // Tiempos predefinidos (en segundos)
  presetTimes = [
    { label: '5 min', seconds: 300 },
    { label: '10 min', seconds: 600 },
    { label: '15 min', seconds: 900 },
    { label: '20 min', seconds: 1200 },
    { label: '30 min', seconds: 1800 }
  ];

  // Computed para formatear el tiempo
  displayTime = computed(() => {
    const seconds = this.remainingSeconds();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  // Computed para el porcentaje de progreso
  progressPercentage = computed(() => {
    const total = this.totalSeconds();
    const remaining = this.remainingSeconds();
    if (total === 0) return 0;
    return ((total - remaining) / total) * 100;
  });

  constructor(
    private router: Router,
    private location: Location,
    private stateService: StateService
  ) {
    addIcons({ playOutline, pauseOutline, refreshOutline, arrowBackCircleOutline });
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  /**
   * Inicia o pausa el timer
   */
  toggleTimer() {
    if (this.isRunning()) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  /**
   * Inicia el timer
   */
  private startTimer() {
    if (this.remainingSeconds() === 0) {
      return;
    }

    this.isRunning.set(true);

    // Guardar el tiempo de inicio si es la primera vez
    if (!this.startTime) {
      this.startTime = new Date();
    }

    this.intervalId = setInterval(() => {
      const current = this.remainingSeconds();

      if (current <= 0) {
        this.stopTimer();
        this.onTimerComplete();
        return;
      }

      this.remainingSeconds.set(current - 1);
    }, 1000);
  }

  /**
   * Pausa el timer
   */
  private pauseTimer() {
    this.isRunning.set(false);

    // Acumular los segundos transcurridos
    const elapsed = this.totalSeconds() - this.remainingSeconds();
    this.pausedSeconds = elapsed;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Detiene el timer completamente
   */
  private stopTimer() {
    this.pauseTimer();
  }

  /**
   * Resetea el timer al tiempo total
   */
  resetTimer() {
    this.stopTimer();
    this.remainingSeconds.set(this.totalSeconds());
    this.startTime = null;
    this.pausedSeconds = 0;
  }

  /**
   * Establece un tiempo predefinido
   */
  setPresetTime(seconds: number) {
    this.stopTimer();
    this.totalSeconds.set(seconds);
    this.remainingSeconds.set(seconds);
    this.startTime = null;
    this.pausedSeconds = 0;
  }

  /**
   * Callback cuando el timer se completa
   */
  private async onTimerComplete() {
    const durationMinutes = Math.floor(this.totalSeconds() / 60);
    const completedSeconds = this.totalSeconds() - this.remainingSeconds();
    const completedMinutes = Math.floor(completedSeconds / 60);

    try {
      await this.stateService.addMeditationSession(
        durationMinutes,
        completedMinutes,
        true, // completed = true porque llegó a 0
        undefined
      );

      console.log('¡Timer completado! Sesión guardada en la base de datos ✨');
      // Aquí podrías agregar un sonido o vibración
      // Opcional: mostrar un toast de confirmación
    } catch (error) {
      console.error('Error guardando sesión de meditación:', error);
    }
  }

  /**
   * Navega de regreso
   */
  goBack() {
    this.location.back();
  }

}
