import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StateService } from '../../../core/services/state.service';
import { Practice, PracticeProgress } from '../../../core/models/models';

@Component({
  selector: 'app-ngondro-cards',
  templateUrl: './ngondro-cards.component.html',
  styleUrls: ['./ngondro-cards.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class NgondroCardsComponent implements OnInit {

  // Computed signal para obtener las prácticas con su progreso
  practicesWithProgress = computed(() => {
    return this.stateService.practices().map(practice => {
      const progress = this.stateService.getPracticeProgress(practice.id);
      return {
        practice,
        progress,
        percentage: this.calculatePercentage(progress)
      };
    });
  });

  constructor(
    private router: Router,
    private stateService: StateService
  ) { }

  ngOnInit() {
    console.log('Prácticas cargadas:', this.practicesWithProgress());
  }

  goToDetailsCounter(sectionId: string) {
    console.log('goToDetailsCounter:', sectionId);
    this.router.navigate([`/tabs/tab2/counter/${sectionId}`]);
  }

  /**
   * Calcula el porcentaje de progreso
   */
  calculatePercentage(progress: PracticeProgress | undefined): number {
    if (!progress || progress.targetRepetitions === 0) return 0;
    return Math.min(100, Math.round((progress.totalRepetitions / progress.targetRepetitions) * 100));
  }

  /**
   * Formatea números con separadores de miles
   */
  formatNumber(num: number): string {
    return num.toLocaleString('es-ES');
  }
}
