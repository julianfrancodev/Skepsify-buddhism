import { Component, computed } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { NgondroCardsComponent } from './components/ngondro-cards/ngondro-cards.component';
import { StateService } from '../core/services/state.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonContent, NgondroCardsComponent]
})
export class Tab2Page {

  // Computed para el total de repeticiones de todas las prácticas
  totalRepetitions = computed(() => {
    const progressMap = this.stateService.practiceProgress();
    let total = 0;
    progressMap.forEach(progress => {
      total += progress.totalRepetitions;
    });
    return total;
  });

  // Total objetivo (suma de todas las prácticas)
  totalTarget = computed(() => {
    return this.stateService.practices().reduce(
      (sum, practice) => sum + practice.targetRepetitions,
      0
    );
  });

  constructor(private stateService: StateService) { }

  /**
   * Formatea números con separadores de miles
   */
  formatNumber(num: number): string {
    return num.toLocaleString('es-ES');
  }

}
