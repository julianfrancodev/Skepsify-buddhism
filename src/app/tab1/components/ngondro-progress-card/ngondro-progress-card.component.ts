import { Component, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { StateService } from 'src/app/core/services/state.service';
import { Practice, PracticeProgress } from 'src/app/core/models/models';

@Component({
  selector: 'app-ngondro-progress-card',
  templateUrl: './ngondro-progress-card.component.html',
  styleUrls: ['./ngondro-progress-card.component.scss'],
  imports: [ButtonComponent, CommonModule]
})
export class NgondroProgressCardComponent {

  // Computed para obtener la última práctica del usuario
  lastPractice = computed<{ practice: Practice; progress: PracticeProgress } | null>(() => {
    const allSessions = this.stateService.sessions();

    if (allSessions.length === 0) {
      // Si no hay sesiones, retornar la primera práctica por defecto
      const practices = this.stateService.practices();
      const firstPractice = practices[0];
      if (firstPractice) {
        const progress = this.stateService.getPracticeProgress(firstPractice.id);
        return progress ? { practice: firstPractice, progress } : null;
      }
      return null;
    }

    // Ordenar sesiones por fecha (más reciente primero)
    const sortedSessions = [...allSessions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const lastSession = sortedSessions[0];
    const practice = this.stateService.getPracticeById(lastSession.practiceId);
    const progress = this.stateService.getPracticeProgress(lastSession.practiceId);

    if (practice && progress) {
      return { practice, progress };
    }

    return null;
  });

  // Computed para el porcentaje de progreso
  progressPercentage = computed<number>(() => {
    const data = this.lastPractice();
    if (!data || data.progress.targetRepetitions === 0) return 0;
    return Math.min(100, (data.progress.totalRepetitions / data.progress.targetRepetitions) * 100);
  });

  constructor(
    private stateService: StateService,
    private router: Router
  ) { }

  /**
   * Navega a la página de contador de la última práctica
   */
  continuePractice() {
    const data = this.lastPractice();
    if (data) {
      this.router.navigate(['/tabs/tab2/counter', data.practice.id]);
    }
  }

  /**
   * Formatea números con separadores de miles
   */
  formatNumber(num: number): string {
    return num.toLocaleString('es-ES');
  }

}
