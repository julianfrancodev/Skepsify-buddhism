import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService, Language } from '../../../core/services/translation.service';
import {
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [
    CommonModule,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    TranslateModule
  ],
  template: `
    <div class="language-selector">
      <ion-segment
        [value]="translationService.currentLanguage()"
        (ionChange)="onLanguageChange($event)"
        mode="ios"
      >
        <ion-segment-button 
          *ngFor="let lang of translationService.availableLanguages" 
          [value]="lang.code"
        >
          <ion-label>
            <span class="flag">{{ lang.flag }}</span>
            <span class="lang-name">{{ lang.name }}</span>
          </ion-label>
        </ion-segment-button>
      </ion-segment>
    </div>
  `,
  styles: [`
    .language-selector {
      padding: 16px;
    }

    ion-segment {
      --background: rgba(92, 80, 74, 0.05);
      border-radius: 12px;
    }

    ion-segment-button {
      --color: #B8B0AB;
      --color-checked: #D79A8B;
      --indicator-color: #D79A8B;
      --indicator-height: 3px;
      min-height: 48px;
    }

    .flag {
      font-size: 20px;
      margin-right: 6px;
    }

    .lang-name {
      font-size: 14px;
      font-weight: 600;
    }

    ion-label {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
  `]
})
export class LanguageSelectorComponent {
  translationService = inject(TranslationService);

  onLanguageChange(event: any) {
    const newLang = event.detail.value as Language;
    this.translationService.setLanguage(newLang);
  }
}
