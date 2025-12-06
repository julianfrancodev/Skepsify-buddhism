import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { IonIcon, IonContent, ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { arrowBackCircleOutline, keypadOutline } from 'ionicons/icons';
import { StateService } from '../../../core/services/state.service';
import { Practice, PracticeProgress } from '../../../core/models/models';
import { KeypadModalComponent } from '../../../shared/components/keypad-modal/keypad-modal.component';

@Component({
  selector: 'app-details-counter-ngondro',
  templateUrl: './details-counter-ngondro.component.html',
  styleUrls: ['./details-counter-ngondro.component.scss'],
  imports: [IonIcon, IonContent, CommonModule]
})
export class DetailsCounterNgondroComponent implements OnInit {

  practiceId: string = '';

  // Signal para el contador de la sesión actual
  currentSessionCount = signal<number>(0);

  // Computed signals para datos de la práctica
  practice = computed<Practice | undefined>(() => {
    return this.stateService.getPracticeById(this.practiceId);
  });

  progress = computed<PracticeProgress | undefined>(() => {
    return this.stateService.getPracticeProgress(this.practiceId);
  });

  // Computed para el porcentaje de progreso
  progressPercentage = computed<number>(() => {
    const prog = this.progress();
    if (!prog || prog.targetRepetitions === 0) return 0;
    return Math.min(100, (prog.totalRepetitions / prog.targetRepetitions) * 100);
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private stateService: StateService,
    private modalController: ModalController
  ) {
    addIcons({ arrowBackCircleOutline, keypadOutline })
  }

  ngOnInit() {
    this.practiceId = this.route.snapshot.paramMap.get('id') || '';
    console.log('El ID recibido es:', this.practiceId);
  }

  goBack() {
    this.location.back();
  }

  /**
   * Incrementa el contador de la sesión actual
   */
  incrementCounter(amount: number) {
    this.currentSessionCount.update(count => count + amount);
  }

  /**
   * Abre el modal de keypad para ingresar cantidad manual
   */
  async openKeypadModal() {
    const modal = await this.modalController.create({
      component: KeypadModalComponent,
      cssClass: 'keypad-modal',
      breakpoints: [0, 0.5, 0.75, 1],
      initialBreakpoint: 0.75
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.value && data.value > 0) {
      this.incrementCounter(data.value);
    }
  }

  /**
   * Guarda la sesión actual
   */
  async saveSession() {
    const count = this.currentSessionCount();

    if (count === 0) {
      console.log('No hay repeticiones para guardar');
      return;
    }

    try {
      await this.stateService.addSession(this.practiceId, count);
      console.log(`Sesión guardada: ${count} repeticiones`);

      // Resetear el contador
      this.currentSessionCount.set(0);

      // Aquí podrías mostrar un toast o mensaje de éxito
    } catch (error) {
      console.error('Error guardando sesión:', error);
      // Aquí podrías mostrar un mensaje de error
    }
  }

  /**
   * Formatea números con separadores de miles
   */
  formatNumber(num: number): string {
    return num.toLocaleString('es-ES');
  }

  /**
   * Obtiene la fecha relativa de la última sesión
   */
  getLastSessionRelativeDate(): string {
    const prog = this.progress();
    if (!prog?.lastSessionDate) return '';

    const lastDate = new Date(prog.lastSessionDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
  }
}
